[Parent]( ../index.html ) &raquo;
[SRTM Plus to 3D]( srtm-to-3d-r3.html )
===

## Location (open)

Gazetteer: <select id=selPlace ></select>

Latitude: <select id=selLat onchange=ifr.contentWindow.updateParameters(); ></select> 
Longitude: <select id=selLon onchange=ifr.contentWindow.updateParameters(); ></select>

TileX: <select id=selTileX onchange=ifr.contentWindow.updateTileParameters(); ></select>
TileY: <select id=selTileY onchange=ifr.contentWindow.updateTileParameters(); ></select>

<button onclick=ifr.contentWindow.tileEast(); >Tile East</button>
<button onclick=ifr.contentWindow.tileWest(); >Tile West</button>  

<button onclick=ifr.contentWindow.tileNorth(); >Tile North</button>
<button onclick=ifr.contentWindow.tileSouth(); >Tile South</button>

<div id=msg1 ></div>
<div id=msg2 ></div>

## Location Map (open)

<div id=locationMap ></div>

## About

Features of the app include the following:

* Fully interactive 3D viewers for data files created by the 
<a href=http://topex.ucsd.edu/WWW_html/srtm30_plus.html  target="_blank" >Satellite Geodesy research group at Scripps Institution of Oceanography, University of California San Diego</a> 
* Based on the unFlatland series of scripts that make creating 3D views easier

<a href="http://jaanga.github.io/terrain-srtm30-plus/srtm-to-3d/readme-reader.html" target="_blank">Read Me ~</a> 
<a href="https://github.com/jaanga/terrain-srtm30-plus/tree/gh-pages/srtm-to-3d" target="_blank">Source Code ~ </a> 

Credits: <a href="http://threejs.org" target="_blank">three.js</a> - 
<a href="http://khronos.org/webgl/" target="_blank">webgl</a> - 
<a href="http://jaanga.github.io" target="_blank">jaanga</a>

copyright &copy; 2015 Jaanga authors  
MIT license
