'use strict';

const fs = require('fs');
const cheerio = require('cheerio');
const dateData = require('./date-data');
const moment = require('moment');

function toTitleCase(str) {
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

module.exports = {
  paramount: (body, v) => {
    let $ = cheerio.load(body);
    let events = [];

    $('li.event-item figcaption').each((i, e) => {
      const $e = $(e);

      let date = $e.find('strong').text();
      date = date.replace(/\s+/g, ' '); // cleanup whitespace
      date = moment(date, 'MMMM DD YYYY @ hh A');

      if (date.isValid() && dateData.isThisWeek(date)) {
        const dayName = date.format('dddd');
        const eventTime = dateData.getTime(date);
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

      if (date.isValid() && dateData.isThisWeek(date)) {
        const dayName = date.format('dddd');
        const eventTime = dateData.getTime(date);
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

        if (date.isValid() && dateData.isThisWeek(date)) {
          const dayName = date.format('dddd');
          const eventTime = dateData.getTime(date);

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
    let startMonth = dateData.weekStartMoment.format('MMMM').toUpperCase();
    let endMonth = dateData.weekEndMoment.format('MMMM').toUpperCase();

    function parser(e, month) {
      const listing = $(e).text();
      let [dddDo, artist] = listing.split('–');
      const day = dddDo.split('.').join(' ');
      let date = moment(`${month} ${day}`, 'MMMM ddd Do');

      if (date.isValid() && dateData.isThisWeek(date) && artist !== undefined) {
        const dayName = date.format('dddd');
        const eventTimeValue = dayName === 'Sunday' ? 13 : 19;
        date = date.add(eventTimeValue, 'h');
        const eventTime = dateData.getTime(date);

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

      if (date.isValid() && dateData.isThisWeek(date)) {
        let artist = tribeJSON.title;
        const dayName = date.format('dddd');
        const eventTime = dateData.getTime(date);
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
  fieldlib: (body, v) => {
    let $ = cheerio.load(body);
    let events = [];
    const $tdsFuture = $('td.future');
    const $tdsToday = $('td.today');

    function processObjs(objs) {
      Object.keys(objs).forEach(key => {
        const keyNum = parseInt(key, 10);
        if (keyNum >= 0) {
          const obj = objs[keyNum];
          const items = $(obj).find($('.item'));
          items.each((index, item) => {
            const $item = $(item);
            const dateText = $item.find($('.views-field-field-cal-event')).text().trim();
            const date = moment(dateText, 'MM/DD/YYYY - h:ssa' );
            if (date.isValid() && dateData.isThisWeek(date)) {
              const artist = $item.find($('.views-field-title')).text().trim();
              const day = date.format('dddd');
              const time = dateData.getTime(date);

              events.push({
                artist,
                day,
                time,
                venue: v.venue,
                url: v.url,
              });
            }
          });
        }
      });
    }

    processObjs($tdsToday);
    processObjs($tdsFuture);

    return events;
  },
  twelve: (body, v) => {
    try {
      let localFile = fs.readFileSync(v.static);
      let $ = cheerio.load(localFile);
      let events = [];
      const cards = $('.evCard');

      Object.keys(cards).forEach(key => {
        const keyNum = parseInt(key, 10);
        if (keyNum >= 0) {
          const card = cards[keyNum];
          const $card= $(card);
          const dateText = $card.find($('div[data-hook="date"]')).text().trim();
          const date = moment(dateText, 'MMM DD, h:ss A' );

          if (date.isValid() && dateData.isThisWeek(date)) {
            const artist = $card.find($('div[data-hook="title"]')).text().trim();
            const day = date.format('dddd');
            const time = dateData.getTime(date);

            events.push({
              artist,
              day,
              time,
              venue: v.venue,
              url: v.url,
            });
          }
        }
      });
      return events;
    } catch (error) {
      console.log('No local file for 12 Peekskill Lounge');
      return events;
    }
  },
};
