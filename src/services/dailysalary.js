/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable no-useless-catch */
const { Op } = require('sequelize');
const models = require('../models');
const { getDatesRange } = require('../helpers');

const { DailySalary, Employee, Attendance } = models;

class DailySalaryService {
  static async getAll() {
    try {
      const dailySalaries = await DailySalary.findAll();
      return { dailySalaries };
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const dailySalary = await DailySalary.findByPk(id);
      return dailySalary;
    } catch (error) {
      throw error;
    }
  }

  static async create(dailySalaryInputDTO) {
    // eslint-disable-next-line object-curly-newline
    const { name, phone, address, longitude, latitude } = dailySalaryInputDTO;

    try {
      const dailySalaryWithName = await DailySalary.findOne({
        where: {
          name,
        },
      });

      if (dailySalaryWithName) {
        throw new Error('Nama kantor sudah digunakan');
      }

      const dailySalary = await DailySalary.create({
        name,
        phone,
        address,
        longitude,
        latitude,
      });
      return dailySalary;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async update(dailySalaryInputDTO, id) {
    // eslint-disable-next-line object-curly-newline
    const { name, phone, address, longitude, latitude } = dailySalaryInputDTO;

    try {
      // Check existing name
      const dailySalaryWithName = await DailySalary.findOne({
        where: {
          name,
          // active,
          [Op.not]: [
            {
              id: [Number(id)],
            },
          ],
        },
      });

      if (dailySalaryWithName) {
        throw new Error('Nama kantor sudah digunakan');
      }

      await DailySalary.update(
        {
          name,
          phone,
          address,
          longitude,
          latitude,
        },
        {
          where: { id: Number(id) },
        },
      );

      const dailySalary = await DailySalary.findByPk(Number(id));

      return dailySalary;
    } catch (e) {
      throw e.message || e;
    }
  }

  static async delete(id) {
    try {
      await DailySalary.destroy({
        where: { id: Number(id) },
      });

      return null;
    } catch (error) {
      throw error;
    }
  }

  static async generate(startDate, endDate) {
    try {
      if (!startDate || !endDate) {
        throw new Error("'start_date' or 'end_date' cannot be empty");
      }

      // ! DEVELOPMENT VALUE
      // TODO: GET VALUE FROM DATABASE
      const wagesPerDay = 75000;
      const overtimePayPerHour = 10000;

      // !-------------------

      const employees = await Employee.findAll({
        include: [
          {
            model: Attendance,
            as: 'attendances',
            where: {
              date: {
                [Op.between]: [startDate, endDate],
              },
            },
          },
        ],
        order: [
          // We start the order array with the model we want to sort
          [{ model: Attendance, as: 'attendances' }, 'createdAt', 'DESC'],
        ],
      });

      //   return employees;

      const datesRange = getDatesRange(startDate, endDate);

      const dailySalaries = employees.map((employee) => {
        const { attendances } = employee;
        // let presentAttendances = [];
        if (Array.isArray(attendances)) {
          //   presentAttendances = attendances.filter(
          //     (attendance) => attendance.status === 'hadir_hari_kerja',
          //   );
          const payments = datesRange.map((date) => {
            let dailyPay = 0;
            let overtimePay = 0;

            const [newAttendance] = attendances.filter(
              (attendance) => attendance.date === date,
            );

            if (!newAttendance) {
              return {
                date,
                detail: {
                  incomes: [],
                  deductions: [],
                  amount: dailyPay,
                  status: 'tidak_hadir',
                  attendance: null,
                },
              };
            }

            if (newAttendance.status === 'hadir_hari_kerja') {
              dailyPay = wagesPerDay;
              if (newAttendance.overtime && newAttendance.overtime > 0) {
                const overtimeMinutes = newAttendance.overtime;
                const overtimeHours = Math.floor(overtimeMinutes / 60);
                overtimePay = overtimePayPerHour * overtimeHours;
              }
            }

            const payAmount = dailyPay + overtimePay;

            return {
              date,
              detail: {
                incomes: [
                  {
                    name: 'Uang Harian',
                    value: dailyPay,
                  },
                  {
                    name: 'Upah Lembur',
                    value: overtimePay,
                  },
                ],
                deductions: [],
                amount: payAmount,
                status: newAttendance.status,
                attendance: newAttendance,
              },
            };
          });

          const newEmployee = employee.get();
          delete newEmployee.attendances;

          return {
            employee: newEmployee,
            payments,
          };
        }

        return [];
      });

      //   return dayjs('2022-02-01');

      return dailySalaries;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DailySalaryService;
