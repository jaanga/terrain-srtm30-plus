	var fs = require('fs');
	var PNG = require('pngjs').PNG;

	var folderNameIn = '../../srtm/';
	var folderNameOut = '../../png/';
	var fileBlank = '../blank-4800x6000.png';
	var fileAntarctic = '../blank-7200x3600.png';
	var shortList = [ 7, 11, 14, 19, 26, 30, 37 ];

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
console.log( 'start', fileNames[ count] );
		});
	}

	function readFile( fileName ) {
		startTimeFile = new Date();
		fs.readFile( folderNameIn + fileName, function ( err, data ) {
			if ( err ) throw err;
			// if (!fileName.match(/\.srtm$/i)) return;
			processData( data, fileName );
		});
	}

	function processData( byteArray, fileName ) {

		var signLon = ( fileName.substr( 0, 1 ) === 'w' ) ? -1 : 1;
		var signLat = ( fileName.substr( 4, 1 ) === 's' ) ? -1 : 1;

		var lonStart = signLon * parseInt( fileName.substr( 1, 3 ), 10 );
		var latStart = signLat * parseInt( fileName.substr( 5, 2 ), 10 );
		var blank;

		if ( latStart === -60) {
			blank = fileAntarctic;
		} else {
			blank = fileBlank;
		}

		fs.createReadStream( blank )

		.pipe( new PNG( {
			filterType: 4
		} ) )

		.on( 'parsed', function() {
			var thisData = this.data, len = thisData.length;
			var elevation;
			var index = 0;
			for ( i = 0; i < len; i += 4 ) {
				elevation = ( byteArray[ index ] * 256 + byteArray[ index + 1] );
				index += 2;
				thisData[ i ] = (( elevation & 0xff0000 ) >> 16 );
				thisData[ i + 1 ] = (( elevation & 0x00ff00 ) >> 8 );
				thisData[ i + 2 ] = elevation & 0x0000ff;
				thisData[ i + 3 ] = 255;
			}

			this.pack().pipe( fs.createWriteStream( folderNameOut + fileNames[ count ].slice( 0, -5 ) + '.png' ) );
console.log( 'log', count, fileNames[count], 'file time:', new Date() - startTimeFile, 'app time:', new Date() - startTimeApp );
			count++;
			if ( count < fileNames.length ) {
				readFile( fileNames[count] );
			}
		} );
	}
