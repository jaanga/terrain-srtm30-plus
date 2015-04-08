	var JA = {} || JA;

	JA.titleIcon = '<i class="fa fa-bomb"></i>';  // ultimately should be something created on the fly
	JA.TitleText = '"Your free animated online real-time 3D happy place"';

// Parent window GUI
	JA.addCSS = function () {

		var css = document.body.appendChild( document.createElement('style') );
		css.innerHTML = 'body { font: 600 12pt monospace; margin: 0; overflow: hidden; }' +
			'h1 { margin: 0; }' +
			'a { opacity: 1; text-decoration: none; }' +
			'#closerIcon p { margin: 0; opacity: 0.8; }' +
			'#movable { background-color: #ccc; opacity: 0.8; cursor: move; left: 20px; max-width: 400px; ' +
				'max-height: ' + (window.innerHeight - 100) + 'px; min-width: 325px;' +
				'overflow-x: hidden; overflow-y: auto; padding: 10px; position: absolute; top: 20px; z-index: 50; }' +
			'.button { background-color: #eee; outline: 1px #aaa solid; padding: 5px; }' +
			'.buttonFile { background-color: #eeffee; cursor: pointer; outline: 1px #aaa solid; padding: 5px; }' +
			'.buttonLibrary { background-color: #ddddff; cursor: pointer; outline: 1px #aaa solid; padding: 5px; }' +
		'';
	};

	JA.addMenu = function () {

		JA.menu = JA.container.appendChild( document.createElement( 'div' ) );
		JA.menu.id = 'movable';
		JA.menu.title = 'Move this menu panel around the screen or iconize it';
		JA.menu.addEventListener( 'mousedown', JA.mouseMove, false );
		JA.menu.innerHTML = '<a id=closerIcon href=JavaScript:JA.toggleMenu(); ><p><i class="fa fa-bars"></i></p></a>' +
			'<h1>' +
				'<a href="" title=' + JA.TitleText + '>' + document.title + ' ' + JA.titleIcon + '</a> ' +
			'</h1>' +
			'<hr>' +
		'';

		window.addEventListener( 'mouseup', JA.mouseUp, false);

	};

// template
	JA.addAboutTab = function () {

		var tab = JA.menu.appendChild( document.createElement( 'div' ) );
		tab.title = 'View useful information';
		tab.innerHTML =
			'<a href=# onclick=JA.toggleDialogs(JA.aboutDialog); ><p class=button >' +
				'<i class="fa fa-paw"></i> About...' +
			'</p></a>';

		JA.aboutDialog = JA.container.appendChild( document.createElement( 'div' ) );
		JA.aboutDialog.style.cssText = 'display: none; background-color: #ccc; left: 50px; opacity: 0.9; padding: 20px; ' +
			'bottom: 0; left: 0; height: 370px; margin: auto; position: absolute; right: 0; top: 0; width: 500px; z-index:10; ';
		JA.aboutDialog.innerHTML =
			'<h3>' + document.title + ' ' + JA.titleIcon + '</h3>' +
			'<p>This is all just template text. Replace with your own text.</p>' +
			'<h4>Features of the app include the following:</h4>' +
			'<ul>' +
				'<li>Pan, rotate and zoom in real-time</li>' +
				'<li>xxx</li>' +
			'</ul>' +

			'<small>' +
				'<a href="https://github.com/jaanga/xxxxxxxxxxxxxx" target="_blank">Read Me ~</a> ' +
				'<a href="https://github.com/jaanga/xxxxxxxxxxxxxx" target="_blank">Source Code ~ </a> ' +
				'Credits: <a href="http://threejs.org" target="_blank">three.js</a> - ' +
				'<a href="http://khronos.org/webgl/" target="_blank">webgl</a> - ' +
				'<a href="http://jaanga.github.io" target="_blank">jaanga</a><br>' +
				'copyright &copy; 2014 Jaanga authors ~ MIT license' +
			'</small><br><br>' +
			'<p style=text-align:right; >' +
				'<a class=button href=JavaScript:JA.toggleDialogs(JA.about); >Close</a> ' +
			'</p>' +
		'';

	};

	JA.addMessageArea = function () {

		JA.msg = JA.menu.appendChild( document.createElement( 'div' ) );
		JA.msg.style.cssText = 'cursor: auto;';
		JA.msg.innerHTML =
			'<div id=divMsg1 ></div>' +
			'<div id=divMsg2 ></div>' +
			'<div id=divMsg3 ></div>' +
			'<div id=divMsg4 ></div>' +
			'<div id=divMsg5 ></div>' +
		'';

	};

// Toggles

	JA.toggleMenu = function () {

		var toggle = JA.menu.children[1].style.display === 'none' ? '' : 'none';
		for (var i = 1; i < JA.menu.children.length; i++) {
			JA.menu.children[i].style.display = toggle;
		}

	};

	JA.toggleTab = function ( tab ) {

		tab.style.display = tab.style.display === 'none' ? '' : 'none' ;

	};

	JA.toggleDialogs = function ( dialog ) {

		var toggle = dialog.style.display;
		for (var i = 1, len = JA.container.children.length; i < len; i++) {
			JA.container.children[i].style.display = 'none';
		}
		dialog.style.display = toggle === 'none' ? '' : 'none';

	};

// Events

	JA.mouseUp = function () {

		window.removeEventListener('mousemove', JA.divMove, true);

	};

	JA.mouseMove = function( event ){

		if ( event.target.id === 'movable' ) {
			event.preventDefault();

			offsetX = event.clientX - event.target.offsetLeft;
			offsetY = event.clientY - event.target.offsetTop;

			window.addEventListener('mousemove', JA.divMove, true);
		}

	};

	JA.divMove = function( event ){

		event.target.style.left = ( event.clientX - offsetX ) + 'px';
		event.target.style.top = ( event.clientY - offsetY ) + 'px';

	};
