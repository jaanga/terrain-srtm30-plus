	var pngFolder
	var pngFiles;
	var pngStart

	var image;
	var canvas, context;

	function init() {
//		var hashes = location.hash.split('#');
//		xTile = ( hashes[1] !== undefined ) ? hashes[1] : xTile;

		var css = document.body.appendChild( document.createElement('style') );
		css.innerHTML = 'body { font: 600 12pt monospace; margin: 0; }' +
			'h1 a {text-decoration: none; }' +
		'';

		var menu = document.body.appendChild( document.createElement( 'div' ) );
		menu.id = 'movable';
		menu.style.cssText = ' background-color: #ccc; left: 20px; opacity:0.8; padding: 10px; position: absolute; top: 20px;';
		menu.addEventListener( 'mousedown', mouseMove, false );
		menu.innerHTML = '<div onclick=info.style.display="none"; >[x]</div>' +
			'<h1>' +
				'<a href="" >' + document.title + '</a> ' +
				'<a href=# id=aHelp title="Get help and info" onclick=help.style.display="block"; >&#x24D8;</a>' +
			'</h1>' +
			'<div>' +
				'Select PNG file: <select id=selPNG onchange=getImage() title="Choose one of ' + pngFiles.length + ' places" ></select>' +
			'</div>' +
			'<hr>' +
			'<div id=swatch >' +
				'Color' +
			'</div>' +
			'<div id=msg >x: y: <br>rgb:<br>hex:<br>elevation:<br></div>' +
		'';

		addHelp();

		for ( var i = 0, len = pngFiles.length; i < len; i++ ) {
			selPNG.appendChild( document.createElement( 'option' ) );
			selPNG.children[i].text = pngFiles[i][0];
			selPNG.children[ i ].title = pngFiles[i][1];
		}
		selPNG.selectedIndex = pngStart;

		window.addEventListener('mouseup', mouseUp, false);

		container = document.body.appendChild( document.createElement( 'div' ) );
		container.style.cssText = 'border: 0px red solid; height: ' + ( window.innerHeight - 10 ) + 'px; overflow: auto; width: ' +
			( window.innerWidth - 10 ) + 'px; ';
		canvas = container.appendChild( document.createElement( 'canvas' ) );
		canvas.onmousemove = onMMove;
		context = canvas.getContext( '2d' );

		image = new Image();
		getImage();
	}

	function getImage() {
		image.src = pngFolder + selPNG.value + '.Bathymetry.png';
		image.onload = drawImage;
	}

	function drawImage() {
		canvas.width = image.width;
		canvas.height =  image.height;
		context.drawImage( image, 0, 0, canvas.width , canvas.height, 0, 0, canvas.width , canvas.height);

		history.pushState( '', document.title, window.location.pathname );
	}

	function onMMove( e ) {
		var x = e.offsetX;
		var y = e.offsetY;
		var p = context.getImageData( x, y, 1, 1).data;

		var hex = rgbToHex( p[0], p[1], p[2] ).toUpperCase();
		var indexHtMap = parseInt( '0x'  + hex, 16);
		var elevHtMap = ( indexHtMap < 32768 ) ? indexHtMap : -(65536 - indexHtMap );

		swatch.style.backgroundColor = '#' + hex;
		msg.innerHTML =  
			'<p>x: ' + x + ' y: ' + y + '<p>' +
			'<p>rgb: ' + p[0] + ' ' +  p[1] + ' ' + p[2]  + '</p>' +
			'<p>hex: #' + hex + ' raw HtMap:' + indexHtMap + '</p>' +
			'<p>elevation in meters: ' + elevHtMap + '</p>';
	}

	function rgbToHex(r, g, b) {
		var str = ( r * 65536 + g * 256 + b ).toString( 16 );
		str = ( '000000' + str ).slice( -6 ); 
		return str;
	}

	function addHelp() {
		help = document.body.appendChild( document.createElement( 'div' ) );
		help.style.cssText = 'display: none; background-color: #ccc; left: 50px; opacity: 0.9; padding: 20px; ' +
			'bottom: 0; left: 0; height: 370px; margin: auto; position: absolute; right: 0; top: 0; width: 500px; zIndex:10; ';
		help.innerHTML =
			'<div onclick=help.style.display="none"; >' +
				'<h3>' + document.title + '</h3>' +
				'<p>View the PNG files generated from SRTM30 Plus data </p>' +

				'<h4>Roadmap</h4>' +
				'<ul>' +
					'<li>Visible place names</li>' +
					'<li>Permalinks</li>' +
				'</ul>' +

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
