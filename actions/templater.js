/* example data

{ dayName: 'Wednesday',
  dayNum: 30,
  month: 'July',
  holidays:
   [ 'Happy National Cheesecake Day',
     'Happy Father-in-Law Day',
     'Happy International Day of\n      Friendship' ],
  events:
   [ { artist: 'Peekskill Film Festival Day 2community',
       venue: 'Paramount Hudson Valley',
       url: 'http://paramounthudsonvalley.com/events/',
       day: 'Wednesday',
       time: '10:00 AM' },
     { artist: 'Rocky Horror Picture Show- 8PM',
       venue: 'Paramount Hudson Valley',
       url: 'http://paramounthudsonvalley.com/events/',
       day: 'Wednesday',
       time: '8:00 PM' },
     { artist: 'Rocky Horror Picture Show- 11PM',
       venue: 'Paramount Hudson Valley',
       url: 'http://paramounthudsonvalley.com/events/',
       day: 'Wednesday',
       time: '11:00 PM' } ] }
*/

module.exports = (data) => {
  let tmpl = '';

  data.forEach((day) => {
    // let tmpl = `${data.dayName}, ${data.month} ${data.dayNum}`;
    tmpl += `
      <h4>${day.dayName}, ${day.month} ${day.dayNum}`;

    day.holidays.forEach((h) => {
      tmpl += `
        <br>${h}`;
    });

    // close heading
    tmpl += `</h4>
    `;

    day.events.forEach((e, i) => {
      tmpl += `
        • <strong>${e.artist}</strong>
        @ <a href="${e.url}" target="_blank">${e.venue}</a> - ${e.time}
      `;
    });
  });

  return tmpl;
};
