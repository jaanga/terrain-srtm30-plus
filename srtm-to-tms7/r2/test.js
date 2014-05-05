
	var fs = require('fs');
	var PNG = require('pngjs').PNG;
	var startTime;

	var folderTMS7 = '/tms7-dev/';
	var fileNsmes;

	var tileX = 28, tileY = 0;
	var count = 0;
	init()

	function init() {
		fs.readdir( __dirname + folderTMS7 + '73' , function( err, files ) {
			if ( err ) throw err;
			startTime = new Date();
			fileNames = [];
			for (var i = 0, len = files.length; i < len; i++) {
				if (!files[i].match(/\.png$/i)) continue;
				fileNames.push( files[i] );
			}
//console.log( fileNames );
		});
/*
		for ( var i = 0; i < 128; i++ ) {
			for ( var j = 0; j < 126; j++ ) {
				processFile( i, j );
			}
console.log( 'read', i, j );
		} 
*/

		processFile( tileX, tileY );
	}

	function processFile( tileX, tileY ) {
//	fs.createReadStream( './50.png' )
		fs.createReadStream( __dirname + folderTMS7 + tileX + '/' + tileY  + '.png' )
			.pipe(new PNG({
				filterType: 4
			}))

			.on('error', function() {

console.log('error' );


			})
			.on('parsed', function() {


	/*
				for (var y = 0; y < this.height; y++) {
					for (var x = 0; x < this.width; x++) {
						var idx = (this.width * y + x) << 2;

						// invert color
						this.data[idx] = 255 - this.data[idx];
						this.data[idx+1] = 255 - this.data[idx+1];
						this.data[idx+2] = 255 - this.data[idx+2];

						// and reduce opacity
						this.data[idx+3] = this.data[idx+3] >> 1;
					}
				}

				this.pack().pipe(fs.createWriteStream('out.png'));
	*/
console.log( 'parsed', count, tileX, tileY, new Date() - startTime );
				tileY++;
				count++;
/*
				if ( tileX === 30 && tileY === 89 ) { tileY += 2; }
				if ( tileX === 31 && tileY === 89 ) { tileY += 2; }
				if ( tileX === 33 && tileY === 89 ) { tileY += 2; }
				if ( tileX === 35 && tileY === 89 ) { tileY += 2; }
				if ( tileX === 39 && tileY === 89 ) { tileY += 2; }
				if ( tileX === 42 && tileY === 89 ) { tileY += 2; }
				if ( tileX === 44 && tileY === 89 ) { tileY += 2; }
				if ( tileX === 56 && tileY === 89 ) { tileY += 2; }
				if ( tileX === 61 && tileY === 49 ) { tileY += 2; }
				if ( tileX === 69 && tileY === 66 ) { tileY += 2; }
				if ( tileX === 70 && tileY === 48 ) { tileY += 2; }
//				if ( tileX === 71 && tileY === 48 ) { tileY += 2; }
//				if ( tileX === 72 && tileY === 46 ) { tileY += 20; }
//				if ( ( tileX === 72 || tileX === 73 || tileX === 74 || tileX === 80  || tileX === 81 || tileX === 82 || tileX === 84 ) && tileY === 46 ) { tileY += 5; }
//				if ( tileX === 87 && tileY === 89 ) { tileY += 2; }
				if ( ( tileX === 100 || tileX === 101 || tileX === 102 || tileX === 103 || tileX === 111 || tileX === 112 ) && tileY === 46  ) { tileY += 5; }
*/

				if ( tileY > 126 ) {
					tileY = 0;
					tileX++;

				}
				if ( tileX < 128 ) processFile( tileX, tileY );
			});

	}