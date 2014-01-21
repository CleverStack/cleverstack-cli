var path = require( 'path' );

var lib = require( path.join( __dirname, 'lib' ) );
lib.pkg = require( path.join( __dirname, 'package.json' ) );

module.exports = lib;
