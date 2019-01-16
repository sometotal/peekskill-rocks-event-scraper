'use strict';

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

    let $tds = $('td.future');
    console.log($tds);
    let $tdToday = $('td.today');
    console.log($tdToday);

    // $('td.future').each((i, e) => {
    //   const $data = $(e).data();
    //   const date = moment($data.data-date, 'YYYY-MM-DD');

    //   if (date.isValid() && dateData.isThisWeek(date)) {
    //     let artist = tribeJSON.title;
    //     const dayName = date.format('dddd');
    //     const eventTime = dateData.getTime(date);
    //     artist = toTitleCase(artist.trim());

    //     events.push({
    //       artist,
    //       venue: v.venue,
    //       url: v.url,
    //       day: dayName,
    //       time: eventTime,
    //     });
    //   }
    // });

    return events;
  },

};

