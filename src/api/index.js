const { Router } = require('express');
const employee = require('./routes/employee');
const inspection = require('./routes/inspection');
const auth = require('./routes/auth');
const designation = require('./routes/designation');
const department = require('./routes/department');
const organization = require('./routes/organization');
const jobTitle = require('./routes/jobtitle');
const jobLevel = require('./routes/joblevel');
const career = require('./routes/career');
const office = require('./routes/office');
const workingPattern = require('./routes/workingpattern');
const attendance = require('./routes/attendance');
const permissionCategory = require('./routes/permissioncategory');
const sickApplication = require('./routes/sickapplication');
const permissionApplication = require('./routes/permissionapplication');
const leaveApplication = require('./routes/leaveapplication');
const eventCalendar = require('./routes/eventcalendar');
const dailySalary = require('./routes/dailysalary');
const outlet = require('./routes/outlet');
const organizationalStructures = require('./routes/organizationalstructures');
const dailysalaryincome = require('./routes/dailysalaryincome');
const dailysalarydeduction = require('./routes/dailysalarydeduction');
const dailypaysliptemplate = require('./routes/dailypaysliptemplate');

module.exports = () => {
  const app = Router();
  // Operational
  auth(app);
  employee(app);
  inspection(app);
  designation(app);
  department(app);
  organization(app);
  jobTitle(app);
  jobLevel(app);
  career(app);
  office(app);
  workingPattern(app);
  attendance(app);
  permissionCategory(app);
  sickApplication(app);
  permissionApplication(app);
  leaveApplication(app);
  eventCalendar(app);
  dailySalary(app);
  outlet(app);
  organizationalStructures(app);
  dailysalaryincome(app);
  dailysalarydeduction(app);
  dailypaysliptemplate(app);
  return app;
};
