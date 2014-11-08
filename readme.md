Terrain SRTM30 Plus read me
===

This repository relates to the SRTM30 Plus data made available by:

The Satellite Geodesy research group at [Scripps Institution of Oceanography]( https://scripps.ucsd.edu/ ), University of California San Diego

See these links for greater detail and background on the data

* <http://topex.ucsd.edu/WWW_html/srtm30_plus.html>  
* <ftp://topex.ucsd.edu/pub/srtm30_plus/srtm30/data/>  

For attributions, copyright and license see: [srtm-license-copyright]( ./srtm-license-copyright/ )

## Concept

### Mission
To make the SRTM30 Plus data freely available as heightmaps - highly compressed digital data in PNG format

### Vision
To use SRTM30 Plus data as the basis for global 3D elevation data

## Contents of the Repository

### SRTM30 Plus Files

The 33 SRTM30 Plus files - available unzipped here: 

<http://caper.ws/terrain-srtm30-plus/srtm/>

* "This data consists of 33 files of global topography in the same format as the SRTM30 products distributed by the USGS EROS data center."
* "The grid resolution is 30 second which is roughly one kilometer."

* Rather than clogging up GitHub with 1.73 GB of data, the sample files are on an external server
* Extra benefit: the directory is CORS-enabled and therefore the files can be accessed by any script
* Credits and attributions are available at: <http://caper.ws/terrain-srtm30-plus/>

### SRTM Viewer

Mission: Provide a web browser viewer for SRTM30 Plus files. Translate data on the fly and display it as an image in your browser.

Viewer: [SRTM30 Plus SRTM Viewer]( http://jaanga.github.io/terrain-srtm30-plus/srtm-viewer/latest/ )  
Read Me: [SRTM30 Plus SRTM Viewer Read Me]( http://jaanga.github.io/terrain-srtm30-plus/srtm-viewer/ )  
Source code on GitHub: <https://github.com/jaanga/terrain-srtm30-plus/tree/gh-pages/srtm-viewer>  

### SRTM to PNG

Node.js utility to convert SRTM files to PNG files

Read Me: [SRTM to PNG Read Me]( http://jaanga.github.io/terrain-srtm30-plus/srtm-to-png/ )  
Source code on GitHub: <https://github.com/jaanga/terrain-srtm30-plus/tree/gh-pages/srtm-to-png>  

### PNG Files

The 33 SRTM30 Plus files converted to PNG heightmaps available unzipped here: 

<http://caper.ws/terrain-srtm30-plus/png/>

* Rather than clogging up GitHub, the sample files are on an external server
* Extra benefit: the directory is CORS-enabled and therefore the files can be accessed by any script

### PNG Viewer

Provide a fast, simple utility to view Scripps Institution SRTM files translated to PNG heightmaps

Viewer: [SRTM30 Plus PNG Viewer]( http://jaanga.github.io/terrain-srtm30-plus/png-viewer/latest/ )  
Read Me: [SRTM30 Plus PNG Viewer Read Me]( http://jaanga.github.io/terrain-srtm30-plus/png-viewer/ )  
Source code on GitHub: <https://github.com/jaanga/terrain-srtm30-plus/tree/gh-pages/png-viewer>  


### PNG to TMS7

Node.js utility to convert PNG files to Tile Map Service Zoom Level 7 files

Read Me: [NG to TMS7 Read Me]( http://jaanga.github.io/terrain-srtm30-plus/png-to-tms7/ )  
Source code on GitHub: <https://github.com/jaanga/terrain-srtm30-plus/tree/gh-pages/png-to-tms7>  


### TMS7 Files

16,384 TMS Zoom Level 7 Files

<http://caper.ws/terrain-srtm30-plus/tms7/>

* Rather than clogging up GitHub, the sample files are on an external server
* Extra benefit: the directory is CORS-enabled and therefore the files can be accessed by any script


### SRTM PNG TMS7 Compare

Provide a fast, simple utility to view SRTM / PNG / TMS 7 heightmaps

Viewer: [TMS7 Compare]( http://jaanga.github.io/terrain-srtm30-plus/tms7-compare/latest/ )  
Read Me: [TMS7 Compare Read Me]( http://jaanga.github.io/terrain-srtm30-plus/tms7-compare/ )  
Source code on GitHub: <https://github.com/jaanga/terrain-srtm30-plus/tree/gh-pages/tms7-compare>  

### TMS7 Viewer 

Provide a fast, simple utility to view Scripps Institution SRTM files translated to PNG heightmaps

Viewer: [TMS7 Viewer]( http://jaanga.github.io/terrain-srtm30-plus/tms7-viewer/latest/ )  
Read Me: [TMS7 Viewer Read Me]( http://jaanga.github.io/terrain-srtm30-plus/tms7-viewer/ )  
Source code on GitHub: <https://github.com/jaanga/terrain-srtm30-plus/tree/gh-pages/tms7-viewer>  


### Utilities

The Linux `curl` utility can be used download the 33 Scripps SRTM1 files  

On Windows, `curl` is available as par of the [osGeo4W project]( http://trac.osgeo.org/osgeo4w/). 

> OSGeo4W is a binary distribution of a broad set of open source geospatial software for Win32 environments (Windows XP, Vista, etc). OSGeo4W includes  GDAL/OGR,  GRASS, MapServer,  OpenEV,  uDig,  QGIS as well as many other packages (over 150).

See `scripps-curl-srtm.bat` for the batch file we used to downlaod the files.

