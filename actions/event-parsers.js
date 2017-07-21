const cheerio = require('cheerio');
const dateData = require('./date-data');
const { weekStart, weekEnd } = dateData;

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
      date = new Date(date);

      const dayNum = date.getDate();
      const dayName = dateData.days[date.getDay()];
      const eventTime = dateData.getTime(date);

      if (dateData.isThisWeek(dayNum)) {
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
      const listing = $(e).text();
      const arr = listing.split(' - ');

      if (arr.length > 1) {
        const date = arr[0].trim();
        const artist = arr[1].trim();
        events.push({date, artist});
      }
    });

    return events;
  },
  hvmusic: (body, v) => {
    let $ = cheerio.load(eval(body.slice(15, -2)));
    let events = [];
    let count = 0;

    $('.hvmusic_calendar tr').each((i,e) => {
      const $e = $(e);
      if ($e.hasClass('hvmusic_row1') || $e.hasClass('hvmusic_row2')) {
        const td = $e.find('td[rowspan=2]');
        const weekday = $(td).find('small').eq(0).text();
        const caldate = $(td).find('nobr').text();
        const [timestart, timeend] = $(td).find('small').eq(1).text().split('to');
        const date = `${weekday} ${caldate} ${timestart} to ${timeend}`
        const artist = $e.find('.hvmusic_band_name').text();
        events.push({date, artist});
      }
    });

    return events;
  },
  tpch: (body, v) => {
    let $ = cheerio.load(body);
    let events = [];

    $('#blog li').first().find('p').each((i,e) => {
      let date;
      let artist;
      const listing = $(e).text();
      const listingArr = listing.split('~');

      if (listingArr.length > 1) {
        date = listingArr[0].trim();
        date += ' 7pm (Sunday 1pm)';
        artist = listingArr[1].trim();
        events.push({ date, artist });
      }
      else if (listingArr.length === 1) {
        const tmpVar = listingArr[0].trim();
        if (tmpVar != '') {
          date = artist = tmpVar;
          events.push({ date, artist });
        }
      }
    });

    return events;
  },
  hudson: (body, v) => {
    let $ = cheerio.load(body);
    let events = [];

    $('td.tribe-events-has-events .hentry').each((i,e) => {
      const tribeJSON = $(e).data('tribejson');
      const date = tribeJSON.startTime;
      const artist = tribeJSON.title;
      events.push({ date, artist });
    });

    return events;
  }
};

