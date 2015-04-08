// https://github.com/niegowski/node-pngjs
// https://github.com/niegowski/node-pngjs/blob/master/examples/test/test.js

	var fs = require('fs');
	var PNG = require('pngjs').PNG;

	var startTimeApp = new Date();

	var pi = Math.PI, pi05 = pi * 0.5, pi2 = pi + pi;
	var d2r = pi / 180, r2d = 180 / pi;

	var zoomLevel = 7;

	fs.readdir(__dirname + '/../../png/', function( err, files ) {
		if (err) throw err;
		var count = 0;

console.log( 'start', files );

//		files.forEach( function( file ) {
		for ( var i = 0, iLen = files.length; i < 1; i++ )  {
			file = files[i];

			if ( !file.match( /\.png$/i ) ) return;

			var startTimeFile = new Date();

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
			var lonStart = lonStartFile;
			var lonDeltaLevel7 = 360 / 128;
			var lonFinish = lonStartFile + lonDelta;
			lonFinish = lonFinish > 179 ? 179 : lonFinish;

			var tileStartX = lon2tile( lonStart, zoomLevel );
			var tileFinishX = lon2tile( lonFinish, zoomLevel ) + 1;
//			var tileDeltaX = tileFinishX - tileStartX;
//			var tileCountX = Math.floor( lonDelta / lonDeltaLevel7 ) + 1;

			var tileStartLon = tile2lon(  tileStartX, zoomLevel );
//			var tileDeltaLon = - tileStartLon + tile2lon(  tileStartX + 1, zoomLevel );

			var pixelsX = Math.floor( lonDeltaLevel7 * 120 );
			var offsetX = Math.floor( -pixelsX * (tileStartLon - lonStart) / lonDeltaLevel7 );

// console.log( file, 'ls', lonStart, 'lf', lonFinish, 'ts', tileStartX, 'tf', tileFinishX, 'tsl', tileStartLon, 'px', pixelsX, 'ox', offsetX )

// lat Y
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

//			var pixelsY = Math.floor( latDeltaLevel7 * 120 );
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

//			var tileDeltaLat = tileStartLat - tile2lat(  tileStartY + 1, zoomLevel );
//			var tileDeltaY = tileFinishY - tileStartY;

//			var latDeltaLevel7 = 180 / 128;
//			var pixelsY = Math.floor( latDeltaLevel7 * 120) + 1;
//			var tileYCount = Math.floor( latDelta / latDeltaLevel7 ) + 1;


// console.log( file, offsetY, 'tsl', tileStartLat, 'ls', latStart, 'lf', latFinish, 'tsy', tileStartY, 'tfy', tileFinishY );

			fs.createReadStream( __dirname + '/../../png/' + file )
				.pipe( new PNG( {
					filterType: 4
				} ) )

				.on('parsed', function() {
					var pngIdx, tmsIdx, tmsX, tmsY, offX, offY;
					var currentLatTop, currentLatBottom, deltaLat;
					var xStart, xDelta, xFinish;
					var yStart, yDelta, yFinish;

					xStart = offsetX;
					xDelta = pixelsX;
					xFinish = xDelta;

					for ( var tileX = tileStartX; tileX < tileFinishX; tileX++ ) {
						if ( latStartFile === 90 ) {
							yStart = offsetY;
						} else {
							yStart = 0;
						}
						offX = ( tileX === tileStartX ) ? offsetX : 0;

						for ( var tileY = tileStartY; tileY < tileFinishY; tileY++ ) {

							tmsY = ( tileY === tileStartY ) ? offsetY : 0;

							currentLatTop = tile2lat( tileY, zoomLevel );
							currentLatBottom = tile2lat( tileY + 1, zoomLevel );
							deltaLat = currentLatTop - currentLatBottom;
							yDelta = Math.floor( 120 * deltaLat );

							if ( tileY === tileStartY ) {
								yFinish = Math.floor( yDelta - offsetY );
									if ( latStartFile === 90 ) {
										yFinish = Math.floor( offsetY );
									}

							} else {
								yFinish += Math.floor( yDelta ) ;
							}

							yFinish = ( yFinish > this.height ) ? this.height : yFinish; 


							fs.readFile( __dirname + '/../../tms7/' + tileX + '/' + tileY + '.png', function ( err, data ) {
								if ( err )  {
									var tms = new PNG({
										width: xDelta,
										height: yDelta,
										filterType: -1
									});
								}



//							fs.createReadStream( __dirname + '/../../tms7/' + tileX + '/' + tileY + '.png')

//								.on('parsed', function() {
console.log( 'ggggg' );
									for ( var y = yStart; y < yFinish; y++ ) {
										tmsX = offX;
										for ( var x = xStart; x < xFinish; x++ ) {
												pngIdx = ( this.width * y + x ) * 4;
												tmsIdx = ( tms.width * tmsY + tmsX++ ) * 4;
												tms.data[ tmsIdx ] = this.data[ pngIdx ];
												tms.data[ tmsIdx + 1 ] = this.data[ pngIdx + 1 ];
												tms.data[ tmsIdx + 2 ] = this.data[ pngIdx + 2 ];
												tms.data[ tmsIdx + 3 ] = 255;
										}
										tmsY++;
									}

									tms.pack().pipe( fs.createWriteStream( __dirname + '/../../tms7/' + tileX + '/' + tileY + '.png' )  );
									count++;
									yStart = yFinish;

		console.log( 'log', count, tileX, tileY, 'st', xStart, yStart, 'dlat', deltaLat.toFixed(3), xDelta, yDelta, 'file:', new Date() - startTimeFile, 'app:', new Date() - startTimeApp );


								});



						}
						xStart = xFinish;
						xFinish += xDelta;
						xFinish = ( xFinish > this.width ) ? this.width : xFinish; 
					} 
				});

		}
//		});
	});

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
