/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable no-useless-catch */
const { Op } = require('sequelize');
const models = require('../models');
const { getDatesRange } = require('../helpers');

const { DailySalary, Employee, Attendance, DailyPayslipTemplate } = models;

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
      // const wagesPerDay = 75000;
      // const overtimePayPerHour = 10000;

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
            required: false,
          },
          {
            model: DailyPayslipTemplate,
            as: 'dailyPayslipTemplate',
            include: ['incomes', 'deductions'],
            required: true,
          },
        ],
        order: [
          // We start the order array with the model we want to sort
          [{ model: Attendance, as: 'attendances' }, 'createdAt', 'DESC'],
        ],
      });

      // return employees;

      const datesRange = getDatesRange(startDate, endDate);

      const dailySalaries = employees.map((employee) => {
        const { attendances, dailyPayslipTemplate } = employee;
        // let presentAttendances = [];
        if (Array.isArray(attendances)) {
          //   presentAttendances = attendances.filter(
          //     (attendance) => attendance.status === 'hadir_hari_kerja',
          //   );
          let summaryIncomesAmount = 0;
          let summaryDeductionAmount = 0;
          let summaryAmount = 0;
          const payments = datesRange.map((date) => {
            // let dailyPay = 0;
            // let overtimePay = 0;
            let incomesAmount = 0;
            let deductionsAmount = 0;

            const [newAttendance] = attendances.filter(
              (attendance) => attendance.date === date,
            );

            if (!newAttendance) {
              return {
                date,
                detail: {
                  incomes: [],
                  incomesAmount,
                  deductions: [],
                  deductionsAmount,
                  amount: 0,
                  status: null,
                  attendance: null,
                },
              };
            }

            const isLongShift = newAttendance.isLongShift || false;

            // 1. Loop incomes
            const dayStatus = newAttendance.status;
            const incomes = dailyPayslipTemplate.incomes.map((income) => {
              let name = income.name || 'Pendapatan (tidak ada nama)';
              let value =
                income.DailyPayslipTemplateDailySalaryIncomes.amount || 0;

              if (income.type === 'long_shift') {
                if (!isLongShift) {
                  value = 0;
                }
              }

              if (income.type === 'lembur') {
                const overtimeMinutes = newAttendance.overtime;
                const overtimeHours = Math.floor(overtimeMinutes / 60);
                name = `${name} (${overtimeHours} Jam)`;
                value *= overtimeHours;
              }

              if (income.presentOnly) {
                if (dayStatus === 'hadir_hari_kerja') {
                  return {
                    name,
                    value,
                  };
                }
                return {
                  name,
                  value: 0,
                };
              }

              return {
                name,
                value,
              };
            });
            // if (newAttendance.status === 'hadir_hari_kerja') {
            //   dailyPay = wagesPerDay;
            //   if (newAttendance.overtime && newAttendance.overtime > 0) {
            //     const overtimeMinutes = newAttendance.overtime;
            //     const overtimeHours = Math.floor(overtimeMinutes / 60);
            //     overtimePay = overtimePayPerHour * overtimeHours;
            //   }
            // }

            // const incomes = [
            //   {
            //     name: 'Uang Harian',
            //     value: dailyPay,
            //   },
            //   {
            //     name: 'Upah Lembur',
            //     value: overtimePay,
            //   },
            // ];

            // incomesAmount = dailyPay + overtimePay;
            incomesAmount = incomes
              .map((income) => income.value)
              .reduce((acc, cur) => Number(acc) + Number(cur), 0);

            const deductions = dailyPayslipTemplate.deductions.map(
              (deduction) => {
                let name = deduction.name || 'Potongan (tidak ada nama)';
                let value =
                  deduction.DailyPayslipTemplateDailySalaryDeductions.amount ||
                  0;

                if (deduction.type === 'keterlambatan') {
                  const timeLateMinutes = newAttendance.timeLate;
                  const timeLateHours = Math.ceil(timeLateMinutes / 60);
                  name = `${name} (${timeLateMinutes} Menit)`;
                  value *= timeLateHours;
                }

                if (deduction.presentOnly) {
                  if (dayStatus === 'hadir_hari_kerja') {
                    return {
                      name,
                      value,
                    };
                  }
                  return {
                    name,
                    value: 0,
                  };
                }

                return {
                  name,
                  value,
                };
              },
            );

            deductionsAmount = deductions
              .map((deduction) => deduction.value)
              .reduce((acc, cur) => Number(acc) + Number(cur), 0);

            const payAmount = incomesAmount - deductionsAmount;

            // Summary Amount Assignment
            summaryIncomesAmount += incomesAmount;
            summaryDeductionAmount += deductionsAmount;
            summaryAmount += payAmount;

            return {
              date,
              detail: {
                incomes,
                incomesAmount,
                deductionsAmount,
                deductions,
                amount: payAmount,
                status: newAttendance.status,
                attendance: newAttendance,
              },
            };
          });

          const newEmployee = employee.get();
          delete newEmployee.attendances;
          delete newEmployee.dailyPayslipTemplate;

          return {
            employee: newEmployee,
            payments,
            summary: {
              incomesAmount: summaryIncomesAmount,
              deductionsAmount: summaryDeductionAmount,
              amount: summaryAmount,
            },
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
