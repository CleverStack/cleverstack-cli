var path            = require( 'path' )
  , updateNotifier  = require( 'update-notifier' )
  , packageJson     = require( path.resolve( path.join( __dirname, '..', 'package.json' ) ) );

module.exports      = function( callback ) {
    return updateNotifier( { pkg: packageJson, callback: callback } );
}