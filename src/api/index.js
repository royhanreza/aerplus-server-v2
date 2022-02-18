const { Router } = require('express');
const employee = require('./routes/employee');
const inspection = require('./routes/inspection');
const auth = require('./routes/auth');
const designation = require('./routes/designation');
const department = require('./routes/department');
const jobTitle = require('./routes/jobtitle');
const career = require('./routes/career');
const office = require('./routes/office');
const workingPattern = require('./routes/workingpattern');

module.exports = () => {
  const app = Router();
  // Operational
  auth(app);
  employee(app);
  inspection(app);
  designation(app);
  department(app);
  jobTitle(app);
  career(app);
  office(app);
  workingPattern(app);
  return app;
};
