	var pngFolder
	var pngFiles;
	var pngStart

	var menu;
	var fileName = '../../../terrain-plus/gazetteer/places-2000.csv';

	var gazetteer;

	var image;
	var canvas, context;
	var colors;

	var pi = Math.PI;


	function init() {
//		var hashes = location.hash.split('#');
//		xTile = ( hashes[1] !== undefined ) ? hashes[1] : xTile;

/*
		var data = requestFile( fileName );
		var lines = data.split(/\r\n|\n/);
		gazetteer = [];
		for ( var i = 1, length = lines.length - 1; i < length; i++ ) {
			gazetteer.push( lines[i].split( ';' ) );
		}
*/

		var css = document.body.appendChild( document.createElement('style') );
		css.innerHTML = 'body { font: 600 12pt monospace; margin: 0; }' +
			'h1 a {text-decoration: none; }' +
		'';

		menu = document.body.appendChild( document.createElement( 'div' ) );
		menu.id = 'movable';
		menu.style.cssText = ' background-color: #ccc; left: 20px; opacity:0.8; padding: 10px; position: absolute; top: 20px;';
		menu.addEventListener( 'mousedown', mouseMove, false );
		menu.innerHTML = '<div onclick=info.style.display="none"; >[x]</div>' +
			'<h1>' +
				'<a href="" >' + document.title + '</a> ' +
				'<a href=# id=aHelp title="Get help and info" onclick=help.style.display="block"; >&#x24D8;</a>' +
			'</h1>' +
			'<div>' +
//				'X tile: <input type=number min=0 max=127 value=' + xTile + ' onchange=xTile=parseInt(this.value,10);getImage(); ><br>' +
//				'Y tile: <input type=number min=0 max=127 value=' + yTile + ' onchange=yTile=parseInt(this.value,10);getImage(); ><br>' +
			'</div>' +
			'<select id=selPNG onchange=getImage() title="Choose one of ' + pngFiles.length + ' places" ></select>' +
			'<hr>' +
//			'<div id=help onclick=help.style.display="none";></div>' +
//			'<div id=info></div>' +
//			'<div id=shades></div>' +
//			'<div id=actions></div>' +
			'<div id=swatch >' +
				'Color' +
			'</div>' +
			'<div id=msg>x: y: <br>rgb:<br>hex:<br>elevation:<br></div>' +
		'';

		addHelp();

		for ( var i = 0, len = pngFiles.length; i < len; i++ ) {
			selPNG.appendChild( document.createElement( 'option' ) );
			selPNG.children[i].text = pngFiles[i][0];
			selPNG.children[ i ].title = pngFiles[i][1];
		}
		selPNG.selectedIndex = pngStart;

		image = new Image();

		container = document.body.appendChild( document.createElement( 'div' ) );
		container.style.cssText = 'border: 0px red solid; height: ' + ( window.innerHeight - 10 ) + 'px; overflow: auto; width: ' +
			( window.innerWidth - 10 ) + 'px; ';
		canvas = container.appendChild( document.createElement( 'canvas' ) );
//		canvas = document.body.appendChild( document.createElement( 'canvas' ) );
		canvas.onmousemove = onMMove;
		context = canvas.getContext( '2d' );

		window.addEventListener('mouseup', mouseUp, false);

		getImage();
	}


	function addHelp() {
		help = document.body.appendChild( document.createElement( 'div' ) );
		help.style.cssText = 'display: none; background-color: #ccc; left: 50px; opacity: 0.9; padding: 20px; ' +
			'bottom: 0; left: 0; height: 370px; margin: auto; position: absolute; right: 0; top: 0; width: 500px; zIndex:10; ';
		help.innerHTML =
			'<div onclick=help.style.display="none"; >' +
				'<h3>' + document.title + '</h3>' +
				'<p>View the PNG files generated from SRTM30 Plus data </p>' +

/*
				'<h4>Major Issues include the following:</h4>' +
				'<ul>' +
					'<li>Gaps betwen tiles</li>' +
					'<li>Zoom level 7 and lower: elevations not drawn properly & many other issues</li>' +
				'</ul>' +
*/
				'<a href="https://github.com/jaanga/terrain-srtm30-plus/tree/gh-pages/png-viewer/" target="_blank">Source code</a><br>' +
				'<small>credits: <a href="http://threejs.org" target="_blank">three.js</a> - ' +
				'<a href="http://khronos.org/webgl/" target="_blank">webgl</a> - ' +
				'<a href="http://jaanga.github.io" target="_blank">jaanga</a><br>' +
				'copyright &copy; 2014 Jaanga authors ~ MIT license</small><br><br>' +
				'<i>Click anywhere in this message to hide...</i>' +
		'</div>';

		aHelp.style.cssText += 'text-decoration: none; ';
		aHelp.title = 'Get help and information';
		//aHelp.onclick = 'help.style.display="block";';
	}

	function getImage() {
		image.src = pngFolder + selPNG.value + '.Bathymetry.png';
		image.onload = setText;
	}

	function setText() {

		canvas.width = image.width;
		canvas.height =  image.height;

		context.drawImage( image, 0, 0, canvas.width , canvas.height, 0, 0, canvas.width , canvas.height);
		var imgd = context.getImageData( 0, 0, canvas.width , canvas.height ).data;
/*
// combine with lighten function
		colors = [];
		for (var i = 0, j = 0, len = imgd.length; i < len; i += 4) {
			if ( colors.indexOf( imgd[i] ) < 0 ) {
				colors.push( imgd[i] );
			}
		}
// console.log( colors.sort( function(a,b){return a-b} ) );


		var ulLon = -20; //tile2lon( xTile, 7 ).toFixed(3);
		var lrLon = 20; //tile2lon( xTile + 1, 7 ).toFixed(3);
		deltaLon = 40; // Math.abs(tile2lon( xTile, 7 ) - tile2lon( xTile + 1, 7 )).toFixed(3)

		var ulLat = 40; //tile2lat( yTile, 7).toFixed(3);
		var lrLat = -10; // tile2lat( yTile + 1, 7).toFixed(3);
		var deltaLat = 50; // Math.abs(tile2lat( yTile, 7 ) - tile2lat( yTile + 1, 7 )).toFixed(3);

		var places = [];

		for (var i = 0, len = gazetteer.length; i < len; i++) {
			placeX = lon2tile( parseFloat(gazetteer[i][2]), 7 );
			placeY = lat2tile( parseFloat(gazetteer[i][1]), 7);
			if ( xTile === placeX && yTile === placeY ) {
				places.push( gazetteer[i][0] );
				xStart = canvas.width * Math.abs( ulLon - parseFloat(gazetteer[i][2]) ) /  deltaLon;
				yStart = canvas.height * ( ulLat - parseFloat(gazetteer[i][1]) ) /  deltaLat;
				var place = context.getImageData( xStart, yStart, 1, 1 ).data;
				context.lineWidth = 5 ;
				context.strokeStyle = '#ff0000';
				context.strokeRect(  xStart - 5, yStart - 5, 10, 10);
				context.fillStyle = '#ff0000';
				context.font = '12px sans-serif';
				context.fillText( gazetteer[i][0] + ' - altitude: ' + ( place[0] - 1.5 ) * 20, xStart + 15, yStart + 5 );
// console.log( gazetteer[i][0], place[0] );
			}
		}


		var br = '<br>', br2 = br + br;
		var txt = //'Folder: ' + xDir + br2 +

			// ' xTile: ' + xTile + ' yTile: ' + yTile + br2 +

			'UL lon: ' + ulLon + br +
			'LR lon: ' + lrLon + br +
			'delta Lon: ' + deltaLon + br2 +

			'UL lat: ' + ulLat + br +
			'LR lat: ' + lrLat + br +
			'delta Lar: ' + deltaLat + br2 ;

//			'Places: <br>' +
//			'<textarea cols=40 >' + places + '</textarea>' + br;
			info.innerHTML = txt;

			shades.innerHTML =
			'PNG:' + br +
			'width: ' + image.width + br +
			'height: ' + image.height + br +
			'pixels: ' + ( image.width * image.height) + br2 +
//			'Number of shades: ' + colors.length + br +
//			'Min: ' + Array.min( colors ) + br +
//			'Max: ' + Array.max( colors ) + br2 +
			'Shades/heights:<br>' +
//			'<div id=swatch style=color:white;height=40px; >&nbsp;</div>' +

			'<div id=swatch >' +
				'Color' +
			'</div>' +
			'<div id=msg>x: y: <br>rgb:<br>hex:<br>elevation:<br></div>' +

//			'<a href=JavaScript:lighten(); >Lighten</a>' + br2 ;
//			actions.innerHTML =
//			'<a href=JavaScript:link(); >Permalink</a>' + br +
//			'<a href="http://jaanga.github.io/terrain-viewer/hello-world/r1/hello-world.html#terrain-de15#' + xTile + '#' + yTile + '" >Hello Word</a>' + br +
//			'<a href="http://jaanga.github.io/terrain-viewer/un-flatland/latest/index.html#7#' + ulLat + '#' + ulLon + '#1#1" >unFlatland</a>' +
/*
			'<h1>' +
				'<a href=JavaScript:getImage("left"); >&#8678;</a> ' +
				'<a href=JavaScript:getImage("right"); >&#8680;</a> ' +
				'<a href=JavaScript:getImage("up"); >&#8679;</a> ' +
				'<a href=JavaScript:getImage("down"); >&#8681;</a>' +
*/

		history.pushState( '', document.title, window.location.pathname );

	}

	function setLocation( index ) {
		xTile = lon2tile( parseFloat( gazetteer[ index ][2] ), 7 );
		yTile = lat2tile( parseFloat( gazetteer[ index ][1] ), 7 );
		getImage()
	}

	function lighten() {
		var image = context.getImageData(0,0,canvas.width,canvas.height);
		var imageData = image.data;
		colors = [];
		for ( var i = 0; i < imageData.length; i += 4 ) {
			imageData[i] = imageData[i] + 100;
			imageData[i + 1] = imageData[i + 1] + 100;
			imageData[i + 2] = imageData[i + 2] + 100;
			imageData[i + 3] = 255;
			if ( colors.indexOf( imageData[i] ) < 0 ) {
				colors.push( imageData[i] );
			}
		}
		context.putImageData(image, 0, 0);

		var br = '<br>', br2 = br + br;
		shades.innerHTML =
			'PNG:' + br +
			'width: ' + image.width + br +
			'height: ' + image.height + br +
			'pixels: ' + ( image.width * image.height) + br2 +
			'Number of shades: ' + colors.length + br +
			'Min: ' + Array.min( colors ) + br +
			'Max: ' + Array.max( colors ) + br2 +

			'<a href=JavaScript:lighten(); >Lighten</a>' + br +

//			'Shades/heights:<br>' +
//			'<div id=swatch style=color:white; ></div>';

console.log( colors.sort( function(a,b){return a-b} ) )

	}

	function link() {
		window.location.hash = '#' + xTile + '#' + yTile;
	}

	function cos( a ){ return Math.cos( a ); }
	function sin( a ){ return Math.sin( a ); }
	function pow( a, b ){ return Math.pow( a, b ); }

// http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Tile_servers
	function lon2tile( lon, zoom ) {
		return Math.floor( ( lon + 180 ) / 360 * pow( 2, zoom ) );
	}

	function lat2tile( lat, zoom ) {
		return Math.floor(( 1 - Math.log( Math.tan( lat * pi / 180) + 1 / cos( lat * pi / 180)) / pi )/2 * pow(2, zoom) );
	}

	function tile2lon( xTile, z ) {
		return ( xTile / pow( 2, z ) * 360 - 180 );
	}

	function tile2lat( yTile, z ) {
		var n = pi - 2 * pi * yTile / pow( 2, z );
		return 180 / pi * Math.atan( 0.5 * ( Math.exp( n ) - Math.exp( -n ) ));
	}

	Array.max = function( array ){
		return Math.max.apply( Math, array );
	};

	Array.min = function( array ){
		return Math.min.apply( Math, array );
	};

	function requestFile( fname ) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.crossOrigin = "Anonymous"; 
		xmlHttp.open( 'GET', fname, false );
		xmlHttp.send( null );
		return xmlHttp.responseText;
	}

	function onMMove( e ) {
/*
		//if ( e.pageX != undefined && e.pageY != undefined) {
			var x = e.offsetX;
			var y = e.offsetY;
			var p = context.getImageData( x, y, 1, 1).data;
			var hex = '#' + rgbToHex( p[0], p[1], p[2] ).toUpperCase();
			swatch.innerHTML =  'x:' + x + ' y:' + y + '<br>rgb:' + p[0] + ' ' +  p[1] + ' ' + p[2]  + '<br>hex: ' + hex;
			swatch.style.backgroundColor = hex;
		//}
*/
		var x = e.offsetX;
		var y = e.offsetY;
		var p = context.getImageData( x, y, 1, 1).data;

//		var indexHGT = canvas.width * y + x;
//		var elevHGT = ( elevations[ indexHGT ] < 32768 ) ? elevations[ indexHGT ] : -(65536 - elevations[ indexHGT ]);

		var hex = rgbToHex( p[0], p[1], p[2] ).toUpperCase();
		var indexHtMap = parseInt( '0x'  + hex, 16);
		var elevHtMap = ( indexHtMap < 32768 ) ? indexHtMap : -(65536 - indexHtMap );

		msg.innerHTML =  
			'x:' + x + ' y:' + y + '<br>rgb:' + p[0] + ' ' +  p[1] + ' ' + p[2]  + '<br>' +
			'hex: #' + hex + ' raw HtMap:' + indexHtMap + '<br>' +
//			'index HGT: ' + indexHGT + '<br>' +
			'elevation:' + elevHtMap;
		swatch.style.backgroundColor = '#' + hex;

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

	function rgbToHex(r, g, b) {
		var str = ( r * 65536 + g * 256 + b ).toString( 16 );
		str = ( '000000' + str ).slice(-6); 
		return str;
	}