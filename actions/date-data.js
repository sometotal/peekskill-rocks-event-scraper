const moment = require('moment');
const today = new Date();
const dayNum = today.getDate();
const weekStart = dayNum + 3; // DEPRICATED
const weekStartMoment = moment().startOf('week');
const weekEnd = weekStart + 6; // DEPRICATED
const weekEndMoment = moment().endOf('week');
const monthNum = today.getMonth(); // DEPRICATED // this is dangerous, could lead to displaying previous month
const days = [ "Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday" ]; // DEPRICATED use moment(date).format('dddd')
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'Novemeber',
  'December'
];
const month = months[monthNum];

const getTime = (dateObj) => {
  return moment(dateObj).format('h:mm A');
};

const isThisWeek = (date) => {
  return moment(date).isBetween(weekStartMoment, weekEndMoment, null, '[]');
};

console.log('WE NEED TO WORK OUT HOW TO DO THE NEXTMONTH ISSUE WHEN WE ARE BRIDGING MONTHS');

module.exports = {
  today,
  dayNum,
  weekStart,
  weekStartMoment,
  weekEnd,
  weekEndMoment,
  month,
  monthNum,
  days,
  months,
  getTime,
  isThisWeek
};
