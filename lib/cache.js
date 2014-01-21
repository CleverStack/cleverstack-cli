var Promise   = require( 'bluebird' )
  , fs        = Promise.promisifyAll( require( 'fs' ) )
  , path      = require( 'path' )
  , fileName  = path.resolve( path.join( __dirname, '..', 'cache.json' ) );

Promise.longStackTraces( );

var writeFile = exports.write = function ( str, fn ) {
  return fs.writeFileAsync( fileName, str ).nodeify( fn );
}

var readFile = exports.read = function ( fn ) {
  var def = Promise.defer( );

  if (!fs.existsSync( fileName ) ) {
    process.nextTick( function( ) {
      def.resolve( {
        lastUpdate: 0,
        registry: []
      } );
    } );
  } else {
    fs.readFileAsync( fileName, {encoding: 'utf-8'} )
    .then( function ( data ) {
      try {
        data = JSON.parse( data );
      } catch ( _error ) {
        return def.reject( _error );
      }

      data = typeof data !== "object" || data === null ? {} : data;

      data.lastUpdate = data.lastUpdate || 0;
      data.registry   = data.registry || [];

      def.resolve( data );
    } )
    .nodeify( fn );
  }

  return def.promise;
}

module.exports.findRepo = function ( repo, fn ) {
  var def = Promise.defer( );

  readFile( )
  .then( function ( data ) {
    var hasRegistryProperty = typeof data === "object" && data !== null && data.hasOwnProperty( 'registry' )
      , registryIsPopulated = data !== null && Array.isArray( data.registry ) && data.registry.length > 0;

    def.resolve( ( hasRegistryProperty && registryIsPopulated ) );
  } )
  .nodeify( fn );

  return def.promise;
}

module.exports.addRepo = function ( options, fn ) {
  var def = Promise.defer( );

  readFile( )
  .then( function ( data ) {
    data.registry.push( options );

    return writeFile( JSON.stringify( data, null, 2 ) );
  } )
  .nodeify( fn );

  return def.promise;
}
