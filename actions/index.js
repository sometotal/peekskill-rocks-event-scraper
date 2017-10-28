'use strict';

// CONFIG
///////////////////////////////
const config = [
  {
    parser: 'paramount',
    venue: 'Paramount Hudson Valley',
    url: 'http://paramounthudsonvalley.com/events/',
  },
  {
    parser: 'birdsall',
    venue: 'Birdsall House',
    url: 'http://birdsallhouse.net/music/',
  },
  {
    parser: 'hvmusic',
    venue: '12 Grapes',
    feed: 'http://hvmusic.com/listing/calentry_list_user.php?calendar_id=208',
    url: 'http://www.12grapes.com/events.html',
  },
  {
    parser: 'hvmusic',
    venue: 'Beanrunner',
    feed: 'http://hvmusic.com/listing/calentry_list_user.php?calendar_id=256',
    url: 'http://beanrunnercafe.com/beanrunnermusic.html',
  },
  {
    parser: 'tpch',
    venue: 'Peekskill Coffee House',
    url: 'http://peekskillcoffee.com/events',
  },
  {
    parser: 'hudson',
    venue: 'Hudson Room',
    url: 'https://www.hudsonroom.com/calendar',
  },
];

// DATE UTILS
///////////////////////////////
const moment = require('moment');
const now = moment();

const weekOffset = 4; // 4 days offset, our week starts on Thursday instead of Sunday
const weekStartMoment = moment().startOf('week').add(weekOffset, 'days');
const weekEndMoment = moment().endOf('week').add(weekOffset, 'days');
const startMonth = weekStartMoment.format('MMMM').toLowerCase();
const startYear = weekStartMoment.year();
const endMonth = weekEndMoment.format('MMMM').toLowerCase();
const endYear = weekEndMoment.year();


const getTime = (dateObj) => {
  return moment(dateObj).format('h:mm A');
};

const isThisWeek = (date) => {
  return moment(date).isBetween(weekStartMoment, weekEndMoment, null, '[]');
};

// WEEKDAYS SKELETON
///////////////////////////////
const weekdaysSkeletonBuilder = () => {
  let postArray = [];
  let date = moment(weekStartMoment);

  while (isThisWeek(date)) {
    postArray.push({
      dayName: date.format('dddd'),
      dayNum: date.date(),
      date: moment(date),
      month: date.format('MMMM'),
      holidays: [],
      events: [],
    });

    date.add(1, 'day');
  }

  return postArray;
};
const weekdaysSkeleton = weekdaysSkeletonBuilder();

// PARSERS
///////////////////////////////
const cheerio = require('cheerio');

const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

/*
Each parsers should output an array of event data objects:
{
  artist: "Rockdogs",
  venue: "Paramount Hudson Valley",
  url: "http://paramounthudsonvalley.com",
  day: "Thursday",
  time: "9:00 PM"
}
*/

const parsers = {
  paramount: (body, v) => {
    let $ = cheerio.load(body);
    let events = [];

    $('li.event-item figcaption').each((i, e) => {
      const $e = $(e);

      let date = $e.find('strong').text();
      date = date.replace(/\s+/g, ' '); // cleanup whitespace
      date = moment(date, 'MMMM DD YYYY @ hh A');

      if (date.isValid() && isThisWeek(date)) {
        const dayName = date.format('dddd');
        const eventTime = getTime(date);
        let artist = $e.find('h3').text();
        artist = toTitleCase(artist.trim());

        events.push({
          artist,
          venue: v.venue,
          url: v.url,
          day: dayName,
          time: eventTime,
        });
      }
    });

    return events;
  },
  birdsall: (body, v) => {
    let $ = cheerio.load(body);
    let events = [];

    $('.sqs-block-content p').each((i, e) => {
      const str = $(e).text();
      let [date, artist] = str.split('-');
      date = moment(date, 'dddd M/DD @ hha');

      if (date.isValid() && isThisWeek(date)) {
        const dayName = date.format('dddd');
        const eventTime = getTime(date);
        artist = toTitleCase(artist.trim());

        events.push({
          artist,
          venue: v.venue,
          url: v.url,
          day: dayName,
          time: eventTime,
        });
      }
    });

    return events;
  },
  hvmusic: (body, v) => {
    let $ = cheerio.load(eval(body.slice(15, -2)));
    let events = [];

    $('.hvmusic_calendar tr').each((i, e) => {
      const $e = $(e);
      if ($e.hasClass('hvmusic_row1') || $e.hasClass('hvmusic_row2')) {
        const td = $e.find('td[rowspan=2]');

        const caldate = $(td).find('nobr').text();
        const [timestart, timeend] = $(td).find('small')
          .eq(1).text().split('to');
        let date = moment(`${caldate} ${timestart}`, 'MMMM D hh a');

        if (date.isValid() && isThisWeek(date)) {
          const dayName = date.format('dddd');
          const eventTime = getTime(date);

          let artist = '';
          let artistEl = $e.find('.hvmusic_band_name');
          artistEl = artistEl.text() !== '' ? artistEl : $e.find('.hvmusic_headline');

          if (artistEl.length <= 1) {
            artist = toTitleCase(artistEl.text().trim());
          }
          else {
            artistEl.each((i, a) => {
              artist = `${artist} ${$(a).text()}`;
            });

            artist = toTitleCase(artist.trim());
          }

          events.push({
            artist,
            venue: v.venue,
            url: v.url,
            day: dayName,
            time: eventTime,
          });
        }
      }
    });

    return events;
  },
  tpch: (body, v) => {
    let $ = cheerio.load(body);
    let events = [];
    let startMonth = weekStartMoment.format('MMMM');
    const endMonth = weekEndMoment.format('MMMM');

    function parser(e, month) {
      const listing = $(e).text();
      let [dddDo, artist] = listing.split('~');
      const day = dddDo.split('.').join(' ');
      let date = moment(`${month} ${day}`, 'MMMM ddd Do');

      if (date.isValid() && isThisWeek(date) && artist !== undefined) {
        const dayName = date.format('dddd');
        const eventTimeValue = dayName === 'Sunday' ? 13 : 19;
        date = date.add(eventTimeValue, 'h');
        const eventTime = getTime(date);

        artist = toTitleCase(artist.trim());

        events.push({
          artist: artist,
          venue: v.venue,
          url: v.url,
          day: dayName,
          time: eventTime,
        });
      }
    }

    $(`h1:contains(${startMonth})`).parent('header').parent('article')
      .find('p').each((i, e) => parser(e, startMonth));

    // if we are overlapping month end/start in this week
    if (startMonth !== endMonth) {
      $(`h1:contains(${endMonth})`).parent('header').parent('article')
        .find('p').each((i, e) => parser(e, endMonth));
    }

    return events;
  },
  hudson: (body, v) => {
    let $ = cheerio.load(body);
    let events = [];

    $('td.tribe-events-has-events .hentry').each((i, e) => {
      const tribeJSON = $(e).data('tribejson');
      const date = moment(tribeJSON.startTime, 'MMM D @ h:ss a');

      if (date.isValid() && isThisWeek(date)) {
        let artist = tribeJSON.title;
        const dayName = date.format('dddd');
        const eventTime = getTime(date);
        artist = toTitleCase(artist.trim());

        events.push({
          artist,
          venue: v.venue,
          url: v.url,
          day: dayName,
          time: eventTime,
        });
      }
    });

    return events;
  },
};

// MAIN/INDEX
///////////////////////////////
console.log('=================================')
console.log(' ----- BEGIN KENNY LOGGINS -----');
console.log('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~')

// dependencies
const Promise = require('bluebird');
const req = require('request-promise');

// templating
const templater = require('./templater');
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

    if (date.isValid() && isThisWeek(date)) {
      weekdaysSkeleton.forEach((e, i) => {
        if (date.isSame(weekdaysSkeleton[i].date, 'day')) {
          weekdaysSkeleton[i].holidays.push(text);
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
          weekdaysSkeleton.forEach((day, j) => {
            if (event.day === day.dayName) {
              weekdaysSkeleton[j].events.push(events[i]);
            }
          });
        });
      })
      .catch((err)=> {
        console.log(v.venue, 'FAILED !!!!!!!!!');
        const body = err.response.body;
        const events = parsers[v.parser](body, v);

        events.forEach((event, i) => {
          weekdaysSkeleton.forEach((day, j) => {
            if (event.day === day.dayName) {
              weekdaysSkeleton[j].events.push(events[i]);
            }
          });
        });
      });
  });
}).then(() => {
  templateBlob = templater(weekdaysSkeleton);
  console.log('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~')
  console.log(' ----- END KENNY LOGGINS -----');
  console.log('=================================')

  console.log(templateBlob);
});

