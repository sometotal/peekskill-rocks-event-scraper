// dependencies
const Promise = require("bluebird");
const req = require('request-promise');
const cheerio = require('cheerio');

// config and utils
const { config } = require('./actions/venue-config');
const parsers = require('./actions/event-parsers');
const dateData = require('./actions/date-data');

// templating
const templater = require('./actions/templater');
const templateData = require('./actions/weekdays-skeleton');
let templateBlob;

function buildDays(body) {
  let $ = cheerio.load(body);
  let dayBlobs = $('table').eq(1).find('td').eq(3).find('p');
  let days = {};

  dayBlobs.each((i,e) => {
    const eText = $(e).text().trim();
    const eHTML = $(e).html();
    let textArray = eText.split(' ');
    const dayNumStr = textArray.shift();
    const dayNum = parseInt(dayNumStr, 10);
    let text = textArray.join(' ');
    text = `Happy ${text}`;

    if (!isNaN(dayNum) &&
        dayNum >= dateData.weekStart &&
        dayNum <= dateData.weekEnd)
    {
      templateData.forEach((e,i) => {
        if (dayNum === templateData[i].dayNum) {
          templateData[i].holidays.push(text);
        }
      });
    }
  });
}

// TODO: this is going to break when we are bridging two months
// will need to make two requests
req({
  url: `http://www.holidayinsights.com/moreholidays/${dateData.month.toLowerCase()}.htm`,
  headers: { 'User-Agent': 'request' }
})
.then(body => buildDays(body))
.then(() => {

  Promise.map(config, function(v) {
    const options = {
      url: v.feed || v.url,
      headers: {
       'User-Agent': 'request'
      }
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
    });
  }).then(function() {
    templateBlob = templater(templateData);
    console.log(templateBlob);
  });

});

// Event data
// {
//   artist: "Rockdogs",
//   venue: "Paramount Hudson Valley",
//   venueURL: "http://paramounthudsonvalley.com",
//   eventDate: "Thursday",
//   eventTime: "9:00 AM"
// }

// Template data
// [
//   {
//     dayName: "Thursday",
//     dayNum: 20,
//     holidays: [ "Pajama Day", "Unicorn Day" ],
//     events: [
//       { event data }
//     ]
//   },
//   {
//     dayName: "Friday", July 21,
//     dayNum: 21,
//     holidays: [ "Pajama Day", "Unicorn Day" ],
//     events: [
//       { event data }
//     ]
//   }
// ]
  /*
  let days = {
    '1': [
      'Some Dumb Holiday',
      'Another Dumb Holiday'
    ]
  };
  */
