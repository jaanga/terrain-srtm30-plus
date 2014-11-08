// SRTM: pole to pole ~ TMS +/-85
// SRTM 120 data points per degree - both directions

	var fs = require('fs');
	var PNG = require('pngjs').PNG;

	var folderSRTM = '../../srtm/';
	var folderTMS7 = '../tms7-dev/';
	var fileNames;
	var fileNamesTMS;

	var pi = Math.PI, pi05 = pi * 0.5, pi2 = pi + pi;
	var d2r = pi / 180, r2d = 180 / pi;
	var zoomLevel = 7;

	var countPNG;
	var countTMS;

	var startTime;

	init();

	function init() {
		startTime = new Date();
		fs.readdir( folderSRTM, function( err, files ) {
			if (err) {
				console.log(err);
				return;
			 }

			fileNames = [];
			for (var i = 0, len = files.length; i < len; i++) {
				if (!files[i].match(/\.srtm$/i)) continue;
				fileNames.push( files[i] );
			}
			countPNG = 0;
			countTMS = 0;
console.log( 'start', fileNames[ countPNG ] );
			readSRTMFileSync( fileNames.shift() );
		});
	}

	function readSRTMFileSync( fileSRTM ) {
		if ( fileSRTM && countPNG < 3 ) {
			var data = fs.readFileSync( folderSRTM + fileSRTM );
console.log( ++countPNG, fileSRTM, data, new Date() - startTime );
			if ( fileNamesTMS ) {
console.log( 'def', fileNamesTMS.length );
			} else {
				readDirTMS();
console.log( 'TMS7 dirs/', fileNamesTMS.length, fileNamesTMS[0] );
			}
			countTMS = 0;
			readFilesTMSSync( fileNamesTMS.shift() );

			readSRTMFileSync( fileNames.shift() );
		} else {
console.log( 'finished', new Date() - startTime );
		}
	}

	function readDirTMS() {
		fileNamesTMS = fs.readdirSync( folderTMS7 + '/' + countTMS + '/' );

	}


	function readFilesTMSSync( fileTMS ) {
		if ( fileTMS && countTMS < 3 ) {
			var data = fs.readFileSync( folderTMS7 + '/' + countTMS + '/'  + fileTMS );
console.log( ++countTMS, fileTMS, data );
			readFilesTMSSync( fileNamesTMS.shift() )
		}

	}



	function readSourceFile( fileSRTM ) {
		fs.readFileSync( folderSRTM + fileSRTM, function ( err, data ) {
			if (err) {
				return console.log(err);
			 }
console.log( fileSRTM, data );
		});
	}