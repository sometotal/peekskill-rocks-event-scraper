const cheerio = require('cheerio');
const dateData = require('./date-data');
const moment = require('moment');

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

    $('li.event-item figcaption').each((i,e) => {
      const $e = $(e);
      const artist = $e.find('h3').text();

      let date = $e.find('strong').text();
      date = date.replace(/\s+/g, ' '); // cleanup whitespace
      date = moment(date, 'MMMM DD YYYY @ hh A');

      if (date.isValid() && dateData.isThisWeek(date)) {
        const dayName = date.format('dddd');
        const eventTime = dateData.getTime(date);

        events.push({
          artist,
          venue: v.venue,
          url: v.url,
          day: dayName,
          time: eventTime
        });
      }
    });

    return events;
  },
  birdsall: (body, v) => {
    let $ = cheerio.load(body);
    let events = [];

    $('.sqs-block-content p').each((i,e) => {
      const str = $(e).text();
      var [ date, artist ]= str.split('-');

      date = moment(date, 'dddd M/DD @ hha');

      if (date.isValid() && dateData.isThisWeek(date)) {
        const dayName = date.format('dddd');
        const eventTime = dateData.getTime(date);

        events.push({
          artist,
          venue: v.venue,
          url: v.url,
          day: dayName,
          time: eventTime
        });
      }
    });

    return events;
  },
  hvmusic: (body, v) => {
    let $ = cheerio.load(eval(body.slice(15, -2)));
    let events = [];

    $('.hvmusic_calendar tr').each((i,e) => {
      const $e = $(e);
      if ($e.hasClass('hvmusic_row1') || $e.hasClass('hvmusic_row2')) {
        const td = $e.find('td[rowspan=2]');

        const caldate = $(td).find('nobr').text();
        const [timestart, timeend] = $(td).find('small').eq(1).text().split('to');
        let date = moment(`${caldate} ${timestart}`, 'MMMM D hh a');

        if (date.isValid() && dateData.isThisWeek(date)) {
          const dayName = date.format('dddd');
          const eventTime = dateData.getTime(date);

          let artist = $e.find('.hvmusic_band_name').text();
          artist = artist !== '' ? artist : $e.find('.hvmusic_headline').text();

          events.push({
            artist,
            venue: v.venue,
            url: v.url,
            day: dayName,
            time: eventTime
          });
        }
      }
    });

    return events;
  },
  tpch: (body, v) => {
    let $ = cheerio.load(body);
    let events = [];
    const month = moment().format('MMMM');

    $(`h1:contains(${month})`).parent('header').parent('article').find('p').each((i,e) => {
      const listing = $(e).text();
      const [ day, artist ]= listing.split('~');
      let date = moment(`${month} ${day}`, 'MMMM ddd Do');

      if (date.isValid() && dateData.isThisWeek(date)) {
        const dayName = date.format('dddd');
        const eventTime = dayName === 'Sunday' ? '1:00 PM' : '7:00 PM'

        events.push({
          artist: artist.trim(),
          venue: v.venue,
          url: v.url,
          day: dayName,
          time: eventTime
        });
      }
    });

    return events;
  },
  hudson: (body, v) => {
    let $ = cheerio.load(body);
    let events = [];

    $('td.tribe-events-has-events .hentry').each((i,e) => {
      const tribeJSON = $(e).data('tribejson');
      const date = moment(tribeJSON.startTime, 'MMM D @ h:ss a'); //Jul 28 @ 10:00 pm

      if (date.isValid() && dateData.isThisWeek(date)) {
        const artist = tribeJSON.title;
        const dayName = date.format('dddd');
        const eventTime = dateData.getTime(date);

        events.push({
          artist,
          venue: v.venue,
          url: v.url,
          day: dayName,
          time: eventTime
        });
      }
    });

    return events;
  }
};
