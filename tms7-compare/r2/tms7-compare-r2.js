	var info;

	var folderSource = '../'; // '../../srtm/';
//	var folderSource = 'http://caper.ws/terrain-srtm30-plus/srtm/';
	var folderPNG = '../../tms7-dev/';
	var fileList = 'srtm30-plus-files.csv';
	var fileSelected = 'e020n40.Bathymetry.srtm';

	var pi = Math.PI, pi05 = pi * 0.5, pi2 = pi + pi;
	var d2r = pi / 180, r2d = 180 / pi;  // degress / radians;
	var zoomLevel = 7;

	var mapsContainer;
	var tileTextLat;
	var tileTextLon;

	var mapDim = 32;
	var countTMS = 0;
	var b = '<br>';

	init();
/*
	function toggleHeight( obj ) {
console.log( obj );
		if ( !obj.style.height ) {
			obj.style.height = 20;
		}
	}
*/
	function init() {


		var css = document.body.appendChild( document.createElement('style') );
		css.innerHTML = 'body { font: 600 12pt monospace; margin: 0; overflow: hidden; }' +
			'h1 a {text-decoration: none; }' +
		'';

		mapsContainer = document.body.appendChild( document.createElement( 'div' ) );
		mapsContainer.style.cssText = 'border: 1px solid black; height: ' + ( window.innerHeight - 10 ) + 'px; left: 0;' +
			'position: absolute; top: 0; width: ' + ( window.innerWidth - 10 ) + 'px; overflow: scroll; ';

		info = document.body.appendChild( document.createElement( 'div' ) );
		info.id = 'movable';
		info.style.cssText = 'background-color: #ccc; opacity: 0.9; padding: 20px; ' +
			' position: absolute; right: 50px; top: 20px; ';

//' background-color: #ccc; left: 20px; opacity:0.8; padding: 10px; position: absolute; top: 20px;';


		info.innerHTML = '<div onclick=msg.style.display=(msg.style.display==="none")?"":"none"; >[x]</div>' +
				'<h1 title="A very nice app indeed" >' +
				document.title + ' ~ ' +
				'<a id=aHelp href=# onclick=help.style.display="block"; >&#x24D8;</a>' +
			'</h1>' +
			'<p>' +
				'Select SRTM: <select id=selSRTM title="Select a different view to view" ><select><br>' +
				'Select map size: <select id=selMap title="Select a different size" ><select><br>' +
				'Show map: <input id=chkMap type=checkbox >' +
			'</p>' +
			'<div id=msg ></div>';

		info.addEventListener( 'mousedown', mouseMove, false );
		window.addEventListener('mouseup', mouseUp, false);

		var data = requestFile( folderSource + fileList );
		lines = data.split(/\r\n|\n/);
		var length = lines.length - 1;
		var files = [];
		var sep = ',';
		for ( var i = 0; i < length; i++ ) {
			files.push( lines[i].split( sep ) );
		}
		var fileName, option, selectedIndex = 0;
		for ( i = 0; i < length; i++) {
			selSRTM.appendChild( document.createElement( 'option' ) );
			selSRTM.children[ i ].text = files[i][0];
			selSRTM.children[ i ].title = files[i][5];
		}
		selSRTM.onchange = function() { processSRTM( files[ selSRTM.selectedIndex ][0] ); };
		selSRTM.selectedIndex = selectedIndex;

		chkMap.onchange = function() { processSRTM( files[ selSRTM.selectedIndex ][0] ); };

		for ( i = 0; i < 5; i++) {
			selMap.appendChild( document.createElement( 'option' ) );
			selMap.children[ i ].text = 8 << ( i + 1 );
		}
		selMap.onchange = function() { mapDim = parseInt(selMap.value, 10); processSRTM( files[ selSRTM.selectedIndex ][0] ); };
		selMap.selectedIndex = 1;

		processSRTM( files[ selSRTM.selectedIndex ][0] );
	}

	function processSRTM( fileSRTM ) {
		mapsContainer.innerHTML = '';
		var countX = 0;
		var countY = 0;

		tileTextLat = mapsContainer.appendChild( document.createElement( 'div' ) );
		tileTextLat.style.cssText = 'border: 0px solid black; position: absolute; ';
		tileTextLat.style.cssText += 'left: 620px; line-height: 23px; top: 10px;';
		tileTextLat.innerHTML = 'latitude<br>';

		tileTextLon = mapsContainer.appendChild( document.createElement( 'div' ) );
		tileTextLon.style.cssText = 'position: absolute; left: 10px; top: 910px; ';
		tileTextLon.innerHTML = 'longitude<br>';

		var signLon = ( fileSRTM.substr( 0, 1 ) === 'w' ) ? -1 : 1;
		var signLat = ( fileSRTM.substr( 4, 1 ) === 's' ) ? -1 : 1;

		var lonStart = signLon * parseInt( fileSRTM.substr( 1, 3 ), 10 );
		var latStartFile = signLat * parseInt( fileSRTM.substr( 5, 2 ), 10 );

		var lonDelta, latDelta;
		if ( latStartFile !== -60) {
			lonDelta = 40;
			latDelta = 50;
		} else {
			lonDelta = 60;
			latDelta = 30;
		}

// lon tileX
		var lonFinish = lonStart + lonDelta;
		lonFinish = lonFinish > 179 ? 179 : lonFinish;

		var tileStartX = lon2tile( lonStart, zoomLevel );
		var tileFinishX = lon2tile( lonFinish, zoomLevel ) + 1;
		var tileDeltaX = tileFinishX - tileStartX;

		var tileStartLon = tile2lon(  tileStartX, zoomLevel );
		var tileFinishLon = tile2lon( tileFinishX, zoomLevel );
		var tileDeltaLon = tileFinishLon - tileStartLon;

		var lonDeltaLevel7 = 360 / 128;

// lat tileY
		var latStart, latFinish, tileStartY, tileFinishY;

		if ( latStartFile === 90 ) {
			latStart =  tile2lat( 0, zoomLevel );
			latFinish = latStartFile - latDelta;
			tileStartY = 0;
			tileFinishY = lat2tile( latFinish, zoomLevel ) + 1;
		} else if ( latStartFile === -60) {
			latStart = latStartFile;
			latFinish = tile2lat( 128, 0 );
			tileStartY = lat2tile( latStart, zoomLevel );
			tileFinishY = 128;
//			tileFinishY = lat2tile( latFinish, zoomLevel );
		} else {
			latStart = latStartFile;
			latFinish = latStart - latDelta;
			tileStartY = lat2tile( latStart, zoomLevel );
			tileFinishY = lat2tile( latFinish, zoomLevel ) + 2;
		}
		var tileDeltaY = tileFinishY - tileStartY;

		var tileStartLat = tile2lat(  tileStartY, zoomLevel );
		var tileFinishLat = tile2lat(  tileFinishY, zoomLevel );
		var tileDeltaLat = tileStartLat - tileFinishLat;

		var currentLatTop, currentLatBottom, deltaLat;
		var pngHeight = latDelta * 120;
		var pngWidth = lonDelta * 120;

		var tmsWidth = Math.floor( lonDeltaLevel7 * 120 );
		var tmsXoffset = Math.floor( tmsWidth * Math.abs( tileStartLon - lonStart ) / lonDeltaLevel7 );
		var tmsXStart, tmsXFinish = tmsWidth;

		var tmsYStart, tmsYFinish, tmsYoffset, tmsHeight;

		if ( latStartFile === 90 ) {
			tmsYoffset = Math.floor( 120 * ( 90 - latStart ) );
		} else if ( latStartFile === 40 || latStartFile === -10 || latStartFile === -60 ) {
			tmsYoffset = Math.floor( 120 * ( tileStartLat - latStart) );
		}
		var pngXStart = tmsXoffset; // ?? or 0?
		var pngXFinish = tmsWidth - tmsXoffset;
		var pngYStart = 0; pngYFinish = 0;
// srtm goes to 90 but tms starts at 85...

//tileFinishX--,  tileFinishY--;

		tileTextLat.style.left = ( tileDeltaX * (mapDim + 3) + 5 ) + 'px';
		tileTextLat.innerHTML += 'tmsYoffset: ' + tmsYoffset + '<br>';

		tileTextLon.style.top = ( tileDeltaY * (mapDim + 3) + 5 ) + 'px';
		tileTextLon.innerHTML += 'tmsXoffset: ' + tmsXoffset + '<br>';


		for ( var tileX = tileStartX; tileX < tileFinishX; tileX++ ) {
//			if ( latStartFile === 90 || latStartFile === 40) {
//			if ( latStartFile === 90 ) {
//				pngYStart = tmsYoffset;
//			} else {
//				pngYStart = 0;
//			}
			tmsXStart = ( tileX === tileStartX ) ? tmsXoffset : 0;
			countY = 0;
			for ( var tileY = tileStartY; tileY < tileFinishY; tileY++ ) {
				currentLatTop = tile2lat( tileY, zoomLevel );
				currentLatBottom = tile2lat( tileY + 1, zoomLevel );
				deltaLat = currentLatTop - currentLatBottom;
				tmsHeight = Math.floor( 120 * deltaLat );
/*
				if ( tileY === tileStartY ) {
					tmsYStart = tmsYoffset;
					pngYFinish = tmsHeight;
				} else {
					tmsYStart = 0;
					pngYFinish += tmsHeight ;

					if ( pngYFinish > pngHeight ) {
						pngYFinish = pngHeight;
					}
				}
				processTMS( fileSRTM, countX, countY, tileX, tileY, tileDeltaX );
				pngYStart = pngYFinish;
				countY++;
				if ( countX === 0 ) {
					procesTextLat( fileSRTM, countY, tileY, currentLatTop, pngYStart, pngYFinish, tmsYStart, tmsHeight );
				}
*/

				if ( tileY === tileStartY ) {
					pngYStart = 0;
					if ( latStartFile === 90 ) {
						pngYFinish = tmsYoffset;
					} else {
						pngYFinish = tmsHeight;
					}
					tmsYStart = tmsYoffset;
					tmsYFinish = tmsHeight;
				} else {
					if ( latStartFile === 90 ) {
						pngYStart = pngYFinish;
					} else {
						pngYStart = pngYFinish - tmsYoffset;
					}
					pngYFinish += tmsHeight;

					tmsYFinish = tmsHeight;
					if ( pngYFinish > pngHeight ) {
						tmsYFinish = tmsHeight - ( pngYFinish - pngHeight );
						pngYFinish = pngHeight;
					}
					tmsYStart = 0;
				}

				processTMS( fileSRTM, countX, countY, tileX, tileY, tileDeltaX );
				countY++;
				if ( countX === 0 ) {
					processTextLat( fileSRTM, countY, tileY, currentLatTop, pngYStart, pngYFinish, tmsYStart, tmsHeight );
				}
			}
			pngXStart = pngXFinish - 1;
			countX++;
			processTextLon( fileSRTM, countX, tileX, pngXStart, pngXFinish, pngWidth, tmsXStart, tmsWidth );

			pngXFinish += tmsWidth;
//			pngXFinish = ( pngXFinish > pngWidth ) ? pngWidth : pngXFinish;

			if ( pngXFinish > pngWidth ) {
				tmsXFinish = tmsWidth - ( pngXFinish - pngWidth ) + 3;
				pngXFinish = pngWidth;
			}
		}

		msg.innerHTML = 
			'fileName: ' + fileSRTM + b +

			b +
			'lonStart : ' + lonStart + b +
			'lonFinish: ' + lonFinish + b +
			'lonDelta : ' + lonDelta + b +

			b +
			'tileStartX : ' + tileStartX + b +
			'tileFinishX: ' + tileFinishX + b +
			'tileDeltaX : ' + tileDeltaX + b +

			b +
			'tileStartLon : ' + tileStartLon.toFixed(2) + b +
			'tileFinishLon: ' + tileFinishLon.toFixed(2) + b +
			'tileDeltaLon : ' + tileDeltaLon.toFixed(2) + b +
			b + '<hr>' +

			'latStart : ' + latStart.toFixed(2) + b +
			'latFinish: ' + latFinish + b +
			'latDelta : ' + latDelta + b +

			b +
			'tileStartY : ' + tileStartY + b +
			'tileFinishY: ' + tileFinishY + b +
			'tileDeltaY : ' + tileDeltaY + b +

			b +
			'tileStartLat : ' + tileStartLat.toFixed(2) + b +
			'tileFinishLat: ' + tileFinishLat.toFixed(2) + b +
			'tileDeltaLat : ' + tileDeltaLat.toFixed(2) + b +

			b +
			'lonDeltaLevel7: ' + lonDeltaLevel7 + b +
			'pngWidth: ' + pngWidth + ' pngHeight: ' + pngHeight + b +
			'tmsXoffset: ' + tmsXoffset + ' tmsYoffset: ' + tmsYoffset + b +
			' tmsYFinish:' + tmsYFinish + ' dif:' + ( pngYFinish - pngHeight) + b +
		'';

console.log( 'processSRTM' , fileSRTM );
	}

	function processTMS( fileSRTM, countX, countY, tileX, tileY, tileDeltaX ) {
// console.log( 'ProcessTMS', countTMS++ );
		var map = mapsContainer.appendChild( document.createElement( 'img' ) );
		map.width = mapDim;
		map.height = mapDim;
		map.style.cssText = 'border: 1px solid black; position: absolute;';
		map.style.cssText += 'left: ' + ( countX * (mapDim + 3) ) + 'px; top: ' + ( countY * (mapDim + 3) ) + 'px;';
		map.src = folderPNG + tileX + '/' + tileY + '.png';

		if ( chkMap.checked ) {
			var left = 300 + tileDeltaX * (mapDim + 5) + 5;
			var tms = mapsContainer.appendChild( document.createElement( 'img' ) );
			tms.width = mapDim;
			tms.height = mapDim;
			tms.style.cssText = 'border: 1px solid black; position: absolute;';
			tms.style.cssText += 'left: ' + ( left + countX * (mapDim + 3) ) + 'px; top: ' + ( countY * (mapDim + 3) ) + 'px;';
			tms.src = 'http://mt.google.com/vt/hl=en&src=app&x=' + tileX + '&y=' + tileY + '&z=' + zoomLevel;
		}
	}

	function processTextLat( fileSRTM, countY, tileY, currentLatTop, pngYStart, pngYFinish, tmsYStart, tmsHeight ) {
		tileTextLat.innerHTML += countY + ' ty:' + tileY + ' lat:' + currentLatTop.toFixed(2) + ' y:' + pngYFinish + ' ht:' + tmsHeight + b;
	}

	function processTextLon( fileSRTM, countX, tileX, pngXStart, pngXFinish, pngWidth, tmsXStart, tmsWidth ) {
		tileTextLon.innerHTML += '<table><tr><td style=width:2em;>' + countX + '</td><td> tx:' + tileX + '</td><td> lon:' + tile2lon( tileX,7).toFixed(2) +
		'</td><td> x:' + pngXFinish + '</td></tr></table>';
	}

	function requestFile( fname ) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.crossOrigin = "Anonymous"; 
		xmlHttp.open( 'GET', fname, false );
		xmlHttp.send( null );
		return xmlHttp.responseText;
	}

// The math
// http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Tile_servers
	function lon2tile( lon, zoom ) {
		return Math.floor( ( lon + 180 ) / 360 * pow( 2, zoom ) );
	}

	function lat2tile( lat, zoom ) {
		return Math.floor(( 1 - Math.log( Math.tan( lat * pi / 180) + 1 / cos( lat * pi / 180)) / pi )/2 * pow(2, zoom) );
	}

	function tile2lon( x, zoom ) {
		return ( x / pow( 2, zoom ) * 360 - 180 );
	}

	function tile2lat( y, zoom ) {
		var n = pi - 2 * pi * y / pow( 2, zoom );
		return 180 / pi * Math.atan( 0.5 * ( Math.exp( n ) - Math.exp( -n ) ));
	}

	function cos( a ){ return Math.cos( a ); }
	function sin( a ){ return Math.sin( a ); }
	function pow( a, b ){ return Math.pow( a, b ); }
	function ran(){ return Math.random(); }

// events
	function mouseUp() {
		window.removeEventListener('mousemove', divMove, true);
	}

	function mouseMove( event ){
		if ( event.target.id === 'movable' ) {
			event.preventDefault();

			offsetX = event.clientX - event.target.offsetLeft;
			offsetY = event.clientY - event.target.offsetTop;
			window.addEventListener('mousemove', divMove, true);
		}
	}

	function divMove( event ){
		event.target.style.left = ( event.clientX - offsetX ) + 'px';
		event.target.style.top = ( event.clientY - offsetY ) + 'px';
	}
