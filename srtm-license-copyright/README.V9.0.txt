SRTM30_PLUS: DATA FUSION OF SRTM LAND TOPOGRAPHY WITH MEASURED AND ESTIMATED SEAFLOOR TOPOGRAPHY

SRTM30_PLUS V9.0 - December 19, 2013
David T. Sandwell dsandwell@ucsd.edu
Chris Olson <cjolson@ucsd.edu>
Amber Jackson <amberleajackson@gmail.com>
Joseph J. Becker <joseph.becker.ctr@nrlssc.navy.mil>

The SRTM30_PLUS is available in 2 formats.

1) topo30 format
The  subdirectory called topo30 has the data 
stored in a single large file of 2-byte integers
in MSB format (i.e. big-endian).  The grid spans 
0 to 360 in longitude and -90 to 90 in latitude. 
The upper left corner of the upper left grid cell
has latitude 90 and longitude 0.  There are 
43200 columns and 21600 rows. A matching source 
identification file (SID) called topo30_sid is also 
included.  The sid numbers are stored as unsigned 
2-byte integers.

2) srtm30 format
The directory called srtm30 has the same data in
original SRTM30 format consisting of 33 tiles
is described below.

DIRECTORIES
data - 33 files of signed 2-byte integers for global elevation(> 0)
       and depth (<0). The global elevations are an exact copy of the
       SRTM30 grids provided at the following location.  Our contribution
       is to fill the ocean areas with some estimate of depth.
       ftp://e0srp01u.ecs.nasa.gov

sid  - 33 files of unsigned 2-byte integers representing the source
       identification number for the data (0 - predicted depth).
       Soon we will make these data files available in an ASCII format.

The file names indicate the boundaries of each tile

             Latitude          Longitude     
 Tile    Minimum  Maximum   Minimum  Maximum 
-------  ----------------   ---------------- 
w180n90     40       90       -180    -140   
w140n90     40       90       -140    -100   
w100n90     40       90       -100     -60   
w060n90     40       90        -60     -20   
w020n90     40       90        -20      20   
e020n90     40       90         20      60   
e060n90     40       90         60     100   
e100n90     40       90        100     140   
e140n90     40       90        140     180   
w180n40    -10       40       -180    -140   
w140n40    -10       40       -140    -100   
w100n40    -10       40       -100     -60   
w060n40    -10       40        -60     -20   
w020n40    -10       40        -20      20   
e020n40    -10       40         20      60   
e060n40    -10       40         60     100   
e100n40    -10       40        100     140   
e140n40    -10       40        140     180   
w180s10    -60      -10       -180    -140   
w140s10    -60      -10       -140    -100   
w100s10    -60      -10       -100     -60   
w060s10    -60      -10        -60     -20   
w020s10    -60      -10        -20      20   
e020s10    -60      -10         20      60   
e060s10    -60      -10         60     100   
e100s10    -60      -10        100     140   
e140s10    -60      -10        140     180   
w180s60    -90      -60       -180    -120   
w120s60    -90      -60       -120     -60   
w060s60    -90      -60        -60       0   
w000s60    -90      -60          0      60   
e060s60    -90      -60         60     120   
e120s60    -90      -60        120     180   

_________________________________________________________________________________________
Version 9.0 has the identical format as previous versions. Enhancements from V8.0
1) The predicted depth is based on the new V22 gravity model which includes all new data from Cryosat-2, Jason-1, and Envisat resulting in about a factor of 2 improvement in gravity accuracy.  In addition both the gravity and the predicted depth have a filter wavelength that is about 2 km shorter than previous versions (i.e., 14 km wavelength instead of 16 km).
2) There has been a lot of editing of bad soundings especially on the continental margins where the deep holes
were eliminated.
3) About 446 new JAMSTEC multibeam cruises were added. These data were sampled at 15 arcseconds to prepare for
an SRTM15.
_________________________________________________________________________________________
Version 8.0 has the identical format as previous versions.  Enhancements from V7.0
Arctic bathymetry north of 70 N is based on IBCAO V3.0 http://www.ngdc.noaa.gov/mgg/bathymetry/arctic/.
Predicted depth based on new global Gravity V20.1.  This included 2 years of altimetry data
from CryoSat, 1.5 years from Envisat, and 120 days from Jason-1.
A new A-coefficient for the downward continuation parameter was used based
on a coherence analysis performed by Karen Marks.

_________________________________________________________________________________________
Version 7.0 has the identical format as previous versions.  Enhancements from V6.0
include the addition of all US multirneam data stored at NGDC as of April 2011.
Edited multibeam data from Ewing and Palmer cruises was provided by the Marine Geoscience
Data System. http://www.marine-geo.org/index.php
In addition a 500-m grid of Great Barrier Reef bathymetry from Rob Beaman
http://e-atlas.org.au/content/gbr-jcu-bathymetry-gbr100
One other change as the latitude cutoff for the IBCAO Arctic grid was lowered ftom 80 N to
70 N.  This eliminates some of the "orange peel areas of predicted depth between 70 and 80.
_________________________________________________________________________________________
Version 6.0 has the identical format as previous versions.
This version includes a significant number of new depth
soundings.  This version is based on an more accurate prediction
between gravity anomaly and depth.  In addition is contains many 
more depth soundings than all previous versions and has extensive 
editing to remove blunders.

_________________________________________________________________________________________
Version 5.0 has the identical format as previous versions.
This version includes a significant number of new depth
soundings.
A more complete description of the new data and processing
will be prepared for publication in early 2008.  This
is a collaborative effort between NGA, NOAA, NAVO and SIO.
The predicted depths are based on the V16.1 gravity anomaly
model in an adjacent directory.  

_________________________________________________________________________________________
Version 4.0 has the identical format as previous versions.
This version includes a significant number of new depth
soundings, especially for depths between 0 and -300 m.
A more complete description of the new data and processing
will be prepared for publication in early 2008.  This
is a collaborative effort between NGA, NOAA, NAVO and SIO.
The predicted depths are based on the V16.1 gravity anomaly
model in an adjacent directory.  

This version has gone through 6 iterations of
identifying bad tracks, editing the offending profiles and constructing
a new grid.   If you find anomalies (there are several remaining)
please send an e-mail with the problem location and we will
address it.
_________________________________________________________________________________________
Version 3.0 has the identical format as V1.0.  On land areas (except Anartctica)
the land data ov Version 3.0 are identical to Version 2.0 which are identical to
Version 2 of the SRTM30 land data.

1) Ocean data 
The ocean data are based on V9.1 of our global predicted depth.
This 1-minute grid includes a significant number of new depth 
soundings, especially for depths between 0 and -300 m.
A more complete description of the new data and processing
will be prepared for publication in early 2008.  This
is a collaborative effort between NGA, NOAA, NAVO and SIO.
The predicted depths are based on the V16.1 gravity anomaly
model in an adjacent directory.  Please send comments to
dsandwell@ucsd.edu.

2) Antarctica
The land adat on Antarctica are from 
Digital Elevation Models of the Antarctic and Greenland Ice Sheets Using Data From ICESat
John P. DiMarzio12, Anita C. Brenner23, Helen A. Fricker4, Jack L. Saba23, Bob E. Schutz5, Christopher A. Shuman2, H. Jay Zwally2
2007 Jan 5
DESCRIPTION OF THE DIGITAL ELEVATION MODELS
The ICESat/GLAS Antarctic and Greenland Digital Elevation Models (DEMs) are polar-stereographic projection of the ICESat/GLAS elevation data in raster format. The elevation grids were used to compute the slope and slope azimuth grids.

_________________________________________________________________________________________
Version 2.0 has the identical format as V1.0.  There are two main improvements:

1) The land data come from version 2 of the SRTM30 processing.  Here is the
information on SRTM V2 provided by Tom Farr of JPL on October 10, 2005.

"NASA has released version 2 of the Shuttle Radar Topography Mission digital topographic 
data (also known as the "finished" version). Version 2 is the result of a substantial 
editing effort by the National Geospatial Intelligence Agency and exhibits well-defined 
water bodies and coastlines and the absence of spikes and wells (single pixel errors), 
although some areas of missing data ('voids') are still present. The Version 2 directory 
also contains the vector coastline mask derived by NGA during the editing, called the 
SRTM Water Body Data (SWBD), in ESRI Shapefile format.

The data may be obtained by anonymous ftp to:  e0srp01u.ecs.nasa.gov and moving to the 
directory srtm where both version 1 and version 2 directories may be found. Please read 
the appropriate documentation, also found in the directories."

2) We have added several new bathymetry grids derived from large multibeam
surveys.  The new data include a large IFREMER survey of the Southwest Indian Ridge 
provided by Mathilde Cannat, a compilation of the Lau Basin provided by Brian Taylor of
SOEST, and a large survey of the Foundation Seamounts provided bu Marcia Maia at IFREMER.


SRTM30_PLUS V1.0 November 11, 2004
_________________________________________________________________________________________
INTRODUCTION
This data consists of 33 files of global topography in the same format as the SRTM30 products 
distributed by the USGS EROS data center. The grid resolution is 30 seconds which is roughly 
one kilometer.Land data are based on the 1-km averages of tropography derived from the 
USGS SRTM30 gridded DEM data product created with data from the NASA Shuttle Radar Topography 
Mission. GTOPO30 data are used for high latitudes where SRTM data are not available. Ocean data 
are based on the Smith and Sandwell global 2-minute grid between latitudes +/- 72 degrees. 
Higher resolution grids have been added from the LDEO Ridge Multibeam Synthesis Project and the 
NGDC Coastal Multibeam Data. Arctic bathymetry is from the International Bathymetric Chart of 
the Oceans (IBCAO) [Jakobsson et al., 2003]. All data are derived from public domain sources 
and these data are also in the public domain.The pixel-registered data are stored in 33 files 
with names corresponding to the upper left corner of the array shown below.

The USGS SRTM30 data and documentation is available at
ftp://edcsgs9.cr.usgs.gov/pub/data/srtm/SRTM30

The US continental coastal multibeam data is available at 
www.ngdc.noaa.gov/mgg/coastal/coastal.html
Data from Puerto Rico and Hawaii is -NOT- presently included.

The ocean ridge multibeam data is available at 
www.ocean-ridge.ldeo.columbia.edu/general/html/home.html

The artic ocean bathymetry is from 
http://www.ngdc.noaa.gov/mgg/bathymetry/arctic/arctic.html

The Antarctica data (starting at 72S) is not very 
interesting; the terrestrial data is from GTOPO30,
and the limited bathymetry is from JEBCO.

_________________________________________________________________________________________
DATA FORMATS
Data are provided as binary integers in exactly the same format
as SRTM30.  The files must be uncompressed with gzip and are 16-bit
big endian byte order.  

These files can be used directly by ER_Mapper software using the header files 
stored in the subdirectory ermapper_headers.

These files can be converted to Generic Mapping Tools (grd-netcdf) format
using the scripts in the subdirectory grd.
_________________________________________________________________________________________
