// https://github.com/niegowski/node-pngjs
// https://github.com/niegowski/node-pngjs/blob/master/examples/test/test.js

	var fs = require('fs');
	var PNG = require('pngjs').PNG;
	var startTimeApp = new Date();
	var pi = Math.PI, pi05 = pi * 0.5, pi2 = pi + pi;
	var d2r = pi / 180, r2d = 180 / pi;  // degress / radians;
	var zoomLevel = 7;


	fs.readdir(__dirname + '/../../png1/', function( err, files ) {
		if (err) throw err;
		var count = 0;

console.log( 'start', files );

		files.forEach( function( file ) {

/// 
			var signLon = ( file.substr( 0, 1 ) === 'w' ) ? -1 : 1;
			var signLat = ( file.substr( 4, 1 ) === 's' ) ? -1 : 1;

			var lonStart = signLon * parseInt( file.substr( 1, 3 ), 10 );
			var latStart = signLat * parseInt( file.substr( 5, 2 ), 10 );

			if ( latStart === -60) {
				var latDelta = 30;
				var lonDelta = 60;
			} else {
				var latDelta = 50;
				var lonDelta = 40;
			}
			var lonDeltaLevel7 = 360 / 128;

	// lon X
			var lonFinish = lonStart + lonDelta;
			lonFinish = lonFinish > 179 ? 179 : lonFinish;

			var tileStartX = lon2tile( lonStart, zoomLevel );
			var tileFinishX = lon2tile( lonFinish, zoomLevel ) + 1;

			var tileStartLon = tile2lon(  tileStartX, zoomLevel );


			var offsetX = -337.5 * (tileStartLon - lonStart) / lonDeltaLevel7;
			var tileDeltaLon = - tileStartLon + tile2lon(  tileStartX + 1, zoomLevel );
			var pixelsX = Math.floor( lonDeltaLevel7 * 120);
			var tileXCount = Math.floor( lonDelta / lonDeltaLevel7 ) + 1;


	// lat Y
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
			}

			if ( latStart === -60 ) {
				var tileFinishY = 127;
			} else {
				var tileFinishY = lat2tile( latFinish, zoomLevel ) + 1;
			}

			var tileDeltaLat = tileStartLat - tile2lat(  tileStartY + 1, zoomLevel );

			var tileDeltaX = tileFinishX - tileStartX;
			var tileDeltaY = tileFinishY - tileStartY;


			var latDeltaLevel7 = 180 / 128;

			var pixelsY = Math.floor(latDeltaLevel7 * 120);


			var tileYCount = Math.floor( latDelta / latDeltaLevel7 ) + 1;


			if (!file.match(/\.png$/i)) return;




			var startTimeFile = new Date();

			fs.createReadStream( __dirname + '/../../png/' + file )
				.pipe( new PNG() )
				.on('parsed', function() {
					var pngIdx, tmsIdx;
					xStart = 0;
					xDelta = 338;
					xFinish = xStart + xDelta - 1;
					yStart = 0;
					yDelta = 6000 / 20;
					yFinish = yStart + yDelta - 1;



					for (var i = 0; i < 16; i++) {
						for (var j = 0; j < 20; j++) {

							var tms = new PNG({
								width: 338,
								height: 300,
								filterType: -1
							});

							for ( var y = yStart; y < yFinish; y++ ) {
								for ( var x = xStart; x < xFinish; x++ ) {
									//if ( x < 338 && y < 100 ) {
										pngIdx = ( this.width * y + x ) * 4;
										tmsIdx = ( tms.width * (y - yStart) + x ) * 4;
										tms.data[ tmsIdx  ] = this.data[ pngIdx ];
										tms.data[ tmsIdx + 1 ] = this.data[ pngIdx + 1 ];
										tms.data[ tmsIdx + 2 ] = this.data[ pngIdx + 2 ];
										tms.data[ tmsIdx + 3 ] = 255;
									//}
								}


							}


							tms.pack().pipe( fs.createWriteStream( __dirname + '/../../tms7/' + j + '-' + i + '.png' ) );
							count++;
console.log( 'log',file, count, 'file time:', new Date() - startTimeFile, 'app time:', new Date() - startTimeApp );
//console.log( tms.data.length );
//console.log( tms.data );
//console.log( this.data );

						}
							yStart += yDelta;
							yFinish += yDelta;

					} 




				});

	});
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

/*
	var fs = require('fs');
	var PNG = require('pngjs').PNG;

	var folderNameIn = '../../png/';
	var folderNameOut = '../../tms7/';
	var fileBlank = '../../samples-png/blank-4800x6000.png';
	var fileAntarctic = '../../samples-png/blank-7200x3600.png';
	var shortList = [ 6, 10, 14, 21, 25, 32 ];

	var fileNames;
	var count;
	var startTimeApp; 
	var startTimeFile; 

	init();

	function init() {
		fs.readdir( folderNameIn, function( err, files ) {
			if ( err ) throw err;
			startTimeApp = new Date();
			fileNames = files;
			count = 0;
			readFile( fileNames[ count] );
console.log( 'start' );
		});
	}

	function readFile( fileName ) {
		startTimeFile = new Date();
		fs.readFile( folderNameIn + fileName, function ( err, data ) {
			if ( err ) throw err;
			processData( data );
		});
	}

	function processData( byteArray ) {
		var blank = ( shortList.indexOf( count ) > -1 ) ? fileAntarctic : fileBlank;
		fs.createReadStream( blank )

		.pipe( new PNG( {
			filterType: 4
		} ) )

		.on( 'parsed', function() {
			var thisData = this.data, len = thisData.length;
			var elevation;
			var index = 0;
			for ( i = 0; i < len; i++ ) {
				elevation = ( (byteArray[ index++ ] << 8) + byteArray[ index++ ] );
				thisData[ i++ ] = (( elevation & 0xff0000 ) >> 16 );
				thisData[ i++ ] = (( elevation & 0x00ff00 ) >> 8 );
				thisData[ i++ ] = elevation & 0x0000ff;
				thisData[ i ] = 255;
			}

			this.pack().pipe( fs.createWriteStream( folderNameOut + fileNames[ count ].slice( 0, -5 ) + '.png' ) );
console.log( 'log', count, fileNames[count], 'file time:', new Date() - startTimeFile, 'app time:', new Date() - startTimeApp );
			count++;
			if ( count < fileNames.length ) {
				readFile( fileNames[count] );
			}
		} );
	}
*/
