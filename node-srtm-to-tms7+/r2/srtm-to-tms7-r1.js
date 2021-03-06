// SRTM: pole to pole ~ TMS +/-85
// SRTM 120 data points per degree - both directions

// command line: app file# new/old

	var countPNG = ( process.argv[2] !== undefined ) ? parseInt( process.argv[2], 10 ) : 0;

	var fs = require('fs');
	var PNG = require('pngjs').PNG;

	var folderSRTM = 'c:/temp/srtm30-plus/';
	var folderTMS7 = 'c:/temp/tms7+/';  // has __dirname
	var fileNames;

	var pi = Math.PI, pi05 = pi * 0.5, pi2 = pi + pi;
	var d2r = pi / 180, r2d = 180 / pi;
	var zoomLevel = 7;

	var limit = countPNG + 1;
	var countTMS;
	var count = 0;
	var startTime;

	init();

	function init() {
		startTime = new Date();
		fs.readdir( folderSRTM, function( err, files ) {
			if ( err ) throw err;

			fileNames = [];
			for (var i = 0, len = files.length; i < len; i++) {
				if (!files[i].match(/\.srtm$/i)) continue;
				fileNames.push( files[i] );
			}
			countTMS = 0;
// console.log( 'start', fileNames[ countPNG] );
			readFile( fileNames[ countPNG ] );
		});
	}

	function readFile( fileSRTM ) {
		startTimeFile = new Date();
		fs.readFile( folderSRTM + fileSRTM, function ( err, data ) {
			if ( err ) throw err;
			processSRTM( fileSRTM, data );
		});
	}

	function processSRTM( fileSRTM, imageData ) {

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

// longitude degrees per tile at zoom level 7
		var lonDeltaLevel7 = 360 / Math.pow( 2, 7);

// latitude tileY
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
//			tileFinishY = lat2tile( latFinish, zoomLevel ) + 1;
		} else {
			latStart = latStartFile;
			latFinish = latStart - latDelta;
			tileStartY = lat2tile( latStart, zoomLevel );
			tileFinishY = lat2tile( latFinish, zoomLevel ) + 1;
		}
		var tileDeltaY = tileFinishY - tileStartY;

		var tileStartLat = tile2lat(  tileStartY, zoomLevel );
		var tileFinishLat = tile2lat(  tileFinishY, zoomLevel );
		var tileDeltaLat = tileStartLat - tileFinishLat;

		var currentLatTop, currentLatBottom, deltaLat;
		var srtmHeight = latDelta * 120;
		var srtmWidth = lonDelta * 120;

		var tmsWidth = Math.floor( lonDeltaLevel7 * 120 );
		var tmsXoffset = Math.floor( tmsWidth * Math.abs( tileStartLon - lonStart ) / lonDeltaLevel7 );
		var tmsXStart = tmsXoffset;
		var tmsXFinish = tmsWidth;

		var srtmXStart = 0; // tmsXoffset; // ?? or 0?
		var srtmXFinish = tmsWidth - tmsXoffset;

		var tmsYStart, tmsYFinish, tmsYoffset, tmsHeight;
		if ( latStartFile === 90 ) {
			tmsYoffset = Math.floor( 120 * ( 90 - latStart ) );
		} else if ( latStartFile === 40 || latStartFile === -10 || latStartFile === -60 ) {
			tmsYoffset = Math.floor( 120 * ( tileStartLat - latStart) );
		}

		var srtmYStart, srtmYFinish;

// srtm goes to 90 but tms starts at 85+...

		var txt = '\nprocessSRTM ' + fileSRTM + '\n' + 
			'lonStart:' + lonStart + ' finish:' + lonFinish +  '\n' +
			'tileStartLon:' + tileStartLon + ' Finish:' + tileFinishLon + '\n' +
			'tileX start:' + tileStartX + ' finish:' + tileFinishX + ' delta: ' + tileDeltaX + '\n' +
			'\n' +
			'latStart:' + latStart + ' finish:' + latFinish + '\n' + 
			'tileStartLat:' + tileStartLat.toFixed(3) + ' tileFinishLat:' + tileFinishLat.toFixed(3) + '\n' +
			'tileY start:' + tileStartY + ' finishY:' + tileFinishY + ' delta: ' + tileDeltaY + '\n' + 
			'\n' +
			'srtmWidth:' + srtmWidth + ' srtmHeight:' + srtmHeight + '\n' +

			'lonDeltaLevel7:' + lonDeltaLevel7 + '\n' +
			'tmsWidth:' + tmsWidth + ' total pixels:' + (tmsWidth * tileDeltaX) + '\n' +
			'tmsXoffset:' + tmsXoffset + ' tmsXStart:' + tmsXStart + ' tmsXFinish:' + tmsXFinish + '\n' +
			'srtmXStart:' + srtmXStart + ' srtmXFinish:' + srtmXFinish + '\n' +
			'\n' +
			'tmsYoffset:' + tmsYoffset + ' tmsXStart:' + tmsYStart + ' tmsXFinish:' + tmsYFinish + '\n' +
		'';

console.log( txt );

tileFinishX--;  tileFinishY--;

		for ( var tileX = tileStartX; tileX < tileFinishX; tileX++ ) {

			tmsXStart = ( tileX === tileStartX ) ? tmsXoffset : 0;
			if ( tileX === tileStartX ) {
				srtmXStart = tmsXoffset;
			}

			for ( var tileY = tileStartY; tileY < tileFinishY; tileY++ ) {
				currentLatTop = tile2lat( tileY, zoomLevel );
				currentLatBottom = tile2lat( tileY + 1, zoomLevel );
				deltaLat = currentLatTop - currentLatBottom;
				tmsHeight = Math.floor( 120 * deltaLat );

				if ( tileY === tileStartY ) {
					srtmYStart = 0;
					if ( latStartFile === 90 ) {
						srtmYFinish = tmsYoffset;
					} else {
						srtmYFinish = tmsHeight;
					}
					tmsYStart = tmsYoffset;
					tmsYFinish = tmsHeight;
				} else {
					if ( latStartFile === 90 ) {
						srtmYStart = srtmYFinish;
					} else {
						srtmYStart = srtmYFinish - tmsYoffset;
					}
					srtmYFinish += tmsHeight;

					tmsYFinish = tmsHeight;
					if ( srtmYFinish > srtmHeight ) {
						tmsYFinish = tmsHeight; // - 125; // - ( pngYFinish - srtmHeight );
						srtmYFinish = srtmHeight;
					}
					tmsYStart = 0;
				}


// add something to command line
				if ( process.argv[3] ) {
					processTMSnew ( imageData, tileX, tileY, srtmXStart, srtmXFinish, srtmYStart, srtmYFinish, srtmWidth, tmsXStart, tmsXFinish, tmsYStart, tmsYFinish, tmsWidth, tmsHeight );
				} else if ( tileX === tileStartX || tileX === tileFinishX - 1 || tileY === tileStartY || tileY === tileFinishY - 1 ) {
					processTMS ( imageData, tileX, tileY, pngXStart, pngXFinish, pngYStart, pngYFinish, srtmWidth, tmsXStart, tmsXFinish, tmsYStart, tmsYFinish, tmsWidth, tmsHeight );
					setTimeout( function() { count++; }, 200);
				}

			}
			srtmXStart = srtmXFinish - 1;
			srtmXFinish += tmsWidth;
			tmsXFinish = tmsWidth;
			if ( srtmXFinish > srtmWidth ) {
				tmsXFinish = tmsWidth - ( srtmXFinish - srtmWidth ) + 1;
				srtmXFinish = srtmWidth;
			}

		}

		countPNG++;
//		if ( countPNG < fileNames.length ) {
		if ( countPNG < limit) {
			readFile( fileNames[ countPNG ] );
		}

	}

	function processTMSnew( imageData, tileX, tileY, pngXStart, pngXFinish, pngYStart, pngYFinish, srtmWidth, tmsXStart, tmsXFinish, tmsYStart, tmsYFinish, tmsWidth, tmsHeight) {
		if ( tileY > 127 ) return;
console.log('start processTMSnew' );
		var tms = new PNG({
			width: tmsWidth,
			height: tmsHeight,
			filterType: -1
		});
		var tmsData = tms.data;
		var tmsIndex = 0, i = 0;
		var elevation;
		var pngY = pngYStart;
		var indexPNG = 2 * ( srtmWidth * pngY + pngXStart);
		for ( var tmsY = 0; tmsY < tmsHeight; tmsY++ ) {
			if ( tmsY > tmsYStart ) indexPNG = 2 * ( srtmWidth * pngY++ + pngXStart);
			for ( var tmsX = 0; tmsX < tmsWidth; tmsX++ ) {

				if ( tmsX > tmsXStart && tmsX < tmsXFinish && tmsY > tmsYStart && tmsY < tmsYFinish) {
					i = 4 * tmsIndex;
					elevation = ( imageData[ indexPNG ] * 0xff + imageData[ indexPNG + 0x1 ] );
					tmsData[ i ] = (( elevation & 0xff0000 ) >> 16 );
					tmsData[ i + 1 ] = (( elevation & 0x00ff00 ) >> 8 );
					tmsData[ i + 2 ] = elevation & 0x0000ff;
					tmsData[ i + 3 ] = 0xff;
					indexPNG += 2;
				} else {
// painting nothing is not good

					i = 4 * tmsIndex;
					tmsData[ i ] = 0xff;
					tmsData[ i + 1 ] = 0xff;
					tmsData[ i + 2 ] = 0xff;
					tmsData[ i + 3 ] = 0xff;
				}
				tmsIndex++;
			}
		}
/*
		tms.pack().pipe( fs.createWriteStream( __dirname + folderTMS7 + tileX + '/' + tileY + '.png' ) );
		countTMS++;
console.log( 'l', countTMS, tileX, tileY, 'pxs/f', pngXStart, pngXFinish, 'pys/f', pngYStart, pngYFinish, 'ts', tmsYStart, 'tmsw/h', tmsWidth, tmsHeight, 'pw', srtmWidth, 'tm', new Date() - startTimeApp );
*/

		var wstream = fs.createWriteStream( folderTMS7 + tileX + '/' + tileY + '.png' );
		wstream.on( 'error', function () {
console.log( '*** TMS New Error ', countTMS, tileX, tileY, 'pxs/f', pngXStart, pngXFinish, 'pys/f', pngYStart, pngYFinish, 'ts', tmsYStart, 'tmsw/h', tmsWidth, tmsHeight, 'pw', srtmWidth, 'tm', new Date() - startTime );
		});
		wstream.on( 'finish', function () {
setTimeout( function() { count++; }, 100);
console.log( 'lnew', countPNG - 1, countTMS, tileX, tileY, 'pxs/f', pngXStart, pngXFinish, 'pys/f', pngYStart, pngYFinish, 'ts', tmsYStart, 'tmsw/h', tmsWidth, tmsHeight, 'pw', srtmWidth, 'tm', new Date() - startTime );

		countTMS++;
		});
		tms.pack().pipe( wstream );
	}

	function processTMS( imageData, tileX, tileY, pngXStart, pngXFinish, pngYStart, pngYFinish, srtmWidth, tmsXStart, tmsXFinish, tmsYStart, tmsYFinish, tmsWidth, tmsHeight) {
//console.log('log', countPNG, tileX, tileY );
		if ( tileY > 127 ) return; 
		fs.createReadStream( folderTMS7 + tileX + '/' + tileY + '.png' )
			.pipe( new PNG() )

			.on('error', function() {
console.log('read error', countPNG - 1, tileX, tileY );
// dangerous				processTMSnew( imageData, tileX, tileY, pngXStart, pngXFinish, pngYStart, pngYFinish, srtmWidth, tmsXStart, tmsXFinish, tmsYStart, tmsYFinish, tmsWidth, tmsHeight);
			})

			.on('parsed', function () {
//console.log('start' );
setTimeout( function() { count++; }, 200);
				var tmsData = this.data;
				var tmsIndex = 0, i = 0;
				var elevation;
				var pngY = pngYStart;
				var indexPNG = 2 * ( srtmWidth * pngY + pngXStart);
				for ( var tmsY = 0; tmsY < tmsHeight; tmsY++ ) {
					if ( tmsY > tmsYStart ) indexPNG = 2 * ( srtmWidth * pngY++ + pngXStart);
					for ( var tmsX = 0; tmsX < tmsWidth; tmsX++ ) {
						if ( tmsX > tmsXStart && tmsX < tmsXFinish && tmsY > tmsYStart && tmsY < tmsYFinish) {
							i = 4 * tmsIndex;
							elevation = ( imageData[ indexPNG ] * 0xff + imageData[ indexPNG + 0x1 ] );
							tmsData[ i ] = (( elevation & 0xff0000 ) >> 16 );
							tmsData[ i + 1 ] = (( elevation & 0x00ff00 ) >> 8 );
							tmsData[ i + 2 ] = elevation & 0x0000ff;
							tmsData[ i + 3 ] = 0xff;
							indexPNG += 2;
						} else {
/*
							i = 4 * tmsIndex;
							tmsData[ i ] = 255;
							tmsData[ i + 1 ] = 20;
							tmsData[ i + 2 ] = 20;
							tmsData[ i + 3 ] = 0xff;
*/
						}
						tmsIndex++;
					}
				}

				var wstream = fs.createWriteStream( folderTMS7 + tileX + '/' + tileY + '.png' );
				wstream.on('error', function () {
console.log( '*** TMS Error ', countTMS, tileX, tileY, 'pxs/f', pngXStart, pngXFinish, 'pys/f', pngYStart, pngYFinish, 'ts', tmsYStart, 'tmsw/h', tmsWidth, tmsHeight, 'pw', srtmWidth, 'tm', new Date() - startTime );
				});
				wstream.on('finish', function () {
setTimeout( function() { count++; }, 200);
console.log( 'lex', countPNG - 1, countTMS, 'tx', tileX, tileY, 'pxs/f', pngXStart, pngXFinish, 'pys/f', pngYStart, pngYFinish, 'ts', tmsYStart, 'tmsw/h', tmsWidth, tmsHeight, 'pw', srtmWidth, 'tm', new Date() - startTime );

				countTMS++;
				});
				this.pack().pipe( wstream );
			});
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
