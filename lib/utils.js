var path    = require( 'path' )
  , colors  = require( path.resolve( path.join( __dirname, 'colors' ) ) );

module.exports.fail = module.exports.error = function ( msg ) {
  console.log( colors.red( msg ) );
  process.exit( 0 );
}

module.exports.success = function ( msg ) {
  console.log( colors.green( msg ) );
}

module.exports.info = function ( msg ) {
  console.log( colors.blue( msg ) );
}

module.exports.warn = function ( msg ) {
  console.log( colors.orange( msg ) );
}
