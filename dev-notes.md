Dev Notes
===

2014-11-05 ~ Theo
Many nice things since last update.

It turns out, I could down load topo30 - a 1.8+ GB file and load bytes of it using JavaScript. All so easy, yet difficult to belive

Can access bytes 180000000 to 180000511 in 18 ms.

This should make everything much easier.

There are 43200 columns and 21600 rows.

Width/X/Lon
Need 128 TMS 7+ columns or 337.5 pixels per TMS. Perhaps can alternate 337 and 338 width columns

Height/Y/Lat
Needs to be calculated tile by tile.

Top lat is 85.0511.

Pixels from top = 120 * (90 - 85.0511) = 593.8679999999994 = 594
 
Equator at pixel 10800. 62 more to figure out. then flip for southern latitudes. ;-) 

All moving nicely today...


2014-05-06 ~ Theo
I have been bashing my head against cropping the big srtm30 plus files into smaller files. 
It's complicated and still a fail. Maybe I should try the de Ferranti files. 1 degree x 1 degree.
As and when I get that working, I can always come here and split the Scripps files into 1x1 files.


2014-04-29 ~ Theo

Several of the directories underneath have their own dev notes.
This is the beginning of the notes - and the process - that tries to tie all the work together.

An aside: It's interesting to watch the brain work. I feel that I am just a few hours away from accomplishing the first major goal of this project.
The goal is to translate the 33 SRTM30 Plus files into the 16,384 TMM7 heightmaps.
But it seems that instead of completing this much required and much sought for objective, the brain said: 'Today is a day where we tidy things up.'

I guess it's as if we know we are going to fight tomorrow and obtain a quick victory 
and then soon after march down Main Street in a victory parade.
So we want to do this with our shoes polished.
[And don't usually such certainties have issues?]

Anyway, there are so many files and scripts here that it is going to take some time to explain them all.
And it's looking like there are going to be quite a number of scripts that ended up on the cutting room floor / not required.
[So do these need explaining as well? Or should the be summarily sent off to some archive?]

Anyway: coming up there will be yet another folder: SRTM to TMS7.
Here we will try to go from the 33 SRTM files directly to TMS. 
The issue is that is you try to do sixteen thousand things dynamically, you end up with a free-for-all of management issues that slows things down.
Better to do one big file at a time.
And loading SRTM files and PNG files takes about the same amount of time.
We shall see...
 



