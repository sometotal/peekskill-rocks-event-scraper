'use strict';

console.log('=================================')
console.log(' ----- Its Log!! Its Log!!! -----');
console.log('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~')

// dependencies
const Promise = require('bluebird');
const req = require('request-promise');
const cheerio = require('cheerio');
const moment = require('moment');

// config and utils
const {config} = require('./modules/venue-config');
const parsers = require('./modules/event-parsers');
const dateData = require('./modules/date-data');

// templating
const templater = require('./modules/templater');
const templateData = require('./modules/weekdays-skeleton');
let templateBlob;

const buildDays = (body, month, year) => {
  let $ = cheerio.load(body);
  let dayBlobs = $('h2:contains(Holidays)').parent().find('p');
  let days = {};

  dayBlobs.each((i, e) => {
    const eText = $(e).text().trim();
    const eHTML = $(e).html();
    let textArray = eText.split(' ');
    const dayNumStr = textArray.shift();
    const date = moment(`${year} ${month} ${dayNumStr}`, 'YYYY MMMM D', true);

    let text = textArray.join(' ');
    text = `Happy ${text}`;

    if (date.isValid() && dateData.isThisWeek(date)) {
      templateData.forEach((e, i) => {
        if (date.isSame(templateData[i].date, 'day')) {
          templateData[i].holidays.push(text);
        }
      });
    }
  });
}

const holidayRequester = (year, month) => {
  return req({
    url: `http://www.holidayinsights.com/moreholidays/${month}.htm`,
    headers: {'User-Agent': 'request'},
  }).then(body => buildDays(body, month, year));
};

let startMonth = dateData.weekStartMoment.format('MMMM').toLowerCase();
let startYear = dateData.weekStartMoment.year();
let endMonth = dateData.weekEndMoment.format('MMMM').toLowerCase();
let endYear = dateData.weekEndMoment.year();

holidayRequester(startYear, startMonth).then(() => {
  if (startMonth !== endMonth) {
    return holidayRequester(endYear, endMonth);
  }
}).then(() => {
  return Promise.map(config, function(v) {
    const options = {
      url: v.feed || v.url,
      headers: {
        'User-Agent': 'request',
      },
    };

    return req(options)
      .then((body) => {
        const events = parsers[v.parser](body, v);

        events.forEach((event, i) => {
          templateData.forEach((day, j) => {
            if (event.day === day.dayName) {
              templateData[j].events.push(events[i]);
            }
          });
        });
      })
      .catch((err)=> {
        console.log(v.venue, 'FAILED !!!!!!!!!');
        const body = err.response.body;
        const events = parsers[v.parser](body, v);

        events.forEach((event, i) => {
          templateData.forEach((day, j) => {
            if (event.day === day.dayName) {
              templateData[j].events.push(events[i]);
            }
          });
        });
      });
  });
}).then(() => {
  templateBlob = templater(templateData);
  console.log('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~')
  console.log(' ----- END KENNY LOGGINS -----');
  console.log('=================================')

  console.log(templateBlob);
});

