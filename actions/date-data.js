const moment = require('moment');
const today = new Date();
const dayNum = today.getDate();
const weekStart = dayNum + 3;
const weekEnd = weekStart + 6;
const monthNum = today.getMonth();
const days = [ "Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday" ];
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
  return moment(date).isBetween(moment().startOf('week'), moment().endOf('week'));
};

console.log('WE NEED TO WORK OUT HOW TO DO THE NEXTMONTH ISSUE WHEN WE ARE BRIDGING MONTHS');

module.exports = {
  today,
  dayNum,
  weekStart,
  weekEnd,
  month,
  monthNum,
  days,
  months,
  getTime,
  isThisWeek
};
