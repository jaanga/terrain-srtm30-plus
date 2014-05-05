	var info;
	var title = document.title;

//	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/e020n40.Bathymetry.png';  // 0 Saudi Arabia $$$
//	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/e020n90.Bathymetry.png';  // 1 Russia $$$
//	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/e020s10.Bathymetry.png';  // 2 east Africa $$$
//	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/e060n40.Bathymetry.png';  // 3 India
//	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/e060n90.Bathymetry.png';  // 4 Siberia $$$
//	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/e060s10.Bathymetry.png';  // 5 Indian Ocean
//	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/e060s60.Bathymetry.png';  // 6 Antarctica ***
//	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/e100n40.Bathymetry.png';  // 7 China
//	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/e100n90.Bathymetry.png';  // 8 Sibera / Japan $$$
//	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/e100s10.Bathymetry.png';  // 9 Australia ***
//	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/e120s60.Bathymetry.png';  // 10 Antarctic
//	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/e140n40.Bathymetry.png';  // 11 New Guinea Japan ***
//	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/e140n90.Bathymetry.png';  // 12 Siberia $$$
//	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/e140s10.Bathymetry.png';  // 13 New Zealand xxx
//	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/w000s60.Bathymetry.png';  // 14 Antartica
//	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/w020n40.Bathymetry.png';  // 15 west Africa
//	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/w020n90.Bathymetry.png';  // 16 Spitzbergen Scandanvia $$$
//	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/w020s10.Bathymetry.png';  // 17 west South Africa
//	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/w060n40.Bathymetry.png';  // 18 Brazil
//	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/w060n90.Bathymetry.png';  // 19 Greeanland $$$
//	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/w060s10.Bathymetry.png';  // 20 South Africa
//	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/w060s60.Bathymetry.png';  // 21 Antarctica
//	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/w100n40.Bathymetry.png';  // 22 Caribbean
//	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/w100n90.Bathymetry.png';  // 23 Baffin Island $$$
//	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/w100s10.Bathymetry.png';  // 24 Chile / Argentina
//	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/w120s60.Bathymetry.png';  // 25 Antarctica
//	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/w140n40.Bathymetry.png';  // 26 San Francisco $$$
//	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/w140n90.Bathymetry.png';  // 27 West Canada $$$
//	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/w140s10.Bathymetry.png';  // 28 Ocean
//	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/w180n40.Bathymetry.png';  // 29 Hawaii $$$
	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/w180n90.Bathymetry.png';  // 30 0-15, 0-50, -180 ~ -140, 85-40, Alaska $$$
//	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/w180s10.Bathymetry.png';  // 31 Ocean
//	var fileLink = 'http://aceit.us/terrain-srtm30-plus/png/w180s60.Bathymetry.png';  // 32 Antarctica

	var fileName = fileLink.substr( fileLink.lastIndexOf('/') + 1 );
console.log( fileName );

	var pi = Math.PI, pi05 = pi * 0.5, pi2 = pi + pi;
	var d2r = pi / 180, r2d = 180 / pi;  // degress / radians;
	var zoomLevel = 7;

	var signLon = ( fileName.substr( 0, 1 ) === 'w' ) ? -1 : 1;
	var signLat = ( fileName.substr( 4, 1 ) === 's' ) ? -1 : 1;

	var lonStart = signLon * parseInt( fileName.substr( 1, 3 ), 10 );
	var latStart = signLat * parseInt( fileName.substr( 5, 2 ), 10 );

	if ( latStart === -60) {
		var latDelta = 30;
		var lonDelta = 60;
	} else {
		var latDelta = 50;
		var lonDelta = 40;
	}
	var lonFinish = lonStart + lonDelta;
	// lonFinish = lonFinish > 179 ? 179 : lonFinish;

	var tileStartX = lon2tile( lonStart, zoomLevel );

	if ( lonFinish > 179 ) {
		lonFinish = 179;
		tileFinishX = lon2tile( lonFinish, zoomLevel );
	} else 
		tileFinishX = lon2tile( lonFinish, zoomLevel ) + 1;

	var tileStartLon = tile2lon(  tileStartX, zoomLevel );
	var lonDeltaLevel7 = 360 / 128;
	var offsetX = -337.5 * (tileStartLon - lonStart) / lonDeltaLevel7;

	var latFinish, tileStartY;
	if ( latStart === 90 ) {
		latStart =  tile2lat( 0, zoomLevel );
		latFinish = latStart - latDelta;
		tileStartY = 0;

	} else if ( latStart === -60) {
		latFinish = tile2lat( 128, 0 );
		tileStartY = lat2tile( latStart, zoomLevel );

	} else {
		latFinish = latStart - latDelta;
		tileStartY = lat2tile( latStart, zoomLevel );
	}

	var tileStartLat = tile2lat(  tileStartY, zoomLevel );
	var offsetY;

	if ( latStart === tile2lat( 0, zoomLevel ) ) {
		offsetY = (90 - latStart ) * 4800 / 40; 
	} else if ( latStart === 40 || latStart === -10 || latStart === -60 ) {
		offsetY = -120 * ( tileStartLat - latStart);
console.log( 'offsetY', offsetY );
	}

console.log( lonStart, lonFinish, latStart, latFinish );

	if ( latStart === -60 ) {
		var tileFinishY = 127;
	} else {
		var tileFinishY = lat2tile( latFinish, zoomLevel ) + 1;
	}

	var tileDeltaLon = - tileStartLon + tile2lon(  tileStartX + 1, zoomLevel );
	var tileDeltaLat = tileStartLat - tile2lat(  tileStartY + 1, zoomLevel );

	var tileDeltaX = tileFinishX - tileStartX;
	var tileDeltaY = tileFinishY - tileStartY;

console.log( tileStartY, tileFinishY);

	var latDeltaLevel7 = 180 / 128;

	var pixelsX = Math.floor( lonDeltaLevel7 * 120);
	var pixelsY = Math.floor(latDeltaLevel7 * 120);

	var tileXCount = Math.floor( lonDelta / lonDeltaLevel7 ) + 1;
	var tileYCount = Math.floor( latDelta / latDeltaLevel7 ) + 1;

	var b = '<br>';

	init();

	function init() {

		addCSS();

		var mapTextLat = document.body.appendChild( document.createElement( 'div' ) );
		mapTextLat.style.cssText = 'border: 0px solid black; position: absolute; ';
		mapTextLat.style.cssText += 'left: ' + ( ( 1 + tileXCount ) * 23 ) + 'px; line-height: 23px; top: 0;';
		mapTextLat.innerHTML = '';

		var mapTextLon = document.body.appendChild( document.createElement( 'div' ) );
		mapTextLon.style.cssText = 'left: 10px; position: absolute; top: ' + ( tileDeltaY * 23 + 50 ) + 'px;';
		mapTextLon.innerHTML = '';

		var map, currentTileY;
		var i = 0, currentTileX = tileStartX;
		var j, currentLatTop, deltaLat, currentPixelY;
/*
		while ( currentTileX <= tileFinishX ) {
			currentTileY = tileStartY;
			j = 0;
			while ( currentTileY <= tileFinishY ) {
				map = document.body.appendChild( document.createElement( 'img' ) );
				map.width = 20;
				map.height = 20;
				map.style.cssText = 'border: 1px solid black; position: absolute; ';
				map.style.cssText += 'left: ' + ( i * 23 ) + 'px; top: ' + ( j * 23 ) + 'px;';
				if ( j > -1 && j < 75 ) {
					map.src = 'http://mt.google.com/vt/hl=en&src=app&x=' + currentTileX + '&y=' + currentTileY + '&z=' + zoomLevel;
				}
				if ( i === 0 ) {
					mapTextLat.innerHTML += j + ' tileY:' + currentTileY + ' lat:' + tile2lat( currentTileY , 7).toFixed(3) + b;
				}
				currentTileY++;
				j++;
			}
			mapTextLon.innerHTML += i + ' tileX:' + currentTileX + ' lon: ' + tile2lon( currentTileX, zoomLevel ) + b;
			currentTileX++;
			i++;
		} 

		var canvas = document.body.appendChild( document.createElement( 'canvas' ) );

		if ( latStart === -60) {
			canvas.width = 720;
			canvas.height = 360;

		} else {
			canvas.width = 480;
			canvas.height = 600;
		}

/*
		canvas.style.cssText = 'border: 1px solid black; position: absolute; right: 0; ';
		var context = canvas.getContext( '2d' );

		var image = document.createElement( 'img' );
		image.src = fileLink;
		image.onload = function(){

			context.scale( 0.1, 0.1 );
			context.drawImage( image, 0, 0 );

		};
*/

		var tileTextLat = document.body.appendChild( document.createElement( 'div' ) );
		tileTextLat.style.cssText = 'border: 0px solid black; position: absolute; ';
		tileTextLat.style.cssText += 'left: ' + (600 + ( 1 + tileXCount ) * 23 ) + 'px; line-height: 23px; top: 0;';
		tileTextLat.innerHTML = '';

		var tileTextLon = document.body.appendChild( document.createElement( 'div' ) );
		tileTextLon.style.cssText = 'position: absolute; left: 600px; top: ' + ( tileDeltaY * 23 + 50 ) + 'px; ';
		tileTextLon.innerHTML = '';

			var currentTileX = tileStartX;
			i = 0;
			while ( currentTileX <= tileFinishX - 1 ) {
				currentTileY = tileStartY;
//				currentPixelX = -offsetX + i * ( pixelsX - 1 );
				currentPixelY = 0; // offsetY;
				j = 0;
				while ( currentTileY <= tileFinishY - 1 ) {

					map = document.body.appendChild( document.createElement( 'img' ) );
					map.width = 20;
					map.height = 20;
					map.style.cssText = 'border: 1px solid black; position: absolute; ';
					map.style.cssText += 'left: ' + ( 600 + i * 23 ) + 'px; top: ' + ( j * 23 ) + 'px;';
					map.src = '../../srtm-to-tms7/tms7-dev/' + currentTileX + '/' + currentTileY + '.png';

/*
					var tile = document.body.appendChild( document.createElement( 'canvas' ) );
					tile.width = 20;
					tile.height = 20;
					tile.style.cssText = 'outline: 1px solid black; position: absolute; ' +
						'left: ' + ( 600 + i * 23) + 'px; top: ' + ( j * 23 ) + 'px;';
					var contextTile = tile.getContext( '2d' );
*/

					currentLatTop = tile2lat( currentTileY, zoomLevel );
					currentLatBottom = tile2lat( currentTileY + 1, zoomLevel );
					deltaLat = currentLatTop - currentLatBottom;
					deltaPixel = Math.floor( 120 * deltaLat );
					
//					contextTile.drawImage( image, currentPixelX, currentPixelY, pixelsX, deltaPixel, 0, 0, 20, 20 );
					currentPixelY += deltaPixel;



					if ( i === 0 ) {
						tileTextLat.innerHTML += currentTileY + ' Y:' + currentPixelY + ' dY:' + deltaPixel + b;
					}
					currentTileY++;
					j++;
				}
				//tileTextLon.innerHTML += currentTileX + ' lon px:' + ( currentTileX * ( pixelsX - 1 ) ) + b;
				tileTextLon.innerHTML += i + ' tileX:' + currentTileX + ' lon: ' + tile2lon( currentTileX, zoomLevel ) + 
//					' pixelX:' + currentPixelX 
				b;
				currentTileX++;

				i++;

			} 


/*
			var currentTileX = tileStartX;
			i = 0;
			while ( currentTileX <= tileFinishX ) {
				//for (var j = 0; j < tileYCount; j++) {

				currentTileY = tileStartY;
				currentPixelX = -offsetX + i * ( pixelsX - 1 );
				currentPixelY = offsetY;
				j = 0;
				while ( currentTileY <= tileFinishY ) {

					var tile = document.body.appendChild( document.createElement( 'canvas' ) );
					tile.width = 20;
					tile.height = 20;
					tile.style.cssText = 'outline: 1px solid black; position: absolute; ' +
						'left: ' + ( 600 + i * 23) + 'px; top: ' + ( j * 23 ) + 'px;';
					var contextTile = tile.getContext( '2d' );

					currentLatTop = tile2lat( currentTileY, zoomLevel );
					currentLatBottom = tile2lat( currentTileY + 1, zoomLevel );
					deltaLat = currentLatTop - currentLatBottom;
					deltaPixel = 120 * deltaLat;
					
					contextTile.drawImage( image, currentPixelX, currentPixelY, pixelsX, deltaPixel, 0, 0, 20, 20 );
					currentPixelY += deltaPixel;

					if ( i === 0 ) {
						tileTextLat.innerHTML += currentTileY + ' Y:' + currentPixelY + ' dY:' + deltaPixel + b;
					}
					currentTileY++;
					j++;
				}
				//tileTextLon.innerHTML += currentTileX + ' lon px:' + ( currentTileX * ( pixelsX - 1 ) ) + b;
				tileTextLon.innerHTML += i + ' tileX:' + currentTileX + ' lon: ' + tile2lon( currentTileX, zoomLevel ) + 
					' pixelX:' + currentPixelX + b;
				currentTileX++;

				i++;

			} 
*/

		var info = document.body.appendChild( document.createElement( 'div' ) );
		info.style.cssText = 'background-color: #ccc; padding: 10px; opacity: 0.85; position: absolute; right: 20px; top: 50px; ';
		info.innerHTML = '<h1>' + title + '</h1>' +
			'<div id=msg ></div>';

		msg.innerHTML = 
			'fileName: ' + fileName + b +
			b +

			'tileStartX:' + tileStartX + b +
			'tileFinishX:' + tileFinishX + b +
			'tileDeltaX:' + tileDeltaX + b +
			b +

			'tileStartY:' + tileStartY + b +
			'tileFinishY:' + tileFinishY + b +
			'tileDeltaY:' + tileDeltaY + b +
			b +

			'tileStartLon:' + tileStartLon + b +
			'tileDeltaLon:' + tileDeltaLon + b +

			'tileStartLat:' + tileStartLat + b +
			'tileDeltaLat:' + tileDeltaLat + b +

			b +
			'lonDeltaLevel7: ' + lonDeltaLevel7 + b +
			'latDeltaLevel7: ' + latDeltaLevel7 + b +
			'pixelsX: ' + pixelsX + ' pixelsY: ' + pixelsY + b +
			'tileXCount: ' + tileXCount + ' tileYCount: ' + tileYCount + b;
	}


	function addCSS() {
		var css = document.body.appendChild( document.createElement('style') );
		css.innerHTML = 'body { font: 600 12pt monospace; )' + // margin: 0; overflow: hidden; }' +
//			'h1 { margin: 0; }' +
//			'h1 a {text-decoration: none; }' +
//			'#closer { position: absolute; right: 5px; top: 5px; }' +
//			'#movable { overflow: auto; margin: 10px; padding: 10px 20px; position: absolute; }' +
		'';
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
