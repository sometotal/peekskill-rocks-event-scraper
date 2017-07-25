const moment = require('moment');
const now = moment();

const weekOffset = 4; // 4 days offset, our week starts on Thursday instead of Sunday
const weekStartMoment = moment().startOf('week').add(weekOffset, 'days');
const weekEndMoment = moment().endOf('week').add(weekOffset, 'days');

const today = new Date(); // DEPRECATED
const dayNum = today.getDate(); // DEPRECATED
const weekStart = dayNum + 3; // DEPRECATED
const weekEnd = weekStart + 6; // DEPRECATED
const monthNum = today.getMonth(); // DEPRECATED // this is dangerous, could lead to displaying previous month
const days = [ "Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday" ]; // DEPRECATED use moment(date).format('dddd')
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
