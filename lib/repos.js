var https   = require( 'https' )
  , path    = require( 'path' )
  , async   = require( 'async' )
  , _       = require( 'lodash' )
  , utils   = require( path.join( __dirname, 'utils'  ) )
  , colors  = require( path.join( __dirname, 'colors' ) )
  , cache   = require( path.join( __dirname, 'cache'  ) );

function fetchRepos( org, data, fn ) {
  var req = https.request( {
    host: 'api.github.com',
    path: '/orgs/' + org + '/repos',
    port: 443,
    method: 'GET',
    headers: {
      'user-agent': 'cleverstack list'
    }
  }, function ( res ) {
    if (res.statusCode !== 200) {
      return lib.utils.fail( 'GitHub API may be offline or you\'ve reached your maximum rate limit.' );
    }

    var _data = '';
    res.on( 'end', function( ) {
      var response = JSON.parse( _data );

      response
      .filter( function ( repo ) {
        return repo.owner.login !== "clevertech" || ( !!repo.homepage && repo.homepage.indexOf( 'cleverstack.io' ) > -1 );
      } )
      .forEach( function ( repo ) {
        var repoExists = _.findIndex( data.registry, function ( r ) {
          return r.hasOwnProperty( 'repo' ) && r.repo === repo.name;
        } );

        if (repoExists !== false && repoExists > -1) {
          if (!!repo.html_url) {
            data.registry[repoExists].url = repo.html_url;
          }

          if (!!repo.homepage) {
            data.registry[repoExists].homepage = repo.homapage;
          }
        } else {
          var newRepo = {
            name: repo.name
          };

          if (!!repo.html_url) {
            newRepo.url = repo.html_url;
          }

          if (!!repo.homepage) {
            newRepo.homepage = repo.homepage;
          }

          data.registry.push( newRepo );
        }
      } );

      fn( null, data );
    } );

    res.on( 'data', function ( chunk ) {
      _data += chunk +''
    } );
  } );

  req.end( );
  req.on( 'error', fn );
}

module.exports.display = function ( repo ) {
  var title = [repo.name];
  if (repo.version !== undefined) {
    title.push( colors.darkGray( '@ ' + repo.version ) );
  }

  if (repo.type === undefined || repo.type === "backend") {
    utils.warn( title.join( ' ' ) );
  } else {
    console.log( colors.sky( title.join( ' ' ) ) );
  }

  if (repo.url !== null || repo.homepage !== null) {
    console.log( colors.gray( repo.url || repo.homepage ) );
  }

  if (repo.description !== undefined && repo.description.trim( ) !== "") {
    console.log( colors.lightGray( repo.description ) );
  }

  console.log( '' );
}

module.exports.list = function( fn ) {
  cache.read(function ( err, data ) {
    if (!!err) {
      return fn( err );
    }

    var now = Math.round( ( new Date( ) ).getTime( ) / 1000 );

    var refreshCache = !data.lastUpdate
      ? true
      : now - data.lastUpdate > 60*60*24; // 1 day

    if (!refreshCache && Array.isArray( data.registry ) && data.registry.length > 0) {
      return fn( null, data.registry );
    }

    async.waterfall( [
      async.apply( fetchRepos, 'cleverstack', data ),
      async.apply( fetchRepos, 'clevertech' )
    ], function ( err, data ) {
      data.lastUpdate = now;

      var str = JSON.stringify( data, null, 2 );

      cache.write( str, function ( err ) {
        fn( err, data.registry );
      } );
    } );
  } );
}
