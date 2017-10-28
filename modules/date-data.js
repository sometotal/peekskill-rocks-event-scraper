'use strict';

const moment = require('moment');
const now = moment();

const weekOffset = 4; // 4 days offset, our week starts on Thursday instead of Sunday
const weekStartMoment = moment().startOf('week').add(weekOffset, 'days');
const weekEndMoment = moment().endOf('week').add(weekOffset, 'days');

const getTime = (dateObj) => {
  return moment(dateObj).format('h:mm A');
};

const isThisWeek = (date) => {
  return moment(date).isBetween(weekStartMoment, weekEndMoment, null, '[]');
};

module.exports = {
  weekStartMoment,
  weekEndMoment,
  getTime,
  isThisWeek,
};
