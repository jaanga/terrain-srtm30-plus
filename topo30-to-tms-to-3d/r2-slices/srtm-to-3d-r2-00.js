// ftp://topex.ucsd.edu/pub/srtm30_plus/README.V10.txt

	fileName = 'c:/temp/topo30';
//	fileName = 'http://caper.ws:/terrain-srtm30-plus/topo30/topo30';

	var latDefault = 39;
	var lonDefault = -123;

	var cropRows = 240;
	var cropColumns = 240; 

	var startRow = 12000;
	var startColumn = 10000;

	var finishRow = startRow + cropRows - 1;
	var finishColumn = startColumn + cropColumns;

	var dataColumns = 2 * 43200;
	var dataRows = 21600;

	var xmlHttp;
	var changes = 0;
	var startTime = new Date();
	var items = '';
	var currentRow = startRow;
	var elevations = [];

	var imageData;
	var imageDataData;

//	var dirName = 'C:/temp/srtm30-plus-v10/';
	var count = 0;
	scale = 0.015;

	var renderer, scene, camera, controls, mesh;

	function init () {

		fileNames = ['e020n40.Bathymetry.srtm','e020n90.Bathymetry.srtm','e020s10.Bathymetry.srtm','e060n40.Bathymetry.srtm','e060n90.Bathymetry.srtm','e060s10.Bathymetry.srtm','e060s60.Bathymetry.srtm','e100n40.Bathymetry.srtm','e100n90.Bathymetry.srtm','e100s10.Bathymetry.srtm','e120s60.Bathymetry.srtm','e140n40.Bathymetry.srtm','e140n90.Bathymetry.srtm','e140s10.Bathymetry.srtm','w000s60.Bathymetry.srtm','w020n40.Bathymetry.srtm','w020n90.Bathymetry.srtm','w020s10.Bathymetry.srtm','w060n40.Bathymetry.srtm','w060n90.Bathymetry.srtm','w060s10.Bathymetry.srtm','w060s60.Bathymetry.srtm','w100n40.Bathymetry.srtm','w100n90.Bathymetry.srtm','w100s10.Bathymetry.srtm','w120s60.Bathymetry.srtm','w140n40.Bathymetry.srtm','w140n90.Bathymetry.srtm','w140s10.Bathymetry.srtm','w180n40.Bathymetry.srtm','w180n90.Bathymetry.srtm','w180s10.Bathymetry.srtm','w180s60.Bathymetry.srtm'];

		divMsg1.innerHTML = 
//			'Select File <select id=selFile></select><br>' +
			'Latitude <input type=range id=selLat min=-90 max=90 value=' + latDefault + 
					' style=width:256px; onchange=updateParameters();outLat.value=this.value; />' +
				'<output id=outLat >' + latDefault + '</output>' + '<br>' +


			'Longitude <input type=range id=selLon min=-180 max=180 value=' + lonDefault + 
					' style=width:256px; onchange=updateParameters();outLon.value=this.value; /> ' +
				'<output id=outLon >' + lonDefault + '</output>' + '<br>' +

			'<button onclick=outLat.value=selLat.value=parseInt(selLat.value,10)+1;console.log(selLat.value);updateParameters(); >up</button> ' +
			'<button onclick=selLat.value=parseInt(selLat.value,10)-1;console.log(selLat.value);updateParameters(); >down</button> ' +
			'<button onclick=selLon.value=parseInt(selLon.value,10)-1;console.log(selLat.value);updateParameters(); >Left</button> ' +
			'<button onclick=selLon.value=parseInt(selLon.value,10)+1;console.log(selLat.value);updateParameters(); >Right</button> ' +
//			'<button onclick=requestSRTMFile(fileNames[selFile.selectedIndex]); >Load Data</button>'
			'<div id=msg1></div>' +
			'<div id=msg2></div>' +
		'';

//		for ( var i = 0, len = fileNames.length; i < len; i++) {
//			opt = selFile.appendChild( document.createElement( 'option' ) );
//			opt.text = fileNames[i];
//		}

		canvasDestination = JA.menu.appendChild( document.createElement( 'canvas' ) );
		canvasDestination.width = canvasDestination.height = 256;
		contextDestination = canvasDestination.getContext( '2d' );

//		canvasSource = JA.menu.appendChild( document.createElement( 'canvas' ) );
		canvasSource = document.createElement( 'canvas' );
		canvasSource.width = cropColumns;
		canvasSource.height = cropRows;
		contextSource = canvasSource.getContext( '2d' );

		imageData = contextSource.createImageData( canvasSource.width, canvasSource.height );
		imageDataData = imageData.data;

		renderer = new THREE.WebGLRenderer( { alpha: 1, antialias: true, clearColor: 0xffffff }  );
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );
		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
		camera.position.set( 0, 150, 200 );
		controls = new THREE.TrackballControls( camera, renderer.domElement );

		var geometry = new THREE.PlaneGeometry( 200, 200 );
		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( -0.5 * Math.PI ) );
		var material = new THREE.MeshBasicMaterial( { color: 0x0000ff, opacity: 0.5, side: 2, transparent: true } );
		var mesh = new THREE.Mesh( geometry, material );
		scene.add( mesh );

		updateParameters();

	}

	function updateParameters() {
		lon = selLon.value || lonDefault;
		lat = selLat.value || latDefult;

		startColumn = lon < 0 ? 120 * lon : 120 * lon;
		startRow = lat < 0 ? 10800 - 120 * lat : 10800 - 120 * lat;

		finishRow = startRow + cropRows - 1;
		finishColumn = startColumn + cropColumns;

		currentRow = startRow;
		elevations = [];

		requestRow( startRow );

// console.log( 'lon', lon, startColumn, finishColumn, ' lat', lat, startRow, finishRow )
	}


	function requestRow( row ) {

			startByte = row * dataColumns + 2 * startColumn;
			finishByte = startByte + 2 * cropColumns - 1;
			requestSRTMFile( fileName, startByte, finishByte );

	}

	function requestSRTMFile( fileName, startByte, finishByte ) {
//console.log( fileName, startByte, finishByte );
		startTime = new Date();
		xmlHttp = new XMLHttpRequest();
		xmlHttp.responseType = "arraybuffer";
		xmlHttp.open( 'GET', fileName, true );
		xmlHttp.onreadystatechange = parseData;
		xmlHttp.setRequestHeader('Range', 'bytes=' + startByte + '-' + finishByte );
		xmlHttp.send( null );
//		xmlHttp.onload = function () { parseData( xmlHttp.response, fileName ); } ;
	}

	function parseData () {

		if ( xmlHttp.readyState == 4  ) {
			byteArray = new Uint8Array( xmlHttp.response );

			var index = 0;
			var items = '';
			for ( var i = 0, column = startColumn; column < finishColumn; column++ ) {

				elevation = byteArray[ index++ ] * 256 + byteArray[ index++ ];
				elevation = ( elevation < 32767 ) ? elevation : -( 65536 - elevation );
				items += elevation + ' ';
				elevations.push( elevation );
/*
				imageDataData[ i + 2 ] = (( elevation & 0xff0000 ) >> 16 );
				imageDataData[ i + 1 ] = (( elevation & 0x00ff00 ) >> 8 );
				imageDataData[ i + 0 ] = elevation & 0x0000ff;
				imageDataData[ i + 3 ] = 255;
				i +4;
*/

			}
/*
		contextSource.putImageData( imageData, - offsetX.value, - offsetY.value, offsetX.value, offsetY.value, 255, 255 );

		imageData = contextSource.getImageData( 1, 1, 256, 256 );
		contextDestination.putImageData( imageData, 0, 0, 0, 0, 256, 256);

		var pix = imageData.data;

		var geometry = new THREE.PlaneGeometry( 200, 200, 255, 255 );
		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( 0.7 * Math.PI ) );
		var verts = geometry.vertices;
		var material = new THREE.MeshNormalMaterial( { shading: THREE.SmoothShading, side: 2 } );
//		scale = 0.01 * scale;
		min = 0; max = 0;

		for (var i = 0, j = 0, len = pix.length; i < len; i += 4) {

			elev = pix[i] + 256 * pix[i + 1] + 256 * 256 *  pix[i + 2];

			elev = ( elev < 32767 ) ? elev : -( 65536 - elev );
			elev = ( elev > 6000 || elev < -8000 ) ? 0 : elev ;
			max = elev > max ? elev : max;
			min = elev < min ? elev : min;
			verts[ j++ ].y = scale * (  elev ) ;
		}
*/




//			msg2.innerHTML += 'item count:' + byteArray.length + ' time(ms):' + ( new Date() - startTime) + 
//				'<br>items:' + items + 
			'<br><br>';

			if ( currentRow++ < finishRow ) {
				requestRow( currentRow );
			} else {
				updatePlane();
			}
			

		} else {

			msg1.innerHTML = fileName + ' readystate changes:' + ++changes + ' readyState ' + xmlHttp.readyState + '<br>' +
				'status:' + xmlHttp.status + ' ' +
				'statusText:' + xmlHttp.statusText + 
			'';

		}

	}

	function updatePlane() {
		geometry = new THREE.PlaneGeometry( 200, 200, cropColumns - 1, cropRows - 1 );
		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( 0.5 * Math.PI ) );
		verts = geometry.vertices;
		var material = new THREE.MeshNormalMaterial( { shading: THREE.SmoothShading, side: 2 } );

		for (var i = 0, len = elevations.length; i < len; i++) {
			verts[ i ].y = scale * (  elevations[i] ) ;
		}

// console.log( max, min );

		if ( mesh ) { scene.remove( mesh ); }

		mesh = new THREE.Mesh( geometry, material );
		mesh.scale.z = -1;

		mesh.geometry.computeFaceNormals();
		mesh.geometry.computeVertexNormals();
		scene.add( mesh );

		console.log( 'Load time in ms: ', new Date() - startTime );
	}

/*
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
			imageDataData[ i + 2 ] = (( elevation & 0xff0000 ) >> 16 );
			imageDataData[ i + 1 ] = (( elevation & 0x00ff00 ) >> 8 );
			imageDataData[ i + 0 ] = elevation & 0x0000ff;
			imageDataData[ i + 3 ] = 255;
		}

		contextSource.putImageData( imageData, - offsetX.value, - offsetY.value, offsetX.value, offsetY.value, 255, 255 );

		imageData = contextSource.getImageData( 1, 1, 256, 256 );
		contextDestination.putImageData( imageData, 0, 0, 0, 0, 256, 256);

		var pix = imageData.data;

		var geometry = new THREE.PlaneGeometry( 200, 200, 255, 255 );
		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( 0.7 * Math.PI ) );
		var verts = geometry.vertices;
		var material = new THREE.MeshNormalMaterial( { shading: THREE.SmoothShading, side: 2 } );
//		scale = 0.01 * scale;
		min = 0; max = 0;

		for (var i = 0, j = 0, len = pix.length; i < len; i += 4) {

			elev = pix[i] + 256 * pix[i + 1] + 256 * 256 *  pix[i + 2];

			elev = ( elev < 32767 ) ? elev : -( 65536 - elev );
			elev = ( elev > 6000 || elev < -8000 ) ? 0 : elev ;
			max = elev > max ? elev : max;
			min = elev < min ? elev : min;
			verts[ j++ ].y = scale * (  elev ) ;
		}

console.log( max, min );

		if ( mesh ) { scene.remove( mesh ); }

		mesh = new THREE.Mesh( geometry, material );
		mesh.scale.z = -1.25;

		mesh.geometry.computeFaceNormals();
		mesh.geometry.computeVertexNormals();
		scene.add( mesh );

		console.log( 'Load time in ms: ', new Date() - startTime );
	}

*/

	function animate() {
		requestAnimationFrame( animate );
		controls.update();
		renderer.render( scene, camera );
	}