const dateData = require('./date-data');

let postArray = [];
let date = dateData.weekStartMoment;

while (dateData.isThisWeek(date)) {
  postArray.push({
    dayName: date.format('dddd'),
    dayNum: date.date(),
    month: date.format('MMMM'),
    holidays: [],
    events: []
  });

  date.add(1, 'day');
}

module.exports = postArray;
