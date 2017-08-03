# Peekskill Rocks Events Scraper

The goal: to have a serverless solution that scrapes a list of websites that host events and live music in the city of Peekskill and takes the upcoming 7 day's events and formats them in a way that is easily posted, grouped by day, to Peekskill.Rocks, our wordpress site that highlights the goings-on in Peekskill.

http://peekskill.rocks

## Run the code

Run `node .` in the top level directory and the outputted template will be console.log'd to the terminal

## Example roundup and desired full output

Below is the html of an example roundup post. The goal is to have as much of this automated as possible. There are a couple areas of editorial that will always need to be hand crafted, but I'd like to take this task from 2-3hrs down to about 20min.

```
<a href="http://peekskill.rocks/wp-content/uploads/2017/07/Screen-Shot-2017-07-27-at-11.44.37-AM.png"><img src="http://peekskill.rocks/wp-content/uploads/2017/07/Screen-Shot-2017-07-27-at-11.44.37-AM-294x300.png" alt="" width="294" height="300" class="alignnone size-medium wp-image-3465" /></a>
The <a href="http://www.peekskillfilmfestival.org/" target="_blank">Peekskill Film Festival</a> is back and happening all weekend!

<h4>Thursday, July 27
Happy Take Your Pants for a Walk Day!</h4>

<a href="http://peekskill.rocks/wp-content/uploads/2017/07/pants1.jpg"><img src="http://peekskill.rocks/wp-content/uploads/2017/07/pants1-300x289.jpg" alt="" width="300" height="289" class="alignnone size-medium wp-image-3466" /></a>

      • <strong>Karaoke Night</strong>
      with Tina Machete
      @ <a href="http://gleasonspeekskill.com/" target="_blank" rel="noopener noreferrer">Gleason's</a> - 9:00 pm



<h4>Friday, July 28
Happy System Administrator Appreciation Day!</h4>

<a href="http://peekskill.rocks/wp-content/uploads/2017/07/itfire2.gif"><img src="http://peekskill.rocks/wp-content/uploads/2017/07/itfire2.gif" alt="" width="220" height="112" class="alignnone size-full wp-image-3468" /></a>

      • Peekskill Film Festival Day 1
      @ <a href="http://paramounthudsonvalley.com/events/" target="_blank">Paramount Hudson Valley</a> - 7:00 PM

      • The Compact
      @ <a href="http://birdsallhouse.net/music/" target="_blank">Birdsall House</a> - 6pm

      • Breakfast for the Boys
      @ <a href="http://www.12grapes.com/events.html" target="_blank">12 Grapes</a> - 9:30 pm


      • The Donna Singer Quartet
      @ <a href="http://beanrunnercafe.com/beanrunnermusic.html" target="_blank">Beanrunner</a> - 8:00 pm

      • PLASM ( jazz/ jam band )
      @ <a href="http://peekskillcoffee.com/events" target="_blank">Peekskill Coffee House</a> - 7pm


      • The Sugarush Band
      @ <a href="https://www.hudsonroom.com/calendar/" target="_blank">Hudson Room</a> - 10:00 pm7pm


      • Mr Clifford
      @ <a href="https://www.peekskillbrewery.com/calendar" target="_blank">Peekskill Brewery</a> - 8:00 pm

<h4>Saturday, July 29
Happy International Tiger Day!</h4>

<a href="http://peekskill.rocks/wp-content/uploads/2017/07/tigerblink.gif"><img src="http://peekskill.rocks/wp-content/uploads/2017/07/tigerblink-300x161.gif" alt="" width="300" height="161" class="alignnone size-medium wp-image-3471" /></a>

      • Peekskill Film Festival Day 2community
      @ <a href="http://paramounthudsonvalley.com/events/" target="_blank">Paramount Hudson Valley</a> - 10:00 AM

      • Alexis Cole
      @ <a href="http://www.12grapes.com/events.html" target="_blank">Peekskill Farmers Market</a> - 10:30 am

      • Johnny Feds & Friends
      @ <a href="http://www.12grapes.com/events.html" target="_blank">12 Grapes</a> - 9:30 pm

      • Clifton Anderson Sextet<br>
      Antoine Roney (sax) Paul Beaudry (bass) Victor Gould (piano) Victor See Yuen (percussion) and Ronnie Burrage (drums)
      @ <a href="http://beanrunnercafe.com/beanrunnermusic.html" target="_blank">Beanrunner</a> - 8:00 pm

      • Matt Turk
      @ <a href="http://birdsallhouse.net/music/" target="_blank">Birdsall House</a> - 6pm

      • JOE DURAES &THE SKILLS (singer/ ORIGINALS)
      @ <a href="http://peekskillcoffee.com/events" target="_blank">Peekskill Coffee House</a> - 7pm

      • LA Soul
      @ <a href="https://www.hudsonroom.com/calendar/" target="_blank">Hudson Room</a> - 10:00 pm

<h4>Sunday, July 30
Happy International Day of Friendship!</h4>

<a href="http://peekskill.rocks/wp-content/uploads/2017/07/friendship-day.jpg"><img src="http://peekskill.rocks/wp-content/uploads/2017/07/friendship-day-300x184.jpg" alt="" width="300" height="184" class="alignnone size-medium wp-image-3470" /></a>

      • Peekskill Film Festival Day 3community
      @ <a href="http://paramounthudsonvalley.com/events/" target="_blank">Paramount Hudson Valley</a> - 12:00 PM

      • Marc Von Em
      @ <a href="http://www.12grapes.com/events.html" target="_blank">12 Grapes</a> - 6:00 pm

      • J.KAINE (originals/ singer)
      @ <a href="http://peekskillcoffee.com/events" target="_blank">Peekskill Coffee House</a> - 1pm

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
```
