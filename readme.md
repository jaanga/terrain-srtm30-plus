Terrain SRTM30 Plus read me
===

This repository relates to the SRTM30 Plus data made available by:

The Satellite Geodesy research group at [Scripps Institution of Oceanography]( https://scripps.ucsd.edu/ ), University of California San Diego

<http://topex.ucsd.edu/WWW_html/srtm30_plus.html>  
<ftp://topex.ucsd.edu/pub/srtm30_plus/srtm30/data/>  

For attributions, copyright and license see: [srtm-license-copyright]( ./srtm-license-copyright/ )

## Concept

### Mission
To make the SRTM30 Plus data freely available as heightmaps 

### Vision
To use SRTM30 Plus data as the basis for global 3D elevation data

## Contents

### SRTM

The 33 SRTM files - unzipped

### SRTM Viewer

Mission: Provide a web browser viewer for SRTM30 Plus files. Translate data on the fly and display it as an image in your browser
Viewer: [SRTM30 Plus Viewer]( http://jaanga.github.io/terrain-srtm30-plus/srtm-viewer/latest/ )
Read Me: [SRTM30 Plus Viewer Read Me]( http://jaanga.github.io/terrain-srtm30-plus/srtm-viewer/ )
Source code on GitHub: <https://github.com/jaanga/terrain-srtm30-plus/tree/gh-pages/srtm-viewer>

### SRTM to PNG

### PNG

### PNG Viewer

### PNG to TMS7

### TMS7

### TMS7 Viewer 


### Utilities

The Linux `curl` utility can be used download the 33 Scripps SRTM1 files  

On Windows, `curl` is available as par of the [osGeo4W project]( http://trac.osgeo.org/osgeo4w/). 

> OSGeo4W is a binary distribution of a broad set of open source geospatial software for Win32 environments (Windows XP, Vista, etc). OSGeo4W includes  GDAL/OGR,  GRASS, MapServer,  OpenEV,  uDig,  QGIS as well as many other packages (over 150).

See `scripps-curl-srtm.bat` for the batch file we used to downlaod the files.

