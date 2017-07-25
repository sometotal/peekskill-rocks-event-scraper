const dateData = require('./date-data');
const moment = require('moment');

let postArray = [];
let date = moment(dateData.weekStartMoment);

while (dateData.isThisWeek(date)) {
  postArray.push({
    dayName: date.format('dddd'),
    dayNum: date.date(),
    date: moment(date),
    month: date.format('MMMM'),
    holidays: [],
    events: []
  });

  date.add(1, 'day');
}

module.exports = postArray;
