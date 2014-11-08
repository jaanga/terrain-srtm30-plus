
	var dirName = 'C:/temp/srtm30-plus-v10/';
	var count = 0;

	function init () {
		fileNames = ['e020n40.Bathymetry.srtm','e020n90.Bathymetry.srtm','e020s10.Bathymetry.srtm','e060n40.Bathymetry.srtm','e060n90.Bathymetry.srtm','e060s10.Bathymetry.srtm','e060s60.Bathymetry.srtm','e100n40.Bathymetry.srtm','e100n90.Bathymetry.srtm','e100s10.Bathymetry.srtm','e120s60.Bathymetry.srtm','e140n40.Bathymetry.srtm','e140n90.Bathymetry.srtm','e140s10.Bathymetry.srtm','w000s60.Bathymetry.srtm','w020n40.Bathymetry.srtm','w020n90.Bathymetry.srtm','w020s10.Bathymetry.srtm','w060n40.Bathymetry.srtm','w060n90.Bathymetry.srtm','w060s10.Bathymetry.srtm','w060s60.Bathymetry.srtm','w100n40.Bathymetry.srtm','w100n90.Bathymetry.srtm','w100s10.Bathymetry.srtm','w120s60.Bathymetry.srtm','w140n40.Bathymetry.srtm','w140n90.Bathymetry.srtm','w140s10.Bathymetry.srtm','w180n40.Bathymetry.srtm','w180n90.Bathymetry.srtm','w180s10.Bathymetry.srtm','w180s60.Bathymetry.srtm'];

		divMsg1.innerHTML = 
			'Select File <select id=selFile></select><br>' +
			'Offset X <input type=range id=offsetX min=0 max=4800 value=150 style=width:256px; /><br>' +
			'Offset Y <input type=range id=offsetY min=0 max=6000 value=190 style=width:256px; /><br>' +
			'<button onclick=requestSRTMFile(fileNames[selFile.selectedIndex]); >Load Data</button>';

		for ( var i = 0, len = fileNames.length; i < len; i++) {
			opt = selFile.appendChild( document.createElement( 'option' ) );
			opt.text = fileNames[i];
		}

		canvasDestination = JA.menu.appendChild( document.createElement( 'canvas' ) );
		canvasDestination.width = canvasDestination.height = 256;
		contextDestination = canvasDestination.getContext( '2d' );

//		canvasSource = JA.menu.appendChild( document.createElement( 'canvas' ) );
		canvasSource = document.createElement( 'canvas' );
		canvasSource.width = 4800;
		canvasSource.height = 6000;
		contextSource = canvasSource.getContext( '2d' );

	}

	function requestSRTMFile( fileName ) {

		startTime = new Date();
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.responseType = "arraybuffer";
		xmlHttp.open( 'GET', dirName + fileName, true );
		xmlHttp.onreadystatechange = readyStateChange;
		xmlHttp.send( null );
		xmlHttp.onload = function () { parseData( xmlHttp.response, fileName ); } ;

	}

	function readyStateChange() {
		divMsg2.innerHTML = ++count;
	}

	function parseData( arrayBuffer, fname ) {
		divMsg3.innerHTML = fname;

		var byteArray = new Uint8Array( arrayBuffer );
		var imageData = contextSource.createImageData( canvasSource.width, canvasSource.height );
		var imageDataData = imageData.data;
		var len = imageDataData.length;
		var elevation;
		var index = 0;

		for ( var i = 0; i < len; i += 4 ) {
			elevation = byteArray[ index ] * 256 + byteArray[ index + 1 ];
//				elevation = ( (byteArray[ index ] << 8) + byteArray[ index + 1 ] );
			index += 2;
			imageDataData[ i + 2] = (( elevation & 0xff0000 ) >> 16 );
			imageDataData[ i + 1 ] = (( elevation & 0x00ff00 ) >> 8 );
			imageDataData[ i + 0 ] = elevation & 0x0000ff;
			imageDataData[ i + 3 ] = 255;
		}

		contextSource.putImageData( imageData, - offsetX.value, - offsetY.value, offsetX.value, offsetY.value, 255, 255 );

		imageData = contextSource.getImageData( 0, 0, 255, 255 );
		contextDestination.putImageData( imageData, 0, 0 );

		console.log( 'Load time in ms: ', new Date() - startTime );
	}