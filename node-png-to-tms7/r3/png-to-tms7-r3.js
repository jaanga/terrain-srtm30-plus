
	var fs = require( 'fs' );
    var PNG = require( '../node_modules/pngjs').PNG;

	var startTimeApp = new Date();

	var pi = Math.PI, pi05 = pi * 0.5, pi2 = pi + pi;
	var d2r = pi / 180, r2d = 180 / pi;

	var zoomLevel = 7;

	var folderPNG = '../../png/';
	var folderTMS = '../../tms7/';

	var countPNG = 0;
	var countTMS = 0;

	init();

	function init() {
console.log('start');
		fs.readdir( folderPNG, function( err, files) {
			if (err) throw err;
			var file, src, png;

			files.forEach( function( file ) {  // passes JSLint
//			for ( var i = 0; i < files.length; i++ ) {
//				file = files[i];

				if ( !file.match( /\.png$/i ) ) return;
//				if ( !file.match( /\.png$/i ) ) continue;

				src = fs.createReadStream( folderPNG + file );

				png = new PNG({
					filterType: -1
				});
				png.on( 'error',  function() {
console.log( 'error', this.count, this.file, this.data );
				});
				png.on('parsed', function() {
console.log( 'folderPNG', this.count, this.file, this.data );
					processFolderPNG( this.count, this.file, this.data );
				});

				png.count = countPNG;
				png.file = file;
				countPNG++;
				src.pipe( png );
//			}
			});
		});
	}

	function processFolderPNG( count, file, imageData) {
			var signLon = ( file.substr( 0, 1 ) === 'w' ) ? -1 : 1;
			var signLat = ( file.substr( 4, 1 ) === 's' ) ? -1 : 1;

			var lonStartFile = signLon * parseInt( file.substr( 1, 3 ), 10 );
			var latStartFile = signLat * parseInt( file.substr( 5, 2 ), 10 );

			var lonDelta, latDelta;
			if ( latStartFile !== -60) {
				lonDelta = 40;
				latDelta = 50;
			} else {
				lonDelta = 60;
				latDelta = 30;
			}

// lon tileX
			var tileStartX = lon2tile( lonStartFile, zoomLevel );

			var lonFinish = lonStartFile + lonDelta;
			lonFinish = lonFinish > 179 ? 179 : lonFinish;
			var tileFinishX = lon2tile( lonFinish, zoomLevel ) + 1;

			var lonDeltaLevel7 = 360 / 128;
			var xDelta = Math.floor( lonDeltaLevel7 * 120 );
			var tmsWidth = Math.floor( lonDeltaLevel7 * 120 );
			var tileStartLon = tile2lon(  tileStartX, zoomLevel );
			var xOffset = Math.floor( -xDelta * (tileStartLon - lonStartFile) / lonDeltaLevel7 );
			var pngWidth = lonDelta * 120;

// console.log( file, 'ls', lonStartFile, 'lf', lonFinish, 'ts', tileStartX, 'tf', tileFinishX, 'tsl', tileStartLon, 'ox', xOffset )

// lat tileY
			var latFinish, tileStartY;
			if ( latStartFile === 90 ) {
				latStart =  tile2lat( 0, zoomLevel );
				latFinish = latStart - latDelta;
				tileStartY = 0;
			} else if ( latStartFile === -60) {
				latStart = latStartFile;
				latFinish = tile2lat( 128, 0 );
				tileStartY = lat2tile( latStart, zoomLevel );
			} else {
				latStart = latStartFile;
				latFinish = latStart - latDelta;
				tileStartY = lat2tile( latStart, zoomLevel );
			}

			var tileStartLat = tile2lat(  tileStartY, zoomLevel );

			var offsetY;
			if ( latStartFile === 90 ) {
				offsetY = Math.floor( (90 - latStart ) * 6000 / 50 );
			} else if ( latStartFile === 40 || latStartFile === -10 || latStartFile === -60 ) {
				offsetY = Math.floor( 120 * ( tileStartLat - latStart) );
			}

			var tileFinishY;
			if ( latStartFile === -60 ) {
				tileFinishY = 127;
			} else {
				tileFinishY = lat2tile( latFinish, zoomLevel ) + 1;
			}
// console.log( file, offsetY, 'tsl', tileStartLat, 'ls', latStart, 'lf', latFinish, 'tsy', tileStartY, 'tfy', tileFinishY );

			var yOffset, yStart, yDelta, yFinish;
			var currentLatTop, currentLatBottom, deltaLat;

			var xStart = xOffset;
			var xFinish = xDelta;
			var fileTMS7;
			for ( var tileX = tileStartX; tileX < tileFinishX; tileX++ ) {
				if ( latStartFile === 90 || latStartFile === 40) {
					yStart = offsetY;
				} else {
					yStart = 0;
				}
				xOffset = ( tileX === tileStartX ) ? xOffset : 0;

				for ( var tileY = tileStartY; tileY < tileFinishY; tileY++ ) {

					yOffset = ( tileY === tileStartY ) ? offsetY : 0;

					currentLatTop = tile2lat( tileY, zoomLevel );
					currentLatBottom = tile2lat( tileY + 1, zoomLevel );
					deltaLat = currentLatTop - currentLatBottom;
					yDelta = Math.floor( 120 * deltaLat );

/*
					if ( tileY === tileStartY ) {
						yFinish = Math.floor( yDelta - offsetY );
							if ( latStartFile === 90 ) {
								yFinish = Math.floor( offsetY );
							}

					} else {
						yFinish += Math.floor( yDelta ) ;
					}

					yFinish = ( yFinish > 6000 ) ? 6000 : yFinish;
*/

					yFinish = yStart + yDelta;
					yFinish = ( yFinish > 6000 ) ? 6000 : yFinish;


					fileTMS7 =  tileX + '/' + tileY + '.png';
					processTMS( fileTMS7, imageData, tmsWidth, pngWidth, xDelta, xOffset, yOffset, xStart, xFinish, yStart, yFinish, yDelta, tileX, tileY );
					yStart = yFinish;
				}
				xStart = xFinish;
				xFinish += xDelta;
				xFinish = ( xFinish > 4800 ) ? 4800 : xFinish;
			}
console.log( 'processFolderPNG' , count, file, imageData );
	}

	function processTMSnew( file, imageData, tmsWidth, pngWidth, xDelta, xOffset, yOffset, xStart, xFinish, yStart, yFinish, yDelta, tileX, tileY ) {
		var tms = new PNG({
			width: tmsWidth,
			height: yDelta,
			filterType: -1
		});
		var pngIdx, tmsIdx;
		var tmsX, tmsY = yOffset;
		var tmsWidth = tms.width;
		for ( var pngY = yStart; pngY < yFinish; pngY++ ) {
			tmsX = xOffset;
			for ( var pngX = xStart; pngX < xFinish; pngX++ ) {
				pngIdx = ( pngWidth * pngY + pngX ) * 4;
				tmsIdx = ( tmsWidth * tmsY + tmsX++ ) * 4;
				tms.data[ tmsIdx ] = imageData[ pngIdx ];
				tms.data[ tmsIdx + 1 ] = imageData[ pngIdx + 1 ];
				tms.data[ tmsIdx + 2 ] = imageData[ pngIdx + 2 ];
				tms.data[ tmsIdx + 3 ] = 255;
			}
			tmsY++;
		}
		tms.pack().pipe( fs.createWriteStream( folderTMS + tileX + '/' + tileY + '.png' ) );
		count++;
console.log( 'l', count, tileX, tileY, 'xs/f', xStart, xFinish, 'ys/f', yStart, yFinish, 'xd', xDelta, 'yd', yDelta, 'tmsw/h', tmsWidth, yDelta, 'pw', pngWidth, 'tm', new Date() - startTimeApp );
	}

	function processTMS( file, imageData, tmsWidth, pngWidth, xDelta, xOffset, yOffset, xStart, xFinish, yStart, yFinish, yDelta, tileX, tileY ) {
		fs.createReadStream( folderTMS + tileX + '/' + tileY + '.png' )
			.pipe( new PNG() )
			.on('error', function() {
				var tms = new PNG({
					width: tmsWidth,
					height: yDelta,
					filterType: -1
				});
				this.data = tms.data;
//				this.pack().pipe( fs.createWriteStream( __dirname + '/test/test.png' )  );
				this.pack().pipe( fs.createWriteStream( folderTMS + tileX + '/' + tileY + '.png' )  );
console.log('error', count, file );
				countTMS++;
			})
			.on('parsed', function () {

				var pngIdx, tmsIdx;
				var tmsX, tmsY = yOffset;
				var tmsWidth = this.width;
				for ( var pngY = yStart; pngY < yFinish; pngY++ ) {
					tmsX = xOffset;
					for ( var pngX = xStart; pngX < xFinish; pngX++ ) {
						pngIdx = ( pngWidth * pngY + pngX ) * 4;
						tmsIdx = ( tmsWidth * tmsY + tmsX++ ) * 4;
						this.data[ tmsIdx ] = imageData[ pngIdx ];
						this.data[ tmsIdx + 1 ] = imageData[ pngIdx + 1 ];
						this.data[ tmsIdx + 2 ] = imageData[ pngIdx + 2 ];
						this.data[ tmsIdx + 3 ] = 255;
					}
					tmsY++;
				}

				this.pack().pipe( fs.createWriteStream( folderTMS + tileX + '/' + tileY + '.png' )  );
//				this.pack().pipe( fs.createWriteStream( __dirname + '/test/test.png' )  );
				countTMS++;
console.log( 'tms', countTMS, file, pngWidth, 'tw', tmsWidth, 'xo', xOffset, 'yo', yOffset, 'xs', xStart, 'xf', xFinish, 'ys', yStart, yFinish, 't', new Date() - startTimeApp);

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
