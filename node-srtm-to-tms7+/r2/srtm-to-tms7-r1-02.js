// SRTM: pole to pole ~ TMS +/-85
// SRTM 120 data points per degree - both directions

	var fs = require('fs');
	var PNG = require('pngjs').PNG;

	var folderSRTM = '../srtm/';
	var folderTMS7 = '/tms7-dev/';
	var fileNames;

	var pi = Math.PI, pi05 = pi * 0.5, pi2 = pi + pi;
	var d2r = pi / 180, r2d = 180 / pi;
	var zoomLevel = 7;

	var countPNG;
	var countTMS;

	var startTimeApp;
	var startTimeFile;

	init();

	function init() {
		fs.readdir( folderSRTM, function( err, files ) {
			if ( err ) throw err;
			startTimeApp = new Date();
			fileNames = [];
			for (var i = 0, len = files.length; i < len; i++) {
				if (!files[i].match(/\.srtm$/i)) continue;
				fileNames.push( files[i] );
			}
			countPNG = 0;
			countTMS = 0;
//console.log( 'start', fileNames[ countPNG] );
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

	function processSRTM( fileSRTM, imageData) {
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

// lon tileX
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
			tileFinishY = 127;
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
		var pngHeight = latDelta * 120;
		var pngWidth = lonDelta * 120;

		var tmsWidth = Math.floor( lonDeltaLevel7 * 120 );
		var tmsXoffset = Math.floor( -tmsWidth * (tileStartLon - lonStart) / lonDeltaLevel7 );
		var tmsXFinish = tmsWidth;

		var tmsXStart, tmsYStart, tmsYoffset, tmsHeight;
		if ( latStartFile === 90 ) {
			tmsYoffset = Math.floor( 120 * ( 90 - latStart ) );
		} else if ( latStartFile === 40 || latStartFile === -10 || latStartFile === -60 ) {
			tmsYoffset = Math.floor( 120 * ( tileStartLat - latStart) );
		}
// console.log( tmsYoffset );
		var pngXStart = tmsXoffset; // ?? or 0?
		var pngXFinish = tmsWidth;
		var pngYStart = 0; pngYFinish = 0;

		for ( var tileX = tileStartX; tileX < tileFinishX; tileX++ ) {
// srtm goes to 90 but tms starts at 85...
//			pngYStart = tmsYoffset;
			if ( latStartFile === 90 ) {
				pngYFinish = tmsYoffset;
			} else {
				pngYFinish = 0;
			}

			tmsXStart = ( tileX === tileStartX ) ? tmsXoffset : 0;

			for ( var tileY = tileStartY; tileY < tileFinishY; tileY++ ) {
				currentLatTop = tile2lat( tileY, zoomLevel );
				currentLatBottom = tile2lat( tileY + 1, zoomLevel );
				deltaLat = currentLatTop - currentLatBottom;
				tmsHeight = Math.floor( 120 * deltaLat );

				if ( tileY === tileStartY ) {
//					pngYStart = pngYFinish;
					pngYStart = 0; // tmsYoffset;
					pngYFinish += tmsHeight;
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
				processTMSnew( imageData, tileX, tileY, pngXStart, pngXFinish, pngYStart, pngYFinish, pngWidth, tmsXStart, tmsXFinish, tmsYStart, tmsYFinish, tmsWidth, tmsHeight );

			}
			pngXStart = pngXFinish;
			pngXFinish += tmsWidth;
			tmsXFinish = tmsWidth;
			if ( pngXFinish > pngWidth ) {
				tmsXFinish = tmsWidth - ( pngXFinish - pngWidth );
				pngXFinish = pngWidth;
			}
		}

console.log( 'processSRTM' , countPNG, fileSRTM, imageData );
		countPNG++;
//		if ( countPNG < fileNames.length ) {
		if ( countPNG < 1 ) {
			readFile( fileNames[ countPNG ] );
		}
	}

	function processTMSnew( imageData, tileX, tileY, pngXStart, pngXFinish, pngYStart, pngYFinish, pngWidth, tmsXStart, tmsXFinish, tmsYStart, tmsYFinish, tmsWidth, tmsHeight) {
		var tms = new PNG({
			width: tmsWidth,
			height: tmsHeight,
			filterType: 4
		});
		var tmsData = tms.data;
		var tmsIndex = 0, i = 0;
		var elevation;
		var pngY = pngYStart;
		var indexPNG = 2 * ( pngWidth * pngY + pngXStart);
		for ( var tmsY = 0; tmsY < tmsHeight; tmsY++ ) {
			if ( tmsY > tmsYStart ) indexPNG = 2 * ( pngWidth * pngY++ + pngXStart);
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
					i = 4 * tmsIndex;
/*
					tmsData[ i ] = 255;
					tmsData[ i + 1 ] = 20;
					tmsData[ i + 2 ] = 20;
					tmsData[ i + 3 ] = 0xff;
*/
				}
				tmsIndex++;
			}
		}

/*
		var tmsData = tms.data, len = tms.data.length;
		var elevation;
		var pngX;
		var pngY = pngYStart;
		var indexPNG = 2 * ( pngWidth * pngY + pngXStart);
		var finish = indexPNG + 2 * (tms.width - tmsXStart);

		var tmsY = tmsYStart;
		var start = 4 * ( tmsWidth * tmsY + tmsXStart );
		var countTMSX = 0;
		for ( i = 0 ; i < len; i += 4 ) {
			if ( i < start || indexPNG >= imageData.length ) {
				tmsData[ i ] = 255;
				tmsData[ i + 1 ] = 200;
				tmsData[ i + 2 ] = 200;
				tmsData[ i + 3 ] = 0xff;
			} else {
				elevation = ( imageData[ indexPNG ] * 256 + imageData[ indexPNG + 1] );
				tmsData[ i ] = (( elevation & 0xff0000 ) >> 16 );
				tmsData[ i + 1 ] = (( elevation & 0x00ff00 ) >> 8 );
				tmsData[ i + 2 ] = elevation & 0x0000ff;
				tmsData[ i + 3 ] = 255;
				indexPNG += 2;
				countTMSX++;
			}
//			if ( countTMSX >= tmsWidth ) {
			if ( indexPNG >= finish ) {
				indexPNG = 2 * ( pngWidth * pngY + pngXStart );
				finish = indexPNG + 2 * (tms.width - tmsXStart);
				pngY++;
// does not handle right edge
				pngX = 2 * pngWidth * pngY;
				tmsData[ i ] = 255;
				tmsData[ i + 1 ] = 20;
				tmsData[ i + 2 ] = 20;
				tmsData[ i + 3 ] = 0xff;

				finish = ( finish > pngX ) ? pngX : finish;
// stops pixels from appearing on left edge. Dunno why yet.
				i = 4 * ( tmsWidth * tmsY + tmsXStart - 1 );
				tmsY++;
				countTMSX = 0;
			}
		}
*/
		tms.pack().pipe( fs.createWriteStream( __dirname + folderTMS7 + tileX + '/' + tileY + '.png' ) );
		countTMS++;
console.log( 'l', countTMS, tileX, tileY, 'pxs/f', pngXStart, pngXFinish, 'pys/f', pngYStart, pngYFinish, 'ts', tmsYStart, 'tmsw/h', tmsWidth, tmsHeight, 'pw', pngWidth, 'tm', new Date() - startTimeApp );
// console.log( 'l', countTMS, tmsIndex, tmsWidth * tmsHeight, tmsXStart, tmsYStart, tmsYFinish);

	}

	function processTMS( imageData, tileX, tileY, pngXStart, pngXFinish, pngYStart, pngYFinish, pngWidth, tmsXStart, tmsYStart, tmsWidth, tmsHeight ) {
// console.log('processTMS', countPNG );

//		fs.createReadStream( __dirname + '/tms7-dev/' + tileX + '/' + tileY + '.png' )
		if ( tileY > 126 ) return; 
		fs.createReadStream( __dirname + '/tms7-dev/' + tileX + '/' + tileY + '.png' )
			.pipe( new PNG() )

			.on('error', function() {
console.log('error', countPNG, file );

				var tms = new PNG({
					width: tmsWidth,
					height: tmsHeight,
					filterType: -1
				});
				this.data = tms.data;
//				this.pack().pipe( fs.createWriteStream( __dirname + '/test/test.png' )  );
				this.pack().pipe( fs.createWriteStream( __dirname + folderTMS + tileX + '/' + tileY + '.png' )  );
				countTMS++;
			})

			.on('parsed', function () {
/*
console.log('parsed', this.data );
				var pngIdx, tmsIdx;
				var tmsX, tmsY = tmsYStart;
				var tmsWidth = this.width;
				for ( var pngY = pngYStart; pngY < pngYFinish; pngY++ ) {
					tmsX = tmsXStart;
					for ( var pngX = pngXStart; pngX < pngXFinish; pngX++ ) {
						pngIdx = ( pngWidth * pngY + pngX ) * 4;
						tmsIdx = ( tmsWidth * tmsY + tmsX++ ) * 4;
						this.data[ tmsIdx ] = imageData[ pngIdx ];
						this.data[ tmsIdx + 1 ] = imageData[ pngIdx + 1 ];
						this.data[ tmsIdx + 2 ] = imageData[ pngIdx + 2 ];
						this.data[ tmsIdx + 3 ] = 255;
					}
					tmsY++;
				}

				this.pack().pipe( fs.createWriteStream( folderTMS7 + tileX + '/' + tileY + '.png' )  );
//				this.pack().pipe( fs.createWriteStream( __dirname + '/test/test.png' )  );
*/
				countTMS++;
console.log( 'l', countTMS, tileX, tileY, 'pxs/f', pngXStart, pngXFinish, 'pys/f', pngYStart, pngYFinish, 'ts', tmsYStart, 'tmsw/h', tmsWidth, tmsHeight, 'pw', pngWidth, 'tm', new Date() - startTimeApp );

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
