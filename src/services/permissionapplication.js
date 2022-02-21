/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable no-useless-catch */
const { Op } = require('sequelize');
const dayjs = require('dayjs');
const models = require('../models');
const s3 = require('../loaders/awsS3');
const config = require('../config');
const sequelize = require('../loaders/sequelize');

const {
  PermissionApplication,
  PermissionApprovalFlow,
  Attendance,
  PermissionCategory,
} = models;

class PermissionApplicationService {
  static async getAll() {
    try {
      const permissionApplications = await PermissionApplication.findAll();
      return { permissionApplications };
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const permissionApplication = await PermissionApplication.findByPk(id);
      return permissionApplication;
    } catch (error) {
      throw error;
    }
  }

  static async create(permissionApplicationInputDTO, req) {
    // eslint-disable-next-line object-curly-newline
    const {
      employee_id,
      permission_category_id,
      date,
      permission_dates,
      status,
      note,
    } = permissionApplicationInputDTO;

    const transaction = await sequelize.transaction();

    const splittedPermissionDates = permission_dates.split(',');

    try {
      const permissionCategory = await PermissionCategory.findByPk(
        permission_category_id,
      );

      if (!permissionCategory) {
        throw new Error('Cannot retreive permission category');
      } else {
        // eslint-disable-next-line no-lonely-if
        if (splittedPermissionDates.length > permissionCategory.maxDay) {
          throw new Error('Jumlah hari melebihi jumlah masksimal');
        }
      }

      // Date Validation
      if (Array.isArray(splittedPermissionDates)) {
        const permissionApplicationWithDate =
          await PermissionApplication.findAll({
            where: {
              employeeId: employee_id,
              [Op.or]: splittedPermissionDates.map((permissionDate) => ({
                permissionDates: {
                  [Op.like]: `%${permissionDate}%`,
                },
              })),
            },
          });

        if (permissionApplicationWithDate.length > 0) {
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
          Key: `timeoffs/permissions/${employee_id}-${Date.now().toString()}.jpg`,
        };

        attachment = await this.awsS3upload(params);
      }

      const permissionApplication = await PermissionApplication.create(
        {
          employeeId: employee_id,
          permissionCategoryId: permission_category_id,
          date,
          permissionDates: permission_dates,
          note,
          attachment: attachment ? attachment.key : null,
        },
        { transaction },
      );

      await PermissionApprovalFlow.bulkCreate(
        [
          {
            permissionApplicationId: permissionApplication.id,
            level: 1,
            status,
          },
        ],
        { transaction },
      );

      await transaction.commit();

      return permissionApplication;
    } catch (e) {
      await transaction.rollback();
      throw e.message || e;
    }
  }

  static async update(permissionApplicationInputDTO, id, req) {
    // eslint-disable-next-line object-curly-newline
    const {
      employee_id,
      permission_category_id,
      date,
      permission_dates,
      note,
    } = permissionApplicationInputDTO;

    const splittedPermissionDates = permission_dates.split(',');

    try {
      const permissionCategory = await PermissionCategory.findByPk(
        permission_category_id,
      );

      if (!permissionCategory) {
        throw new Error('Cannot retreive permission category');
      } else {
        // eslint-disable-next-line no-lonely-if
        if (splittedPermissionDates.length > permissionCategory.maxDay) {
          throw new Error('Jumlah hari melebihi jumlah masksimal');
        }
      }

      // Date Validation
      if (Array.isArray(splittedPermissionDates)) {
        const permissionApplicationWithDate =
          await PermissionApplication.findAll({
            where: {
              employeeId: employee_id,
              [Op.not]: [
                {
                  id: [Number(id)],
                },
              ],
              [Op.or]: splittedPermissionDates.map((permissionDate) => ({
                permissionDates: {
                  [Op.like]: `%${permissionDate}%`,
                },
              })),
            },
          });

        if (permissionApplicationWithDate.length > 0) {
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
          Key: `timeoffs/permissions/${employee_id}-${Date.now().toString()}.jpg`,
        };

        attachment = await this.awsS3upload(params);
      }

      const permissionApplication = await PermissionApplication.update(
        {
          employeeId: employee_id,
          permissionCategoryId: permission_category_id,
          date,
          permissionDates: permission_dates,
          note,
          attachment: attachment ? attachment.key : null,
        },
        {
          where: { id: Number(id) },
        },
      );

      return permissionApplication;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async delete(id) {
    try {
      await PermissionApplication.destroy({
        where: { id: Number(id) },
      });

      return null;
    } catch (error) {
      throw error;
    }
  }

  static async approve(permissionApplicationInputDTO, id) {
    // eslint-disable-next-line object-curly-newline
    const { confirmed_by } = permissionApplicationInputDTO;

    // const transaction = await sequelize.transaction();

    try {
      const permissionApplication = await PermissionApplication.findByPk(id, {
        include: ['approvalFlows'],
      });

      const { currentApprovalLevel } = permissionApplication;

      if (!currentApprovalLevel) {
        throw new Error('Cannot retreive current approval level');
      }

      await PermissionApprovalFlow.update(
        {
          status: 'approved',
          confirmedBy: confirmed_by,
          confirmedAt: dayjs(),
        },
        {
          where: {
            permissionApplicationId: Number(id),
            level: currentApprovalLevel,
          },
          //   transaction,
        },
      );

      const approvalFlows = await PermissionApprovalFlow.findAll({
        where: {
          permissionApplicationId: id,
        },
      });

      const pendingApprovals = approvalFlows.filter(
        (approval) => approval.status === 'pending',
      );

      if (pendingApprovals.length < 1) {
        const newCurrentApprovalLevel = currentApprovalLevel + 1;
        await PermissionApplication.update(
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

      //   await PermissionApplication.update(
      //     {
      //       status,
      //     },
      //     {
      //       where: { id: Number(id) },
      //     },
      //   );

      //   await transaction.commit();

      const newPermissionApplication = await PermissionApplication.findByPk(
        id,
        {
          include: ['approvalFlows'],
        },
      );

      if (newPermissionApplication) {
        const {
          id: permissionApplicationId,
          employeeId,
          permissionDates,
          approvalStatus,
        } = newPermissionApplication;
        if (approvalStatus === 'approved') {
          const splittedPermissionDates = permissionDates.split(',');
          if (Array.isArray(splittedPermissionDates)) {
            if (splittedPermissionDates.length > 0) {
              const attendances = splittedPermissionDates.map(
                (permissionDate) => ({
                  employeeId,
                  date: permissionDate,
                  status: 'izin',
                  permissionApplicationId,
                }),
              );
              await Attendance.bulkCreate(attendances);
            }
          }
        }
      }

      return newPermissionApplication;
    } catch (e) {
      //   await transaction.rollback();
      throw e.message || e;
    }
  }

  static async reject(permissionApplicationInputDTO, id) {
    // eslint-disable-next-line object-curly-newline
    const { confirmed_by } = permissionApplicationInputDTO;

    // const transaction = await sequelize.transaction();

    try {
      const permissionApplication = await PermissionApplication.findByPk(id, {
        include: ['approvalFlows'],
      });

      const { currentApprovalLevel } = permissionApplication;

      if (!currentApprovalLevel) {
        throw new Error('Cannot retreive current approval level');
      }

      await PermissionApprovalFlow.update(
        {
          status: 'rejected',
          confirmedBy: confirmed_by,
          confirmedAt: dayjs(),
        },
        {
          where: {
            permissionApplicationId: Number(id),
            level: currentApprovalLevel,
          },
          //   transaction,
        },
      );

      const newCurrentApprovalLevel = currentApprovalLevel + 1;
      await PermissionApplication.update(
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

      //   await PermissionApplication.update(
      //     {
      //       status,
      //     },
      //     {
      //       where: { id: Number(id) },
      //     },
      //   );

      //   await transaction.commit();

      const newPermissionApplication = await PermissionApplication.findByPk(
        id,
        {
          include: ['approvalFlows'],
        },
      );

      return newPermissionApplication;
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

module.exports = PermissionApplicationService;
