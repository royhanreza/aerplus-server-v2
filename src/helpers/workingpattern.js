const dayjs = require('dayjs');

const determineWorkingPatternOrder = (
  effectiveDate = null,
  daysTo = null,
  date = null,
  numberOfDays = null,
) => {
  if (!effectiveDate || !daysTo || !date || !numberOfDays) {
    return null;
  }

  // VALIDATION

  const isValidEffectiveDate = dayjs(effectiveDate).isValid();
  const isValidDate = dayjs(date).isValid();

  if (!isValidEffectiveDate || !isValidDate) {
    return null;
  }

  if (Number.isNaN(daysTo) || Number.isNaN(numberOfDays)) {
    return null;
  }

  // END:VALIDATION

  const DAYS_TO_SUBSTRACTOR = 1;

  const newEffectiveDate = dayjs(effectiveDate).subtract(
    daysTo - DAYS_TO_SUBSTRACTOR,
    'day',
  );

  //   return newEffectiveDate;

  const diffDays = Math.abs(dayjs(newEffectiveDate).diff(dayjs(date), 'day'));

  //   return {
  //     newEffectiveDate,
  //     date: dayjs(date),
  //     diffDays,
  //   };

  const DIFF_DAYS_ADDER = 1;

  const dayOrder = (diffDays + DIFF_DAYS_ADDER) % numberOfDays;

  let finalOrder = dayOrder;

  if (dayOrder < 1) {
    finalOrder = dayOrder + numberOfDays;
  }

  return finalOrder;
};

module.exports = {
  determineWorkingPatternOrder,
};
