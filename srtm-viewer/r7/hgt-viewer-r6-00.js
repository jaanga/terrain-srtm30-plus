
	var appTitle = document.title
	var folderSource = '../../srtm/';
	var fileList = 'srtm30-plus-files-list.txt';
	var fileSelected = 'N37W123.hgt';
//	var fileWidth, fileHeight;

	var frequency1 = 0.001, 
	frequency2 = 0.001, 
	frequency3 = 0.001, 
	phase1 = 0, 
	phase2 = 2, // 2 * Math.PI / 3, 
	phase3 = 4, // 4 * Math.PI / 3 , 
	center = 128; //255 / 2, 
	amplitude = 127; // / 2;
	var sin = function( n ) { return Math.sin( n ); };

	var startTime; 
	var canvas;
	var context;
	var elevations;
	var files;
	var imageDataData;
var container;
	init();

	function init() {

		addCSS();
		addMenu();
		addHelp();

		container = document.body.appendChild( document.createElement( 'div' ) );
		container.style.cssText = 'border: 0px red solid; height: ' + ( window.innerHeight - 10 ) + 'px; overflow: auto; width: ' +
			( window.innerWidth - 10 ) + 'px; ';
		canvas = container.appendChild( document.createElement( 'canvas' ) );
		canvas.width = canvas.height = 1201;
		canvas.onmousemove = onMMove;
		canvas.style.cssText = 'border: 1px solid black; ';
		context = canvas.getContext( '2d' );

		requestHGTFile( folderSource + files[ selHGT.selectedIndex ] );
	}

	function requestHGTFile( fname ) {
		startTime = new Date();
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.responseType = "arraybuffer";
		xmlHttp.open( 'GET', fname, true );
		xmlHttp.send( null );
		xmlHttp.onload = function() { parseData( xmlHttp.response, fname ); } ;
	}

	function parseData( arrayBuffer, fname) {
		if ( fname.substr( folderSource.length, 4 ) === 'ferr' ) {
			canvas.width = canvas.height = 1201;
		} else if ( fname.substr( folderSource.length, 4 ) === 'usgs' ) {
			canvas.width = canvas.height = 3601;
		} else {
			canvas.width = 4800;
			canvas.height = 6000;
		}

		var byteArray = new Uint8Array( arrayBuffer );
		var imageData = context.createImageData( canvas.width, canvas.height );
		var imageDataData = imageData.data;
		var i, len = imageDataData.length;
		var elevation;
		var index = 0;

		if ( inpPretty.checked === true ) {
			for ( i = 0; i < len; i++ ) {
				//elevation = byteArray[ index++ ] * 256 + byteArray[ index++ ];
				elevation = ( (byteArray[ index++ ] << 8) + byteArray[ index++ ] );
				imageDataData[ i++ ] = sin( frequency1 * elevation + phase1 ) * amplitude + center;
				imageDataData[ i++ ] = sin( frequency2 * elevation + phase2 ) * amplitude + center;
				imageDataData[ i++ ] = sin( frequency3 * elevation + phase3 ) * amplitude + center;
				imageDataData[ i ] = 255;
			}
		} else if ( inpPrettyMistake.checked === true ) {
			for ( i = 0; i < len; i++ ) {
				//elevation = byteArray[ index++ ] * 256 + byteArray[ index++ ];
				elevation = ( (byteArray[ index++ ] << 8) + byteArray[ index++ ] );
				imageDataData[ i++ ] = elevation & 0x0000ff;
				imageDataData[ i++ ] = (( elevation & 0x00ff00) >> 8);
				imageDataData[ i++ ] = ((elevation & 0xff0000) >> 16);
				imageDataData[ i ] = 255;
			}
		} else {
			for ( i = 0; i < len; i++ ) {
				// elevation = byteArray[ index++ ] * 256 + byteArray[ index++ ];
				elevation = ( (byteArray[ index++ ] << 8) + byteArray[ index++ ] );
				imageDataData[ i++ ] = (( elevation & 0xff0000 ) >> 16 );
				imageDataData[ i++ ] = (( elevation & 0x00ff00 ) >> 8 );
				imageDataData[ i++ ] = elevation & 0x0000ff;
				imageDataData[ i ] = 255;
			}
		}

		context.putImageData( imageData, 0, 0 );

// Following is for testing and verification
// 'elevations' records the data read from the source files. 
// Used to check if the height maps elevations and source agree
		elevations = [];
		len = byteArray.length;
		index = 0;
		for ( i = 0; i < len; ) {
			elevations.push( byteArray[ i++ ] * 256 + byteArray[ i++ ] );
		}

console.log( 'Load time in ms: ', new Date() - startTime );
	}

	function checkData() {
		var len = elevations.length;
		var exceptions = 0;
		var max = 0;
		var min = 0;
		var elevation;
		for (var i = 0;  i < len; i++) {
			elevation = elevations[ i ];
			if ( elevation < -11034 || elevation > 8848 ) {
//				imageDataData[ i * 4] = imageDataData[ i * 4 + 1] = imageDataData[ i * 4 + 2] = imageDataData[ i * 4 + 3] = 255;
				exceptions++;
			}
			min = ( elevation < min && elevation > -32768 ) ? elevation : min;
			max = ( elevation > max ) ? elevation : max;
		}
		msg.innerHTML = len + ' items read<br>Exceptions: ' + exceptions + '<br>' +
			'Minimum elevation: ' + min + '<br>' +
			'Maximum elevation: ' + max + '<br>';
	}

	function onMMove( e ) {
		if ( !elevations ) return;

		var x = e.offsetX;
		var y = e.offsetY;
		var p = context.getImageData( x, y, 1, 1).data;
/*
		var r,g,b;
		var hex;
		r = p[0];
		g = p[1];
		b = p[2];
		var indexHex = (r << 16) + (g << 8) + b;
		if (r & 0x80) { // if the 'red' has the sign bit, then
			indexHex += 255 << 24;
		}
		hex = rgbToHex(r,g,b).toUpperCase();
*/

		var indexHGT = canvas.width * y + x;
		var elevHGT = ( elevations[ indexHGT ] < 32768 ) ? elevations[ indexHGT ] : -(65536 - elevations[ indexHGT ]);

		var hex = rgbToHex( p[0], p[1], p[2] ).toUpperCase();
		var indexHtMap = parseInt( '0x'  + hex, 16);
		var elevHtMap = ( indexHtMap < 32768 ) ? indexHtMap : -(65536 - indexHtMap );

		msg.innerHTML =  
			'x:' + x + ' y:' + y + '<br>rgb:' + p[0] + ' ' +  p[1] + ' ' + p[2]  + '<br>' +
			'hex: #' + hex + ' raw HtMap:' + indexHtMap + '<br>' +
			'index HGT: ' + indexHGT + '<br>' +
			'elevation HGT:' + elevHGT + ' htMap:' + elevHtMap;
		swatch.style.backgroundColor = '#' + hex;
	}

	function rgbToHex(r, g, b) {
		var str = ( r * 65536 + g * 256 + b ).toString( 16 );
		str = ( '000000' + str ).slice(-6); 
		return str;
	}

	function addCSS() {
		var css = document.body.appendChild( document.createElement('style') );
		css.innerHTML = 'body { font: 600 12pt monospace; margin: 5px; overflow: hide; }' +
			'h1 { margin: 0; }' +
			'h1 a {text-decoration: none; }' +
			'#closer { position: absolute; right: 5px; top: 5px; }' +
			'#movable { overflow: auto; margin: 10px; padding: 10px 20px; position: absolute; }' +
		'';
	}

	function addMenu() {
		var menu = document.body.appendChild( document.createElement( 'div' ) );
		menu.id = 'movable';
		menu.style.cssText = ' background-color: #ccc; left: 10px; opacity: 0.8; top: 10px; width: 330px; ';
		menu.addEventListener( 'mousedown', mouseMove, false );
		menu.innerHTML = '<div onclick=menu.style.display="none"; >[x]</div>' +
			'<h1>' +
				'<a href="" >' + appTitle + '</a> ' +
				'<a href=# id=aHelp title="Get help and info" onclick=help.style.display="block"; >&#x24D8;</a>' +
			'</h1>' +
			'<p>' +
				'Select HGT: <select id=selHGT title="Select a different view to view" ><select><br>' +
				'Pretty colors: <input id=inpPretty type=checkbox title="display a continuous range of colors" ><br>' +
				'Pretty mistake: <input id=inpPrettyMistake type=checkbox title="BGR instead of RGB" ><br>' +
				'<input type=button onclick=checkData() value="Check data" title="Highlight any data < 0 or > 8488" ><br>' +
				'<input type=button onclick=saveIt(); value="Save as PNG" >' +
			'</p>' +
			'<hr>' +
			'<div id=swatch >' +
				'Color' +
			'</div>' +
			'<div id=msg>x: y: <br>rgb:<br>hex:<br>elevation:<br></div>' +
		'';

		inpPretty.onchange = function() { requestHGTFile( folderSource + files[ selHGT.selectedIndex ] ); };
		inpPrettyMistake.onchange = function() { requestHGTFile( folderSource + files[ selHGT.selectedIndex ] ); };

		var data = requestFile( folderSource + fileList );
		files = data.split(/\r\n|\n/);
		var fileName, selectedIndex = 0;
		for (var option, i = 0; i < files.length; i++) {
			option = document.createElement( 'option' );
			fileName = files[i].substr( files[i].lastIndexOf('/') + 1);
			option.innerText = fileName;
			selHGT.appendChild( option );
			selectedIndex = ( fileName === fileSelected && files[i].substr( 0, 4 ) === 'ferr') ? i : selectedIndex ;
		}
		selHGT.onchange = function() { requestHGTFile( folderSource + files[ selHGT.selectedIndex ] ); };
		selHGT.selectedIndex = selectedIndex;

		window.addEventListener('mouseup', mouseUp, false);
	}

	function addHelp() {
		help = document.body.appendChild( document.createElement( 'div' ) );
		help.style.cssText = 'display: none; background-color: #ccc; left: 50px; opacity: 0.9; padding: 20px; ' +
			'bottom: 0; left: 0; height: 370px; margin: auto; position: absolute; right: 0; top: 0; width: 500px; zIndex:10; ';
		help.innerHTML =
			'<div onclick=help.style.display="none"; >' +
				'<h3>' + appTitle + '</h3>' +
				'<h4>Features include the following:</h4>' +
				'<ul>' +
					'<li>View any of the data sample HGT/SRTM files</li>' +
					'<li>Humans can choose to see pretty colors</li>' +
					'<li>Verifies data goes from HGT/SRTM file to heightmap and back to data</li>' +
					'<li>Inspect the HGT/SRTM file for outliers</li>' +
					'<li>Save file as PNG</li>' +
				'</ul>' +
				'<a href="https://github.com/jaanga/terrain-plus/tree/gh-pages/cookbook/hgt-viewer/" target="_blank">Source code</a><br>' +
				'<a href="http://jaanga.github.io" target="_blank">jaanga</a><br>' +
				'copyright &copy; 2014 Jaanga authors ~ MIT license</small><br><br>' +
				'<i>Click anywhere in this message to hide...</i>' +
		'</div>';
		aHelp.style.cssText += 'text-decoration: none; ';
		aHelp.title = 'Get help and information';
	}

// events
	function mouseUp() {
		window.removeEventListener('mousemove', divMove, true);
	}

	function mouseMove( event ){
		if ( event.target.id === 'movable' ) {
			event.preventDefault();

			offsetX = event.clientX - event.target.offsetLeft;
			offsetY = event.clientY - event.target.offsetTop;
			window.addEventListener('mousemove', divMove, true);
		}
	}

	function divMove( event ){
		event.target.style.left = ( event.clientX - offsetX ) + 'px';
		event.target.style.top = ( event.clientY - offsetY ) + 'px';
	}

	function saveIt() {
		canvas.toBlob( function(blob) {
			saveAs( blob, files[ selHGT.selectedIndex ].replace('.hgt','') + '.png' );
		});
		console.log('saving...' ); 
	}

	function requestFile( fname ) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.crossOrigin = "Anonymous"; 
		xmlHttp.open( 'GET', fname, false );
		xmlHttp.send( null );
		return xmlHttp.responseText;
	}