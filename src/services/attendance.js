/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable no-useless-catch */
const dayjs = require('dayjs');
const { Op } = require('sequelize');
const config = require('../config');
const workingPatternHelper = require('../helpers/workingpattern');
const s3 = require('../loaders/awsS3');
const models = require('../models');

const { Attendance, Employee, WorkingPattern } = models;

class AttendanceService {
  static async getAll() {
    try {
      const attendances = await Attendance.findAll();
      return { attendances };
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const attendance = await Attendance.findByPk(id);
      return attendance;
    } catch (error) {
      throw error;
    }
  }

  static async create(attendanceInputDTO) {
    // eslint-disable-next-line object-curly-newline
    const {
      employee_id,
      date,
      clock_in,
      clock_in_at,
      clock_in_ip_address,
      clock_in_device_detail,
      clock_in_latitude,
      clock_in_longitude,
      clock_out,
      clock_out_at,
      clock_out_ip_address,
      clock_out_device_detail,
      clock_out_latitude,
      clock_out_longitude,
      status,
      time_late,
      early_leaving,
      overtime,
      approval_status,
      note,
      attachment,
      office_latitude,
      office_longitude,
    } = attendanceInputDTO;

    try {
      // const attendanceWithName = await Attendance.findOne({
      //   where: {
      //     name,
      //   },
      // });

      // if (attendanceWithName) {
      //   throw new Error('Nama kantor sudah digunakan');
      // }

      const attendance = await Attendance.create({
        employeeId: employee_id,
        date,
        clockIn: clock_in,
        clockInAt: clock_in_at,
        clockInIpAddress: clock_in_ip_address,
        clockInDeviceDetail: clock_in_device_detail,
        clockInLatitude: clock_in_latitude,
        clockInLongitude: clock_in_longitude,
        clockOut: clock_out,
        clockOutAt: clock_out_at,
        clockOutIpAddress: clock_out_ip_address,
        clcokOutDeviceDetail: clock_out_device_detail,
        clockOutLatitude: clock_out_latitude,
        clockOutLongitude: clock_out_longitude,
        status,
        timeLate: time_late,
        earlyLeaving: early_leaving,
        overtime,
        approvalStatus: approval_status,
        note,
        attachment,
        officeLatitude: office_latitude,
        officeLongitude: office_longitude,
      });
      return attendance;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async update(attendanceInputDTO, id) {
    // eslint-disable-next-line object-curly-newline
    const {
      employee_id,
      date,
      clock_in,
      clock_in_at,
      clock_in_ip_address,
      clock_in_device_detail,
      clock_in_latitude,
      clock_in_longitude,
      clock_out,
      clock_out_at,
      clock_out_ip_address,
      clock_out_device_detail,
      clock_out_latitude,
      clock_out_longitude,
      status,
      time_late,
      early_leaving,
      overtime,
      approval_status,
      note,
      attachment,
      office_latitude,
      office_longitude,
    } = attendanceInputDTO;

    try {
      await Attendance.update(
        {
          employeeId: employee_id,
          date,
          clockIn: clock_in,
          clockInAt: clock_in_at,
          clockInIpAddress: clock_in_ip_address,
          clockInDeviceDetail: clock_in_device_detail,
          clockInLatitude: clock_in_latitude,
          clockInLongitude: clock_in_longitude,
          clockOut: clock_out,
          clockOutAt: clock_out_at,
          clockOutIpAddress: clock_out_ip_address,
          clcokOutDeviceDetail: clock_out_device_detail,
          clockOutLatitude: clock_out_latitude,
          clockOutLongitude: clock_out_longitude,
          status,
          timeLate: time_late,
          earlyLeaving: early_leaving,
          overtime,
          approvalStatus: approval_status,
          note,
          attachment,
          officeLatitude: office_latitude,
          officeLongitude: office_longitude,
        },
        {
          where: { id: Number(id) },
        },
      );

      const attendance = await Attendance.findByPk(Number(id));

      return attendance;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async delete(id) {
    try {
      await Attendance.destroy({
        where: { id: Number(id) },
      });

      return null;
    } catch (error) {
      throw error;
    }
  }

  static async clockIn(attendanceInputDTO, req) {
    try {
      // eslint-disable-next-line object-curly-newline
      const {
        employee_id,
        date,
        clock_in,
        clock_in_at,
        clock_in_ip_address,
        clock_in_device_detail,
        clock_in_latitude,
        clock_in_longitude,
        clock_in_office_latitude,
        clock_in_office_longitude,
        note,
      } = attendanceInputDTO;

      const todayAttendance = await Attendance.findOne({
        where: {
          employeeId: employee_id,
          date,
          // clockIn: null,
          [Op.not]: [{ clockIn: null }],
        },
      });

      if (todayAttendance) {
        throw new Error('Anda sudah check in hari ini');
      }

      /**
       * TODO: CHECK IN STEPS
       * - Check active working pattern ✅
       * - Calculate working pattern✅
       * - calculate time late✅
       */

      // Check active working pattern
      const employee = await Employee.findByPk(employee_id, {
        include: [
          {
            model: WorkingPattern,
            as: 'workingPatterns',
            through: {
              where: { active: true },
              order: [['effectiveDate', 'DESC']],
            },
            include: ['items'],
          },
        ],
      });

      // ! Check If employee exist
      if (!employee) {
        throw new Error('Employee does not exist');
      }

      // ? Assign working pattern
      let activeWorkingPattern = null;

      const { workingPatterns } = employee;

      if (Array.isArray(workingPatterns)) {
        if (workingPatterns.length > 0) {
          [activeWorkingPattern] = workingPatterns;
        }
      }

      // ! Check If active working pattern exist
      if (!activeWorkingPattern) {
        throw new Error('Employee does not have active working pattern');
      }

      // Calculate working pattern

      const WPEffectiveDate =
        activeWorkingPattern.EmployeeWorkingPatterns.effectiveDate;
      const WPDaysTo = activeWorkingPattern.EmployeeWorkingPatterns.daysTo;
      const WPNumberOfDays = activeWorkingPattern.numberOfDays;

      const dayOrder = workingPatternHelper.determineWorkingPatternOrder(
        WPEffectiveDate,
        WPDaysTo,
        date,
        WPNumberOfDays,
      );

      // return dayOrder;

      if (dayOrder === null) {
        throw new Error('Failed to read employee working pattern');
      }

      const workingPatternDay = activeWorkingPattern.items.filter(
        (item) => Number(item.order) === Number(dayOrder),
      )[0];

      if (!workingPatternDay) {
        throw new Error('Working pattern day not found');
      }

      // return workingPatternDay;

      const timeLate = dayjs(clock_in_at).diff(
        dayjs(`${date} ${workingPatternDay.clockIn}`),
        'minute',
      );

      let attachment = null;

      if (req.file) {
        const params = {
          ACL: 'public-read',
          Bucket: config.aws.s3.bucket,
          Body: req.file.buffer,
          ContentType: 'image/jpeg',
          Key: `attendances/clockins/${employee_id}-${Date.now().toString()}.jpg`,
        };

        attachment = await this.awsS3upload(params);
      }

      const attendance = await Attendance.create({
        employeeId: employee_id,
        date,
        clockIn: clock_in,
        clockInAt: clock_in_at,
        clockInIpAddress: clock_in_ip_address,
        clockInDeviceDetail: clock_in_device_detail,
        clockInLatitude: clock_in_latitude,
        clockInLongitude: clock_in_longitude,
        clockInOfficeLatitude: clock_in_office_latitude,
        clockInOfficeLongitude: clock_in_office_longitude,
        status: 'hadir_hari_kerja',
        timeLate: timeLate > 0 ? timeLate : 0,
        clockInNote: note,
        clockInAttachment: attachment ? attachment.key : null,
      });
      return attendance;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async clockOut(attendanceInputDTO, req) {
    try {
      // eslint-disable-next-line object-curly-newline
      const {
        employee_id,
        date,
        clock_out,
        clock_out_at,
        clock_out_ip_address,
        clock_out_device_detail,
        clock_out_latitude,
        clock_out_longitude,
        clock_out_office_latitude,
        clock_out_office_longitude,
        note,
      } = attendanceInputDTO;

      const clockOutExist = await Attendance.findOne({
        where: {
          employeeId: employee_id,
          date,
          // clockIn: null,
          [Op.not]: [{ clockOut: null }],
        },
      });

      if (clockOutExist) {
        throw new Error('Anda sudah check out hari ini');
      }

      const todayAttendance = await Attendance.findOne({
        where: {
          employeeId: employee_id,
          date,
          clockOut: null,
          [Op.not]: [{ clockIn: null }],
        },
      });

      if (!todayAttendance) {
        throw new Error('Anda belum check in hari ini');
      }

      /**
       * TODO: CHECK IN STEPS
       * - Check active working pattern ✅
       * - Calculate working pattern✅
       * - calculate time late✅
       */

      // Check active working pattern
      const employee = await Employee.findByPk(employee_id, {
        include: [
          {
            model: WorkingPattern,
            as: 'workingPatterns',
            through: {
              where: { active: true },
              order: [['effectiveDate', 'DESC']],
            },
            include: ['items'],
          },
        ],
      });

      // ! Check If employee exist
      if (!employee) {
        throw new Error('Employee does not exist');
      }

      // ? Assign working pattern
      let activeWorkingPattern = null;

      const { workingPatterns } = employee;

      if (Array.isArray(workingPatterns)) {
        if (workingPatterns.length > 0) {
          [activeWorkingPattern] = workingPatterns;
        }
      }

      // ! Check If active working pattern exist
      if (!activeWorkingPattern) {
        throw new Error('Employee does not have active working pattern');
      }

      // Calculate working pattern

      const WPEffectiveDate =
        activeWorkingPattern.EmployeeWorkingPatterns.effectiveDate;
      const WPDaysTo = activeWorkingPattern.EmployeeWorkingPatterns.daysTo;
      const WPNumberOfDays = activeWorkingPattern.numberOfDays;

      const dayOrder = workingPatternHelper.determineWorkingPatternOrder(
        WPEffectiveDate,
        WPDaysTo,
        date,
        WPNumberOfDays,
      );

      // return dayOrder;

      if (dayOrder === null) {
        throw new Error('Failed to read employee working pattern');
      }

      const workingPatternDay = activeWorkingPattern.items.filter(
        (item) => Number(item.order) === Number(dayOrder),
      )[0];

      if (!workingPatternDay) {
        throw new Error('Working pattern day not found');
      }

      // earlyLeaving,
      // overtime,

      const diffMinutes = dayjs(clock_out_at).diff(
        dayjs(`${date} ${workingPatternDay.clockOut}`),
        'minute',
      );

      const earlyLeaving = diffMinutes < 0 ? Math.abs(diffMinutes) : 0;

      const overtime = diffMinutes > 0 ? diffMinutes : 0;

      let attachment = null;

      if (req.file) {
        const params = {
          ACL: 'public-read',
          Bucket: config.aws.s3.bucket,
          Body: req.file.buffer,
          ContentType: 'image/jpeg',
          Key: `attendances/clockouts/${employee_id}-${Date.now().toString()}.jpg`,
        };

        attachment = await this.awsS3upload(params);
      }

      const attendance = await Attendance.update(
        {
          employeeId: employee_id,
          date,
          clockOut: clock_out,
          clockOutAt: clock_out_at,
          clockOutIpAddress: clock_out_ip_address,
          clockOutDeviceDetail: clock_out_device_detail,
          clockOutLatitude: clock_out_latitude,
          clockOutLongitude: clock_out_longitude,
          clockOutOfficeLatitude: clock_out_office_latitude,
          clockOutOfficeLongitude: clock_out_office_longitude,
          earlyLeaving,
          overtime,
          clockOutNote: note,
          clockOutAttachment: attachment ? attachment.key : null,
        },
        {
          where: {
            id: todayAttendance.id,
          },
        },
      );
      return attendance;
    } catch (e) {
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

module.exports = AttendanceService;
