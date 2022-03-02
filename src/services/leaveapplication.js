/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable no-useless-catch */
const { Op } = require('sequelize');
const dayjs = require('dayjs');
const models = require('../models');
const s3 = require('../loaders/awsS3');
const config = require('../config');
const sequelize = require('../loaders/sequelize');
const EmployeeService = require('./employee');

const { LeaveApplication, LeaveApprovalFlow, Attendance, Leave } = models;

const employeeServiceInstance = EmployeeService;

class LeaveApplicationService {
  static async getAll() {
    try {
      const leaveApplications = await LeaveApplication.findAll({
        include: ['approvalFlows'],
      });
      return { leaveApplications };
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const leaveApplication = await LeaveApplication.findByPk(id, {
        include: ['approvalFlows'],
      });
      return leaveApplication;
    } catch (error) {
      throw error;
    }
  }

  static async create(leaveApplicationInputDTO, req) {
    // eslint-disable-next-line object-curly-newline
    const { employee_id, date, leave_dates, status, note } =
      leaveApplicationInputDTO;

    const transaction = await sequelize.transaction();

    const splittedLeaveDates = leave_dates.split(',');

    try {
      // Date Validation
      if (Array.isArray(splittedLeaveDates)) {
        const leaveApplicationWithDate = await LeaveApplication.findAll({
          where: {
            employeeId: employee_id,
            [Op.or]: splittedLeaveDates.map((leaveDate) => ({
              leaveDates: {
                [Op.like]: `%${leaveDate}%`,
              },
            })),
          },
        });

        if (leaveApplicationWithDate.length > 0) {
          throw new Error('Anda sudah mengajukan cuti di salah satu tanggal');
        }
      }

      let attachment = null;

      if (req.file) {
        const params = {
          ACL: 'public-read',
          Bucket: config.aws.s3.bucket,
          Body: req.file.buffer,
          ContentType: 'image/jpeg',
          Key: `timeoffs/leaves/${employee_id}-${Date.now().toString()}.jpg`,
        };

        attachment = await this.awsS3upload(params);
      }

      const leaveApplication = await LeaveApplication.create(
        {
          employeeId: employee_id,
          date,
          leaveDates: leave_dates,
          note,
          attachment: attachment ? attachment.key : null,
        },
        { transaction },
      );

      await LeaveApprovalFlow.bulkCreate(
        [
          {
            leaveApplicationId: leaveApplication.id,
            level: 1,
            status,
          },
        ],
        { transaction },
      );

      await transaction.commit();

      return leaveApplication;
    } catch (e) {
      await transaction.rollback();
      throw e.message || e;
    }
  }

  static async update(leaveApplicationInputDTO, id, req) {
    // eslint-disable-next-line object-curly-newline
    const { employee_id, date, leave_dates, note } = leaveApplicationInputDTO;

    const splittedLeaveDates = leave_dates.split(',');

    try {
      // Date Validation
      if (Array.isArray(splittedLeaveDates)) {
        const leaveApplicationWithDate = await LeaveApplication.findAll({
          where: {
            employeeId: employee_id,
            [Op.not]: [
              {
                id: [Number(id)],
              },
            ],
            [Op.or]: splittedLeaveDates.map((leaveDate) => ({
              leaveDates: {
                [Op.like]: `%${leaveDate}%`,
              },
            })),
          },
        });

        if (leaveApplicationWithDate.length > 0) {
          throw new Error('Anda sudah mengajukan cuti di salah satu tanggal');
        }
      }

      let attachment = null;

      if (req.file) {
        const params = {
          ACL: 'public-read',
          Bucket: config.aws.s3.bucket,
          Body: req.file.buffer,
          ContentType: 'image/jpeg',
          Key: `timeoffs/leaves/${employee_id}-${Date.now().toString()}.jpg`,
        };

        attachment = await this.awsS3upload(params);
      }

      const leaveApplication = await LeaveApplication.update(
        {
          employeeId: employee_id,
          date,
          leaveDates: leave_dates,
          note,
          attachment: attachment ? attachment.key : null,
        },
        {
          where: { id: Number(id) },
        },
      );

      return leaveApplication;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async delete(id) {
    try {
      await LeaveApplication.destroy({
        where: { id: Number(id) },
      });

      return null;
    } catch (error) {
      throw error;
    }
  }

  static async approve(leaveApplicationInputDTO, id) {
    // eslint-disable-next-line object-curly-newline
    const { confirmed_by } = leaveApplicationInputDTO;

    const approvalTransaction = await sequelize.transaction();

    try {
      const leaveApplication = await LeaveApplication.findByPk(id, {
        include: ['approvalFlows'],
      });

      const { currentApprovalLevel } = leaveApplication;

      if (!currentApprovalLevel) {
        throw new Error('Cannot retreive current approval level');
      }

      await LeaveApprovalFlow.update(
        {
          status: 'approved',
          confirmedBy: confirmed_by,
          confirmedAt: dayjs(),
        },
        {
          where: {
            leaveApplicationId: Number(id),
            level: currentApprovalLevel,
          },
          //   transaction,
        },
      );

      const approvalFlows = await LeaveApprovalFlow.findAll({
        where: {
          leaveApplicationId: id,
        },
      });

      const pendingApprovals = approvalFlows.filter(
        (approval) => approval.status === 'pending',
      );

      if (pendingApprovals.length < 1) {
        const newCurrentApprovalLevel = currentApprovalLevel + 1;
        await LeaveApplication.update(
          {
            approvalStatus:
              pendingApprovals.length < 1 ? 'approved' : 'pending',
            currentApprovalLevel: newCurrentApprovalLevel,
          },
          {
            where: {
              id,
            },
            // transaction,
          },
        );
      }

      //   await LeaveApplication.update(
      //     {
      //       status,
      //     },
      //     {
      //       where: { id: Number(id) },
      //     },
      //   );

      //   await transaction.commit();

      const newLeaveApplication = await LeaveApplication.findByPk(id, {
        include: ['approvalFlows'],
      });

      if (newLeaveApplication) {
        const {
          id: leaveApplicationId,
          employeeId,
          leaveDates,
          approvalStatus,
        } = newLeaveApplication;
        if (approvalStatus === 'approved') {
          const splittedLeaveDates = leaveDates.split(',');
          if (Array.isArray(splittedLeaveDates)) {
            if (splittedLeaveDates.length > 0) {
              const attendances = splittedLeaveDates.map((leaveDate) => ({
                employeeId,
                date: leaveDate,
                status: 'cuti',
                leaveApplicationId,
              }));

              const activeLeave = await employeeServiceInstance.getActiveLeave(
                Number(leaveApplication.employeeId),
              );

              const remainingLeave =
                activeLeave.totalLeave -
                activeLeave.takenLeave -
                splittedLeaveDates.length;

              if (remainingLeave < 0) {
                throw new Error('Jumlah hari cuti melebihi sisa cuti');
              }

              await Leave.update(
                {
                  takenLeave:
                    activeLeave.takenLeave + splittedLeaveDates.length,
                },
                {
                  where: {
                    id: activeLeave.id,
                  },
                  // transaction: approvalTransaction,
                },
              );
              await Attendance.bulkCreate(attendances);
            }
          }
        }
      }

      return newLeaveApplication;
    } catch (e) {
      //   await transaction.rollback();
      throw e.message || e;
    }
  }

  static async reject(leaveApplicationInputDTO, id) {
    // eslint-disable-next-line object-curly-newline
    const { confirmed_by } = leaveApplicationInputDTO;

    // const transaction = await sequelize.transaction();

    try {
      const leaveApplication = await LeaveApplication.findByPk(id, {
        include: ['approvalFlows'],
      });

      const { currentApprovalLevel } = leaveApplication;

      if (!currentApprovalLevel) {
        throw new Error('Cannot retreive current approval level');
      }

      await LeaveApprovalFlow.update(
        {
          status: 'rejected',
          confirmedBy: confirmed_by,
          confirmedAt: dayjs(),
        },
        {
          where: {
            leaveApplicationId: Number(id),
            level: currentApprovalLevel,
          },
          //   transaction,
        },
      );

      const newCurrentApprovalLevel = currentApprovalLevel + 1;
      await LeaveApplication.update(
        {
          approvalStatus: 'rejected',
          currentApprovalLevel: newCurrentApprovalLevel,
        },
        {
          where: {
            id,
          },
          // transaction,
        },
      );

      //   await LeaveApplication.update(
      //     {
      //       status,
      //     },
      //     {
      //       where: { id: Number(id) },
      //     },
      //   );

      //   await transaction.commit();

      const newLeaveApplication = await LeaveApplication.findByPk(id, {
        include: ['approvalFlows'],
      });

      return newLeaveApplication;
    } catch (e) {
      //   await transaction.rollback();
      throw e.message || e;
    }
  }

  static awsS3upload(params) {
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  }
}

module.exports = LeaveApplicationService;
