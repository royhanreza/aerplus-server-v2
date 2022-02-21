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
const attendance = require('./routes/attendance');
const permissionCategory = require('./routes/permissioncategory');
const sickApplication = require('./routes/sickapplication');
const permissionApplication = require('./routes/permissionapplication');
const eventCalendar = require('./routes/eventcalendar');

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
  attendance(app);
  permissionCategory(app);
  sickApplication(app);
  permissionApplication(app);
  eventCalendar(app);
  return app;
};
