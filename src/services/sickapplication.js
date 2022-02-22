/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable no-useless-catch */
const { Op } = require('sequelize');
const dayjs = require('dayjs');
const models = require('../models');
const s3 = require('../loaders/awsS3');
const config = require('../config');
const sequelize = require('../loaders/sequelize');

const { SickApplication, SickApprovalFlow, Attendance } = models;

class SickApplicationService {
  static async getAll() {
    try {
      const sickApplications = await SickApplication.findAll({
        include: ['approvalFlows'],
      });
      return { sickApplications };
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const sickApplication = await SickApplication.findByPk(id, {
        include: ['approvalFlows'],
      });
      return sickApplication;
    } catch (error) {
      throw error;
    }
  }

  static async create(sickApplicationInputDTO, req) {
    // eslint-disable-next-line object-curly-newline
    const { employee_id, date, sick_dates, status, note } =
      sickApplicationInputDTO;

    const transaction = await sequelize.transaction();

    const splittedSickDates = sick_dates.split(',');

    try {
      // Date Validation
      if (Array.isArray(splittedSickDates)) {
        const sickApplicationWithDate = await SickApplication.findAll({
          where: {
            employeeId: employee_id,
            [Op.or]: splittedSickDates.map((sickDate) => ({
              sickDates: {
                [Op.like]: `%${sickDate}%`,
              },
            })),
          },
        });

        if (sickApplicationWithDate.length > 0) {
          throw new Error('Anda sudah mengajukan sakit di salah satu tanggal');
        }
      }

      let attachment = null;

      if (req.file) {
        const params = {
          ACL: 'public-read',
          Bucket: config.aws.s3.bucket,
          Body: req.file.buffer,
          ContentType: 'image/jpeg',
          Key: `timeoffs/sicks/${employee_id}-${Date.now().toString()}.jpg`,
        };

        attachment = await this.awsS3upload(params);
      }

      const sickApplication = await SickApplication.create(
        {
          employeeId: employee_id,
          date,
          sickDates: sick_dates,
          note,
          attachment: attachment ? attachment.key : null,
        },
        { transaction },
      );

      await SickApprovalFlow.bulkCreate(
        [
          {
            sickApplicationId: sickApplication.id,
            level: 1,
            status,
          },
        ],
        { transaction },
      );

      await transaction.commit();

      return sickApplication;
    } catch (e) {
      await transaction.rollback();
      throw e.message || e;
    }
  }

  static async update(sickApplicationInputDTO, id, req) {
    // eslint-disable-next-line object-curly-newline
    const { employee_id, date, sick_dates, note } = sickApplicationInputDTO;

    const splittedSickDates = sick_dates.split(',');

    try {
      // Date Validation
      if (Array.isArray(splittedSickDates)) {
        const sickApplicationWithDate = await SickApplication.findAll({
          where: {
            employeeId: employee_id,
            [Op.not]: [
              {
                id: [Number(id)],
              },
            ],
            [Op.or]: splittedSickDates.map((sickDate) => ({
              sickDates: {
                [Op.like]: `%${sickDate}%`,
              },
            })),
          },
        });

        if (sickApplicationWithDate.length > 0) {
          throw new Error('Anda sudah mengajukan sakit di salah satu tanggal');
        }
      }

      let attachment = null;

      if (req.file) {
        const params = {
          ACL: 'public-read',
          Bucket: config.aws.s3.bucket,
          Body: req.file.buffer,
          ContentType: 'image/jpeg',
          Key: `timeoffs/sicks/${employee_id}-${Date.now().toString()}.jpg`,
        };

        attachment = await this.awsS3upload(params);
      }

      const sickApplication = await SickApplication.update(
        {
          employeeId: employee_id,
          date,
          sickDates: sick_dates,
          note,
          attachment: attachment ? attachment.key : null,
        },
        {
          where: { id: Number(id) },
        },
      );

      return sickApplication;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async delete(id) {
    try {
      await SickApplication.destroy({
        where: { id: Number(id) },
      });

      return null;
    } catch (error) {
      throw error;
    }
  }

  static async approve(sickApplicationInputDTO, id) {
    // eslint-disable-next-line object-curly-newline
    const { confirmed_by } = sickApplicationInputDTO;

    // const transaction = await sequelize.transaction();

    try {
      const sickApplication = await SickApplication.findByPk(id, {
        include: ['approvalFlows'],
      });

      const { currentApprovalLevel } = sickApplication;

      if (!currentApprovalLevel) {
        throw new Error('Cannot retreive current approval level');
      }

      await SickApprovalFlow.update(
        {
          status: 'approved',
          confirmedBy: confirmed_by,
          confirmedAt: dayjs(),
        },
        {
          where: {
            sickApplicationId: Number(id),
            level: currentApprovalLevel,
          },
          //   transaction,
        },
      );

      const approvalFlows = await SickApprovalFlow.findAll({
        where: {
          sickApplicationId: id,
        },
      });

      const pendingApprovals = approvalFlows.filter(
        (approval) => approval.status === 'pending',
      );

      if (pendingApprovals.length < 1) {
        const newCurrentApprovalLevel = currentApprovalLevel + 1;
        await SickApplication.update(
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

      //   await SickApplication.update(
      //     {
      //       status,
      //     },
      //     {
      //       where: { id: Number(id) },
      //     },
      //   );

      //   await transaction.commit();

      const newSickApplication = await SickApplication.findByPk(id, {
        include: ['approvalFlows'],
      });

      if (newSickApplication) {
        const {
          id: sickApplicationId,
          employeeId,
          sickDates,
          approvalStatus,
        } = newSickApplication;
        if (approvalStatus === 'approved') {
          const splittedSickDates = sickDates.split(',');
          if (Array.isArray(splittedSickDates)) {
            if (splittedSickDates.length > 0) {
              const attendances = splittedSickDates.map((sickDate) => ({
                employeeId,
                date: sickDate,
                status: 'sakit',
                sickApplicationId,
              }));
              await Attendance.bulkCreate(attendances);
            }
          }
        }
      }

      return newSickApplication;
    } catch (e) {
      //   await transaction.rollback();
      throw e.message || e;
    }
  }

  static async reject(sickApplicationInputDTO, id) {
    // eslint-disable-next-line object-curly-newline
    const { confirmed_by } = sickApplicationInputDTO;

    // const transaction = await sequelize.transaction();

    try {
      const sickApplication = await SickApplication.findByPk(id, {
        include: ['approvalFlows'],
      });

      const { currentApprovalLevel } = sickApplication;

      if (!currentApprovalLevel) {
        throw new Error('Cannot retreive current approval level');
      }

      await SickApprovalFlow.update(
        {
          status: 'rejected',
          confirmedBy: confirmed_by,
          confirmedAt: dayjs(),
        },
        {
          where: {
            sickApplicationId: Number(id),
            level: currentApprovalLevel,
          },
          //   transaction,
        },
      );

      const newCurrentApprovalLevel = currentApprovalLevel + 1;
      await SickApplication.update(
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

      //   await SickApplication.update(
      //     {
      //       status,
      //     },
      //     {
      //       where: { id: Number(id) },
      //     },
      //   );

      //   await transaction.commit();

      const newSickApplication = await SickApplication.findByPk(id, {
        include: ['approvalFlows'],
      });

      return newSickApplication;
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

module.exports = SickApplicationService;
