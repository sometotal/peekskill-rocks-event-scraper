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
  console.log('THIS AM PM THING ISN"T WORKING QUITE RIGHT AROUND THE NOON HOUR');
  let meridiem = 'AM';

  let minute = dateObj.getMinutes();
  minute = (minute > 10) ? (minute) : ('0' + minute);

  let hour = dateObj.getHours();
  if (hour > 13) {
    hour = hour - 12;
    meridiem = 'PM';
  }

  return `${hour}:${minute} ${meridiem}`;
};

const isThisWeek = (eventDayNum) => {
  return (eventDayNum >= weekStart && eventDayNum <= weekEnd);
}

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
  isThisWeek,
};
