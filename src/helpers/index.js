const dayjs = require('dayjs');

const cleanQueryFilter = (value, requirements = [], defaultValue = '') => {
  if (!value) {
    return defaultValue;
  }

  const included = requirements.includes(value);

  if (!included && requirements.length > 0) {
    return defaultValue;
  }

  return value;
};

const getDatesRange = (openTime, closeTime, amount = 1, unit = 'day') => {
  let currentDate = dayjs(openTime);
  const endDate = dayjs(closeTime);

  const ranges = [currentDate.format('YYYY-MM-DD')];

  // do {
  //   currentDate = currentDate.add(amount, unit);
  //   ranges.push(currentDate.format('YYYY-MM-DD'));
  // } while (currentDate.isBefore(endDate));

  while (currentDate.isBefore(endDate)) {
    currentDate = currentDate.add(amount, unit);
    ranges.push(currentDate.format('YYYY-MM-DD'));
  }

  return ranges;
};

module.exports = {
  cleanQueryFilter,
  getDatesRange,
};
