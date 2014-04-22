
	var fs = require('fs');

	for ( var i = 0; i < 128; i++) {
		fs.mkdir( '../tms7/' + i, function ( err, i) {
			console.log( 'Dir:', i );
		});
	}
