// ftp://topex.ucsd.edu/pub/srtm30_plus/README.V10.txt

	fileName = 'c:/temp/topo30/topo30';
//	fileName = './topo30';
//	fileName = 'http://caper.ws/terrain-srtm30-plus/topo30/topo30';

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
	var changes;
	var startTime;

	var currentRow;
	var elevations;

	scaleBase = 0.0015;

	var renderer, scene, camera, controls, mesh;

	function init () {

		divMsg1.innerHTML =
			'Latitude <input type=range id=selLat min=-90 max=90 value=' + latDefault +
					' style=width:256px; onchange=outLat.value=this.value;updateParameters(); /> ' +
				'<input type=number id=outLat value=' + latDefault + ' onchange=selLat.value=this.value;updateParameters(); class=number /><br>' +

			'Longitude <input type=range id=selLon min=-180 max=180 value=' + lonDefault +
					' onchange=outLon.value=this.value;updateParameters(); style=width:245px; /> ' +
				'<input type=number id=outLon value=' + lonDefault + ' onchange=selLon.value=this.value;updateParameters(); class=number /><br>' +

			'Move 1 degree:' +
			'<button onclick=outLat.value=selLat.value=parseInt(selLat.value,10)+1;console.log(selLat.value);updateParameters(); >North</button> ' +
			'<button onclick=selLon.value=parseInt(selLon.value,10)+1;console.log(selLat.value);updateParameters(); >East</button> ' +
			'<button onclick=selLat.value=parseInt(selLat.value,10)-1;console.log(selLat.value);updateParameters(); >South</button> ' +
			'<button onclick=selLon.value=parseInt(selLon.value,10)-1;console.log(selLat.value);updateParameters(); >West</button> ' +
			'Vertical scale: <input id=scaleStretch type=number value=10 onchange=;updateParameters(); class=number >' +
			'<hr>' +
			'<div id=msg1></div>' +
			'<div id=msg2></div>' +
		'';

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
		changes = 0;

		lon = selLon.value || lonDefault;
		lat = selLat.value || latDefult;

		startColumn = lon < 0 ? 120 * lon : 120 * lon;
		startRow = lat < 0 ? 10800 - 120 * lat : 10800 - 120 * lat;

		finishRow = startRow + cropRows - 1;
		finishColumn = startColumn + cropColumns;

		currentRow = startRow;
		elevations = [];

		requestRow( startRow );

// console.log( 'lon', lon, startColumn, finishColumn, ' lat', lat, startRow, finishRow );
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

			}

			if ( currentRow++ < finishRow ) {
				requestRow( currentRow );
			} else {
				updatePlane();
			}

		} else {

			msg1.innerHTML = 'file:' + fileName + '<br>' +
				'state changes:' + ( ++changes ) + ' state:' + xmlHttp.readyState + ' ' +
				'status:' + xmlHttp.status + ' ' +
				'text:' + xmlHttp.statusText +
			'';

		}

	}

	function updatePlane() {
		geometry = new THREE.PlaneGeometry( 200, 200, cropColumns - 1, cropRows - 1 );
		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( 0.5 * Math.PI ) );
		verts = geometry.vertices;

		var scale = scaleBase * parseInt(scaleStretch.value, 10 ); 
		for (var i = 0, len = elevations.length; i < len; i++) {
			verts[ i ].y = scale * (  elevations[i] ) ;
		}

		geometry.computeFaceNormals();
		geometry.computeVertexNormals();

		if ( mesh ) { scene.remove( mesh ); }

		var material = new THREE.MeshNormalMaterial( { shading: THREE.SmoothShading, side: 2 } );

		mesh = new THREE.Mesh( geometry, material );
		mesh.scale.z = -1;

		scene.add( mesh );

		msg2.innerHTML =  'Load time in ms: ' + ( new Date() - startTime );
	}

	function animate() {
		requestAnimationFrame( animate );
		controls.update();
		renderer.render( scene, camera );
	}