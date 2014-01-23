var https   = require( 'https' )
  , semver  = require( 'semver' )
  , path    = require( 'path' )
  , cache   = require( path.resolve( path.join( __dirname, 'cache' ) ) );

module.exports = function( repo, fn ) {
  cache.read(function ( err, data ) {
    if (!!err) {
      return fn( err );
    }

    var now = Math.round( ( new Date( ) ).getTime( ) / 1000 );
    var mod = data.registry.filter( function ( d ) {
      return d.repo === repo;
    } );

    if (mod.length < 1) {
      mod = {
        repo: module,
        tags: [],
        lastUpdate: null
      }

      data.registry.push( mod );
    } else {
      mod = mod[0];
    }

    var refreshCache = !data.lastUpdate ? true : now - data.lastUpdate > 60*60*24; // 1 day

    if (!refreshCache && Array.isArray( mod.tags ) && mod.tags.length > 0) {
      return fn( null, mod.tags );
    }

    var req = https.request( {
      host: 'api.github.com',
      path: '/repos/clevertech/' + repo + '/git/refs/tags',
      port: 443,
      method: 'GET',
      headers: {
        'user-agent': 'cleverstack semver resolver'
      }
    }, function ( res ) {
      if (res.statusCode !== 200) {
        return lib.utils.fail( 'GitHub API may be offline or you\'ve reached your maximum rate limit.' );
      }

      var _data = '';
      res.on( 'end', function( ) {
        var tags = JSON.parse( _data ).filter( function ( obj ) {
          return obj.ref.indexOf( 'refs/tags/' ) > -1;
        } ).map( function ( obj ) {
          return obj.ref.replace( 'refs/tags/', '' ).replace( /^v/i, '' ).toString();
        } )
        .filter( function ( obj ) {
          return !!semver.parse( obj, true );
        } )
        .sort( semver.compareLoose )
        .map( String );

        data.registry.map( function ( d ) {
          if (d.hasOwnProperty( 'repo' ) && d.repo === repo) {
            d.tags        = tags;
            d.lastUpdate  = now;
          }

          return d;
        } );

        data.lastUpdate = now;

        var str = JSON.stringify( data, null, 2 );

        cache.write( str, function ( err ) {
          fn( err, tags );
        } );
      } );

      res.on( 'data', function ( chunk ) {
        _data += chunk + ''
      } );
    } );

    req.end( );
    req.on( 'error', fn );
  } );
}