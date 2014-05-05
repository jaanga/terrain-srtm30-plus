// Theo Armour ~ 2014-03-06 ~ MIT License

	var uf = uf || {};

	uf.defaults = {
		camalt: 200,
		camlat: 37.4,
		camlon: -122.2,
		camx: 0,
		camy: 900,
		camz: 1600,
		clearColor: 0x000066,
		lat: 37.796,
		lon: -122.398,
		map: 3,
		scale: 5,
		taralt: 0,
		tarlat: 37.78805,
		tarlon: -122.34375,
		tarx: 0,
		tary: 0,
		tarz: 0,
		tiles: 8,
		verts: 32,
		zoom: 7
	};
	uf.values = {};

	uf.mapTypes = [
		['Colorful',''],
		['Google Maps','http://mt1.google.com/vt/x='],
		['Google Maps Terrain','http://mt1.google.com/vt/lyrs=t&x='],
		['Google Maps Satellite','http://mt1.google.com/vt/lyrs=s&x='],
		['Google Maps Hybrid','http://mt1.google.com/vt/lyrs=y&x='],
		['Open Street Map','http://tile.openstreetmap.org/'],
		['Open Cycle Map', 'http://tile.opencyclemap.org/cycle/'],
		['MapQuest OSM', 'http://otile3.mqcdn.com/tiles/1.0.0/osm/'],
		['MapQuest Satellite', 'http://otile3.mqcdn.com/tiles/1.0.0/sat/'],
		['Stamen terrain background','http://tile.stamen.com/terrain-background/'],
		['HeightMap','../../../terrain/'],
		['Wireframe','']
	];

	uf.zoomScales = [ [0, 0.005],[1, 0.005],[2, 0.005],[3, 0.005],[4, 0.05],[5, 0.10],[6, 0.15],[7, 0.35],[8, 0.7],[9, 1],[10, 1.5],[11, 2],[12, 4],[13, 5],[14, 6],[15, 8],[16, 9],[17, 20],[18, 10],[19, 20],[20, 20],[21, 20],[22, 20] ];
	uf.tileSize = 256; // Three.js screen units

	uf.init = function() {

		uf.parsePermalink();

		uf.renderer = new THREE.WebGLRenderer( { antiAlias: true } );
		uf.renderer.setClearColor( uf.clearColor, 1 );
		uf.renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( uf.renderer.domElement );

		uf.scene = new THREE.Scene();

		uf.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 20000 );
		uf.controls = new THREE.TrackballControls( uf.camera, uf.renderer.domElement );
		uf.setCamera();

		THREE.ImageUtils.crossOrigin = 'anonymous';

		uf.canvas = document.createElement( 'canvas' );
		uf.canvas.width = uf.canvas.height = uf.vertsPerTile;
		uf.context = uf.canvas.getContext( '2d' );

		uf.drawTerrain();
	};

	uf.parsePermalink = function () {
		var item, index;
		var hashes = location.hash.split('#');
		for (var i = 1, len = hashes.length; i < len; i++) {
			item = hashes[i].split('=');
			index = item[0];
			if ( uf.defaults[ index ] ){
				uf.values[ index ] = item;
			}
		}
		uf.camAlt = uf.values.camalt ? parseFloat( uf.values.camalt[1] ) : uf.defaults.camalt;
		uf.camLat = uf.values.camlat ? parseFloat( uf.values.camlat[1] ) : uf.defaults.camlat;
		uf.camLon = uf.values.camlon ? parseFloat( uf.values.camlon[1] ) : uf.defaults.camlon;
		uf.camX = uf.values.camx ? parseFloat( uf.values.camx[1] ) : uf.defaults.camx;
		uf.camY = uf.values.camy ? parseFloat( uf.values.camy[1] ) : uf.defaults.camy;
		uf.camZ = uf.values.camz ? parseFloat( uf.values.camz[1] ) : uf.defaults.camz;
		uf.clearColor = uf.values.clearColor ? parseInt( uf.values.clearColor[1], 10 ) : uf.defaults.clearColor;
		uf.lat = uf.values.lat ? parseFloat( uf.values.lat[1] ) : uf.defaults.lat;
		uf.lon = uf.values.lon ? parseFloat( uf.values.lon[1] ) : uf.defaults.lon ;
		uf.mapType = uf.values.map ? parseInt( uf.values.map[1], 10) : uf.defaults.map;
		uf.scaleVertical = uf.values.scale ? parseFloat( uf.values.scale[1] ) : uf.defaults.scale ;
		uf.tilesPerSide = uf.values.tiles ? parseInt( uf.values.tiles[1], 10 ) : uf.defaults.tiles;
		uf.vertsPerTile = uf.values.verts ? parseInt( uf.values.verts[1], 10) : uf.defaults.verts;
		uf.tarAlt = uf.values.taralt ? parseFloat( uf.values.taralt[1] ) : uf.defaults.taralt;
		uf.tarLat = uf.values.tarlat ? parseFloat( uf.values.tarlat[1] ) : uf.defaults.tarlat;
		uf.tarLon = uf.values.tarlon ? parseFloat( uf.values.tarlon[1] ) : uf.defaults.tarlon;
		uf.tarX = uf.values.tarx ? parseFloat( uf.values.tarz[1] ) : uf.defaults.tarx;
		uf.tarY = uf.values.tary ? parseFloat( uf.values.tary[1] ) : uf.defaults.tary;
		uf.tarZ = uf.values.tarz ? parseFloat( uf.values.tarz[1] ) : uf.defaults.tarz;
		uf.zoom = uf.values.zoom ? parseInt( uf.values.zoom[1], 10 ) : uf.defaults.zoom;
	};

	uf.setCamera = function() {
		if ( uf.camAlt && uf.camLat && uf.camLon && uf.tarAlt !== undefined && uf.tarLat & uf.tarLon) cameraToLocation();

		uf.controls.target.set( uf.tarX, uf.tarY, uf.tarZ  );
		uf.camera.position.set( uf.camX, uf.camY, uf.camZ );
		uf.camera.up = new THREE.Vector3( 0, 1, 0 );

		uf.update = true;
	};
// why not name space? 
	function cameraToLocation() {
		var off = uf.tilesPerSide % 2 > 0 ? -128 : -256;
		var pointStart = uf.getPoint( uf.lat, uf.lon, uf.zoom );

		var point = uf.getPoint( uf.camLat, uf.camLon, uf.zoom );
		point.ptX += off + uf.tileSize * ( point.tileX - pointStart.tileX );
		point.ptY += off + uf.tileSize * ( point.tileY - pointStart.tileY );

		uf.camX = point.ptX;
		uf.camY = uf.camAlt;
		uf.camZ = point.ptY;

		point = uf.getPoint( uf.tarLat, uf.tarLon, uf.zoom );
		point.ptX += off + uf.tileSize * ( point.tileX - pointStart.tileX );
		point.ptY += off + uf.tileSize * ( point.tileY - pointStart.tileY );

		uf.tarX = point.ptX;
		uf.tarY = uf.tarAlt;
		uf.tarZ = point.ptY;
	}

	uf.image = function( source, count, pointLevel, latCurrent, lonCurrent, i, j ) {
		this.img = document.createElement( 'img' );
		this.img.onload = uf.drawCanvasImage( this.img, count, pointLevel, latCurrent, lonCurrent, i, j );
		this.img.src = source;
	};

	uf.drawTerrain = function() {
		if ( uf.terrain ) uf.scene.remove( uf.terrain );
		uf.terrain = new THREE.Object3D();
		var pointLevel, name;
		uf.images = {};
		uf.count = 0;
		uf.start = Math.floor( 0.5 * ( uf.tilesPerSide - 1 ) );
		uf.offset = -0.5 * uf.tileSize * uf.tilesPerSide; // Remember: Tiles are drawn from their centers

		uf.pointZoomWin = uf.getPoint( uf.lat, uf.lon, uf.zoom );
		uf.ulLat = uf.pointZoomWin.ulTileLat + uf.start * uf.pointZoomWin.deltaLat; // for add-ons
		uf.ulLon = uf.pointZoomWin.ulTileLon - uf.start * uf.pointZoomWin.deltaLon;

		var latStart = uf.lat + uf.start * uf.pointZoomWin.deltaLat;
		var lonStart = uf.lon - uf.start * uf.pointZoomWin.deltaLon;

		var i, j, lonCurrent, latCurrent, xDir;
		for ( i = 0; i < uf.tilesPerSide; i++ ) {
			lonCurrent = lonStart + i * uf.pointZoomWin.deltaLon;
			for ( j = 0; j < uf.tilesPerSide; j++ ) {
				latCurrent = latStart - j * uf.pointZoomWin.deltaLat;
				if ( uf.zoom < 8) {
					pointLevel = uf.getPoint( latCurrent, lonCurrent, uf.zoom);
					var num = Math.pow( 2, uf.zoom);
					if ( pointLevel.tileX < 0 || pointLevel.tileY < 0 || j >= num || i >= num ) break;
					xDir =  'tms7-dev/';
				} else {
					pointLevel = uf.getPoint( latCurrent, lonCurrent, 7 );
					if ( pointLevel.tileX < 32 ) {
						xDir = 'terrain-de3-0-31/';
					} else if ( pointLevel.tileX < 64 ) {
						xDir = 'terrain-de3-32-63/';
					} else if ( pointLevel.tileX < 96 ) {
						xDir = 'terrain-de3-64-95/';
					} else {
						xDir = 'terrain-de3-96-127/';
					}
				}
				name = pointLevel.tileX + '/' + pointLevel.tileY;
				uf.images[ name ] = new uf.image( '../../' + xDir + name + '.png', pointLevel, latCurrent, lonCurrent, i, j );
			}
		}
		pointLevel = uf.getPoint( latStart - j * uf.pointZoomWin.deltaLat, lonStart + i * uf.pointZoomWin.deltaLon, uf.zoom);
		uf.lrLat = pointLevel.ulTileLat; // for add-ons
		uf.lrLon = pointLevel.ulTileLon;
		uf.scene.add( uf.terrain );
	};

	uf.drawCanvasImage = function( heightmap, point7, latCur, lonCur, ii, jj ) {
		return function() {

			var mesh, geometry, material, texture;
			var offset = -0.5 * uf.tileSize * uf.tilesPerSide; // Remember: Tiles are drawn from their centers

			var pointZoomWin = uf.getPoint( latCur, lonCur, uf.zoom );

			var zoomWinScale = Math.pow( 2, uf.zoom - 7);

			var cropSizeX = heightmap.width / zoomWinScale;
			var cropSizeY = heightmap.height / zoomWinScale;

			var deltaX = pointZoomWin.tileX - point7.tileX * zoomWinScale;
			var deltaY = pointZoomWin.tileY - point7.tileY * zoomWinScale;

			var cropStartX = cropSizeX * deltaX;
			var cropStartY = cropSizeY * deltaY;


			uf.context.drawImage( heightmap, cropStartX - 2, cropStartY - 2, cropSizeX + 2, cropSizeY + 2, 0, 0, uf.vertsPerTile, uf.vertsPerTile);
			var imgData = uf.context.getImageData( 0, 0, uf.vertsPerTile, uf.vertsPerTile ).data;
//console.log( imgData)
			geometry = new THREE.PlaneGeometry( uf.tileSize + 2, uf.tileSize + 2, uf.vertsPerTile - 1, uf.vertsPerTile - 1);
			geometry.applyMatrix( new THREE.Matrix4().makeRotationX( -0.5 * Math.PI ) );

			var verts = geometry.vertices;
			uf.scaleVerticalCurrent = 0.2 * uf.scaleVertical * uf.zoomScales[ uf.zoom ][1];
			var str;
			for ( var i = 0, j = 0, len = imgData.length; i < len; i += 4 ) {
				str = imgData[i] * 65536 + imgData[i + 1] * 256 + imgData[i + 2];
				elevHtMap = ( str < 32768 ) ? str : -(65536 - str );
				verts[j++].y = uf.scaleVerticalCurrent * 0.1 * elevHtMap;
			}

			if ( uf.mapType < 1 ) {
				material = new THREE.MeshNormalMaterial( { shading: THREE.SmoothShading } );
			} else if ( uf.mapType < 5  ) {
				texture = THREE.ImageUtils.loadTexture( uf.mapTypes[ uf.mapType ][1] + pointZoomWin.tileX + "&y=" + pointZoomWin.tileY + "&z=" + uf.zoom  );
//				texture.needsUpdate = true;
				material = new THREE.MeshBasicMaterial( { map: texture } );
			} else if ( uf.mapType < 11) {
				texture = THREE.ImageUtils.loadTexture( uf.mapTypes[ uf.mapType ][1] + uf.zoom + "/" + pointZoomWin.tileX + "/" + pointZoomWin.tileY + ".png" );
//				texture.needsUpdate = true;
				material = new THREE.MeshBasicMaterial( { map: texture } );

			} else if ( uf.mapType < 12 ) {
				material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true } );
			}

			mesh = new THREE.Mesh( geometry, material );
			mesh.position.set( ii * uf.tileSize + offset + 0.5 * uf.tileSize, 0, jj * uf.tileSize + offset + 0.5 * uf.tileSize );
			uf.terrain.add( mesh );

			if ( ++uf.count >= uf.tilesPerSide * uf.tilesPerSide ) { uf.update = true; }
		};
	};

	uf.getPoint = function( latP, lonP, zoom ) {
		var tileX = uf.lon2tile( lonP, zoom );
		var tileY = uf.lat2tile( latP, zoom );

		var ulTileLat = uf.tile2lat( tileY, zoom);
		var ulTileLon = uf.tile2lon( tileX, zoom );

		var deltaLat = Math.abs( uf.tile2lat( tileY, zoom ) - uf.tile2lat( tileY + 1, zoom ));
		var deltaLon = Math.abs( uf.tile2lon( tileX, zoom ) - uf.tile2lon( tileX + 1, zoom ));

		var scaleX = 1 / deltaLon;
		var scaleY = 1 / deltaLat;

		var ptX = uf.tileSize * scaleX * ( lonP - ulTileLon);
		var ptY = uf.tileSize * scaleY * ( ulTileLat - latP );

		return {
			tileX: tileX, tileY: tileY,
			ulTileLat: ulTileLat, ulTileLon: ulTileLon,
			deltaLat: deltaLat, deltaLon: deltaLon,
			scaleX: scaleX, scaleY: scaleY,
			ptX: ptX, ptY: ptY
		};
	};

	uf.lon2tile = function( lon, zoom ) {
		return Math.floor( ( lon + 180 ) / 360 * Math.pow( 2, zoom ) );
	};

	uf.lat2tile = function( lat, zoom ) {
		return Math.floor(( 1 - Math.log( Math.tan( lat * Math.PI / 180) + 1 / Math.cos( lat * Math.PI / 180)) / Math.PI)/2 * Math.pow(2, zoom) );
	};

	uf.tile2lon = function ( x, zoom ) {
		return ( x / Math.pow( 2, zoom ) * 360 - 180 );
	};

	uf.tile2lat = function ( y, zoom ) {
		var n = Math.PI - 2 * Math.PI * y / Math.pow( 2, zoom );
		return 180 / Math.PI * Math.atan( 0.5 * ( Math.exp( n ) - Math.exp( -n ) ));
	};

	uf.animate = function() {
		requestAnimationFrame( uf.animate );
		uf.controls.update();
		uf.renderer.render( uf.scene, uf.camera );
	};
