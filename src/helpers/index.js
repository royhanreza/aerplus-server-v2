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

module.exports = {
  cleanQueryFilter,
};
