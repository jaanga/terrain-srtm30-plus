	var fs = require('fs');
	var PNG = require('../node_modules/pngjs').PNG;

	var ulX = 1500
	var ulY = 1400;
	var lrX = 2500;
	var lrY = 1600;

	var folderSRTM = '../../srtm/';
	var fileSRTM = 'e020n40.Bathymetry.srtm';
	var startTime;

	init();

	function init() {
		startTime = new Date();
		fs.readFile( folderSRTM + fileSRTM, function ( err, data ) {
			if ( err ) throw err;
console.log( 'Read', fileSRTM, data );
			processSRTM( fileSRTM, data );
		});
	}

	function processSRTM( fileSRTM, imageData ) {
		var png = new PNG({
			width: lrX - ulX,
			height: lrY - ulY,
			filterType: 4
		});
		var pngData = png.data, len = png.data.length;
console.log( 'proc', png.width, png.height, len, png.data );
		var elevation;
		var Y = ulY;
		var index = 2 * ( 4800 * Y + ulX);
		var finish = index + 2 * png.width;
		for ( i = 0; i < len; i += 4 ) {
			elevation = ( imageData[ index ] * 256 + imageData[ index + 1] );
			pngData[ i ] = (( elevation & 0xff0000 ) >> 16 );
			pngData[ i + 1 ] = (( elevation & 0x00ff00 ) >> 8 );
			pngData[ i + 2 ] = elevation & 0x0000ff;
			pngData[ i + 3 ] = 255;
			index += 2;
			if ( index >= finish ) {
				index = 2 * ( 4800 * Y + ulX );
				finish = index + 2 * png.width;
console.log( Y++, index, finish );
			}
		}
		png.pack().pipe( fs.createWriteStream(  fileSRTM.slice( 0, -5 ) + '.png' ) );
	}