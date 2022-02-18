/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable no-useless-catch */
const { Op } = require('sequelize');
const sharp = require('sharp');
const models = require('../models');
const config = require('../config');
const s3 = require('../loaders/awsS3');

const { Inspection } = models;

class InspectionService {
  static async getAll(filter) {
    try {
      const inspections = await Inspection.findAll({
        order: [[filter.orderBy, filter.orderIn]],
        where: {
          ...(filter.startDate &&
            filter.endDate && {
              datetime: {
                [Op.between]: [filter.startDate, filter.endDate],
              },
            }),
        },
        include: 'employee',
      });
      return { inspections };
    } catch (error) {
      throw error;
    }
  }

  static async paginate(page, perPage, filter) {
    try {
      const offset = (page - 1) * perPage;

      const { rows, count } = await Inspection.findAndCountAll({
        order: [[filter.orderBy, filter.orderIn]],
        where: {
          ...(filter.startDate &&
            filter.endDate && {
              datetime: {
                [Op.between]: [filter.startDate, filter.endDate],
                // [Op.and]: {
                //   [Op.gte]: filter.startDate,
                //   [Op.lte]: filter.endDate,
                // },
              },
            }),
        },
        limit: Number(perPage),
        offset: Number(offset),
        include: 'employee',
      });

      return {
        inspections: rows,
        total: count,
      };
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const inspection = await Inspection.findByPk(id, {
        include: 'employee',
      });

      return inspection;
    } catch (error) {
      throw error;
    }
  }

  static async create(inspectionInputDTO, req) {
    // eslint-disable-next-line object-curly-newline
    const { employee_id, datetime, latitude, longitude, address } =
      inspectionInputDTO;

    // const image = inspectionInputDTO.image as any;
    // if (!image.key) {
    //   throw new Error("Image is required");
    // }

    try {
      const isoDate = new Date(datetime).toISOString();

      //   return {
      //     inspection: {
      //       isoDate,
      //       isoTime,
      //     },
      //   };
      // return {
      //   inspection: inspectionInputDTO,
      // };

      const sharpOptions = { failOnError: false };

      const compressedImage = await sharp(req.file.buffer, sharpOptions)
        .metadata()
        .then(
          ({ width }) =>
            // eslint-disable-next-line implicit-arrow-linebreak
            sharp(req.file.buffer, sharpOptions)
              .resize(Math.round(width * 0.5))
              .jpeg()
              .toBuffer(),
          // eslint-disable-next-line function-paren-newline
        );

      const params = {
        ACL: 'public-read',
        Bucket: config.aws.s3.bucket,
        Body: compressedImage,
        ContentType: 'image/jpeg',
        Key: `inspections/${Date.now().toString()}.jpg`,
      };

      const data = await this.awsS3upload(params);

      const inspection = await Inspection.create({
        employeeId: Number(employee_id),
        datetime: isoDate,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        address: address.toString(),
        image: data.key,
      });

      return inspection;
    } catch (e) {
      //   const objectParams = {
      //     Bucket: 'aerplus',
      //     Key: image.key,
      //   };

      //   s3.deleteObject(objectParams, (err) => {
      //     if (err) {
      //       throw new Error(err.message);
      //     }
      //   });
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

  static async delete(id) {
    try {
      await Inspection.destroy({
        where: { id: Number(id) },
      });

      return null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = InspectionService;
