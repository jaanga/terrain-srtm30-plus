
	var fileName = 'C:/temp/srtm30-plus-v10/e020n40.Bathymetry.srtm';
	var count = 0;
	var canvas;

	function init () {
		console.log( 'hello' );

//		container = JA.menu.appendChild( document.createElement( 'div' ) );
//		container.style.cssText = 'border: 1px red solid; height: 300px; overflow: auto; width: 300px; ';



		divMsg1.innerHTML = '<button onclick=requestSRTMFile(fileName) >Load Data</button>';

	}


	function requestSRTMFile( fileName ) {

		startTime = new Date();
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.responseType = "arraybuffer";
		xmlHttp.open( 'GET', fileName, true );
		xmlHttp.onreadystatechange = readyStateChange;
		xmlHttp.send( null );
		xmlHttp.onload = function () { parseData( xmlHttp.response, fileName ); } ;

	}

	function readyStateChange() {
		divMsg2.innerHTML = ++count;
	}

	function parseData( arrayBuffer, fname ) {
		divMsg3.innerHTML = fname;

//		canvas = JA.menu.appendChild( document.createElement( 'canvas' ) );

		canvasSource = document.createElement( 'canvas' ) );
//		canvas.width = canvas.height = 256;
//		canvas.onmousemove = onMMove;
		canvasSource.style.cssText = 'border: 1px solid black; ';
		context = canvasSource.getContext( '2d' );

		canvas.width = 4800;
		canvas.height = 6000;

		var byteArray = new Uint8Array( arrayBuffer );
		var imageData = context.createImageData( canvas.width, canvas.height );
		var imageDataData = imageData.data;
		var i, len = imageDataData.length;
		var elevation;
		var index = 0;

		for ( i = 0; i < len; i += 4 ) {
			elevation = byteArray[ index ] * 256 + byteArray[ index + 1 ];
//				elevation = ( (byteArray[ index ] << 8) + byteArray[ index + 1 ] );
			index += 2;
			imageDataData[ i ] = (( elevation & 0xff0000 ) >> 16 );
			imageDataData[ i + 1 ] = (( elevation & 0x00ff00 ) >> 8 );
			imageDataData[ i + 2 ] = elevation & 0x0000ff;
			imageDataData[ i + 3 ] = 255;
		}

		context.putImageData( imageData, -100, -100, 100, 100, 355, 355 );

		console.log( 'Load time in ms: ', new Date() - startTime );
	}