const dateData = require('./date-data');
const month = dateData.month;
let dayNum = dateData.weekStart;

let postArray = [];

dateData.days.forEach((day) => {
  postArray.push({
    dayName: day,
    dayNum,
    month,
    holidays: [],
    events: []
  });
  dayNum++;
});

module.exports = postArray;
