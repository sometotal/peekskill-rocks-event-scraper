"use strict"

// Import the dependencies
const cheerio = require("cheerio");
const req = require("tinyreq");

// build the big template
let fullTmpl = '';

// keep track of completed requests
let resCount = 0;

const template = (events, v) => {
  const { key, venue, url } = v;
  let tmpl = `
  -------------------------------------------
    ${venue}
  -------------------------------------------

  `;

  events.forEach((e, i) => {
    tmpl += `
      ${e.date}
      • ${e.artist}
      @ <a href="${url}" target="_blank">${venue}</a> - ${e.date}
    `;
  });

  return tmpl;
};

const parsers = {
  paramount: (body, v) => {
    let $ = cheerio.load(body);
    let events = [];

    $('li.event-item figcaption').each((i,e) => {
      if (i < 7) {
        let $e = $(e);
        let date = $e.find('strong').text();
        let artist = $e.find('h3').text();
        events.push({date, artist});
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

    $('.hvmusic_row1').each((i,e) => {
      // get the even rows within the first 8 rows
      if ((i < 8) && (i % 2 == 0)) {
        const td = $(e).find('td[rowspan=2]');
        const weekday = $(td).find('small').eq(0).text();
        const caldate = $(td).find('nobr').text();
        const [timestart, timeend] = $(td).find('small').eq(1).text().split('to');
        const date = `${weekday} ${caldate} ${timestart} to ${timeend}`
        const artist = $(e).find('.hvmusic_band_name').text();
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

const scrape = function(v) {
  const options = {
    url : v.url,
    headers: {
     'User-Agent': 'request'
    }
  };

  req(options, (err, body) => {
    if (err) { return err; }
    resCount ++;

    console.log(v.venue);
    const events = parsers[v.parser](body, v);
    fullTmpl += template(events, v);

    // response count to make sure all requests have finished
    // TODO move this to something more promised and dynamic
    if (resCount === config.length) {
      console.log(fullTmpl);
    }
  });
}

const config = [
  { parser: 'paramount', venue: 'Paramount Hudson Valley', url: 'http://paramounthudsonvalley.com/events/' },
  { parser: 'birdsall',  venue: 'Birdsall House', url: 'http://birdsallhouse.net/music/' },
  { parser: 'hvmusic', venue: '12 Grapes', url: 'http://hvmusic.com/listing/calentry_list_user.php?calendar_id=208' },
  { parser: 'hvmusic', venue: 'Beanrunner', url: 'http://hvmusic.com/listing/calentry_list_user.php?calendar_id=256' },
  { parser: 'tpch', venue: 'Peekskill Coffee House', url: 'http://peekskillcoffee.com/events' },
  { parser: 'hudson', venue: 'Hudson Room', url: 'https://www.hudsonroom.com/calendar/' },
  // { parser: 'dylans', venue: 'Dylans Wine Cellar Events', url: '' },
];

config.forEach((v) => scrape(v));
// scrape(config[5]);

  // FACEBOOK
// Division Street Guitars, and their Facebook page
// Embark Peekskill, and their Facebook page

  // LESS ACTIVE VENUES
// { parser: 'gleasons', venue: 'Gleasons', url: '' },
// Division Street Grill Events
// Iron Vine
// Kyle’s Pub
// McDonald & Peacock Cider House
// Peekskill Brewery
// The Quiet Man Public House
// Ruben’s Mexican Café
// Taco Dive Bar
// Trinity Cruises on the tour boat Evening Star
// Westchester Community College — Center for Digital Arts
// Peekskill Farmers’ Market
// The Field Library
// Peekskill BID Events
