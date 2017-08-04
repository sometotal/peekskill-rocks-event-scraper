'use strict';

/* example data

{
  dayName: 'Wednesday',
  dayNum: 30,
  month: 'July',
  holidays: [
    'Happy National Cheesecake Day',
    'Happy Father-in-Law Day',
    'Happy International Day of\n      Friendship'
  ],
  events: [
    {
      artist: 'Peekskill Film Festival Day 2community',
      venue: 'Paramount Hudson Valley',
      url: 'http://paramounthudsonvalley.com/events/',
      day: 'Wednesday',
      time: '10:00 AM'
    },
    {
      artist: 'Rocky Horror Picture Show- 8PM',
      venue: 'Paramount Hudson Valley',
      url: 'http://paramounthudsonvalley.com/events/',
      day: 'Wednesday',
      time: '8:00 PM'
    },
    {
      artist: 'Rocky Horror Picture Show- 11PM',
      venue: 'Paramount Hudson Valley',
      url: 'http://paramounthudsonvalley.com/events/',
      day: 'Wednesday',
      time: '11:00 PM'
    }
  ]
}
*/

let tmpl = ``;

const macheteKaraoke = `
• <strong>Karaoke Night</strong>
with Tina Machete
@ <a href=“http://gleasonspeekskill.com/” target=“_blank” rel=“noopener noreferrer”>Gleason’s</a> - 9:00 pm
`;

const footer = `

<hr />

<h5>Local Markets and Other Recurring Events</h5>

• <strong>Bicycle Rentals</strong>
On Water Street, a block from the train station, next to the Peekskill Brewery.
@ <a href="https://www.facebook.com/PedalPeekskill/" target="_blank" rel="noopener noreferrer">Pedal Peekskill</a>

• <strong><a href="http://peekskillfarmersmarket.com/" target="_blank" rel="noopener noreferrer">The Peekskill Farmer's Market</a></strong>
Outdoors on Bank Street, 8 am - 2 pm, every Saturday.

• <strong>Hudson River Cruises</strong>
From the Dock at Peekskill Riverfront Green
<a href="http://peekskill.rocks/wp-content/uploads/2015/07/trinity_1.png"><img class="alignleft size-full wp-image-1480" src="http://peekskill.rocks/wp-content/uploads/2015/07/trinity_1.png" alt="trinity_1" width="887" height="183" /></a>
@ <a href="http://www.trinitycruises.com/">Trinity Cruises</a>

• <strong>Free Weekend Shuttle</strong>
From the Peekskill Train Station to the Downtown Gazebo
sponsored by <a href="http://gopeekskill.com/" target="_blank" rel="noopener noreferrer">GoPeekskill</a>
Fridays - 5:00 pm to Midnight
Saturdays - 10:00 am to Midnight
Sundays - 10:00 am to 9:00 pm

<hr />

• <strong>Don't see your event listed here?</strong> Don't worry. Send a note to <a href="mailto://events@peekskill.rocks">events@peekskill.rocks</a> and we'll be sure to add it.
• Please send by 5pm on Wednesdays, to make sure it gets into the first edition of our weekly round-up.
• Or you can post on <a href="https://www.facebook.com/PeekskillRocks/" target="_blank" rel="noopener noreferrer">our Facebook page</a>.
Future events will be added to <a href="http://peekskill.rocks/calendar/" target="_blank" rel="noopener noreferrer">our peekskill.rocks calendar</a>.
`;

function tmplHeader(day) {
  tmpl += `
<h4>${day.dayName}, ${day.month} ${day.dayNum}`;
}

function tmplHolidays({holidays}) {
  holidays.forEach((h) => {
    tmpl += `
<br>${h}`;
  });
}

function tmplHeaderClose() {
  tmpl += `
</h4>
  `;
}

function tmplEvents({events}) {
  events.forEach((e) => {
    tmpl += `
• <strong>${e.artist}</strong>
@ <a href="${e.url}" target="_blank">${e.venue}</a> - ${e.time}
    `;
  });
}

function testForKaraoke({dayName, events}) {
  if (dayName !== 'Thursday') return false;

  let foundFuzzyMatch = false;

  events.forEach((e) => {
    if ((e.artist.search('Machete') != -1) || (e.venue.search('Gleason') != -1)) {
      foundFuzzyMatch = true;
    }
  });

  if (!foundFuzzyMatch) {
    tmpl += macheteKaraoke;
  }
}

module.exports = (data) => {
  data.forEach((day) => {
    tmplHeader(day);
    tmplHolidays(day);
    tmplHeaderClose();
    testForKaraoke(day);
    tmplEvents(day);
  });

  return tmpl += footer;
};

