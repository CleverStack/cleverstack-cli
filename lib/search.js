var path    = require( 'path' )
  , Promise = require( 'bluebird' )
  , async   = require( 'async' )
  , semver  = require( 'semver' )
  , _       = require( 'lodash' )
  , http    = require('follow-redirects').http
  , https   = require('follow-redirects').https
  , utils   = require( path.join( __dirname, 'utils' ) );

var _keywordRequired = [ 'cleverstack module', 'cleverstack-module', 'cleverstack seed', 'cleverstack-seed' ];

Promise.longStackTraces( );

/**
 * Searchies <queries> within the NPM registry
 *
 * @param  {String[]} queries
 * @return {Promise}
 * @api public
 */

var searchNPMRegistry = exports.npmRegistry = function ( queries ) {
  var def   = Promise.defer( )
    , repos = [];

  // Keep this as SERIES until we come up with a better system
  // than bundleDeps.. when we do clever install clever-orm clever-auth
  // auth HAS to come AFTER ORM.. kind of a bad system
  // so we'll definitely need some sort of dependency management system.
  async.eachSeries( queries, function ( q, next ) {
    var search = q.split( '@' );
    if (typeof search[ 1 ] === "undefined") {
      search[ 1 ] = '*';
    }

    var req = http.request( {
      hostname: 'registry.npmjs.org',
      path: '/' + encodeURIComponent( search[ 0 ] )
    }, function ( res ) {
      res.setEncoding( 'utf-8' );

      var responseString = '';

      res.on( 'data', function ( data ) {
        responseString += data;
      });

      res.on( 'end', function( ) {
        var body = JSON.parse( responseString );

        if (body.error && body.error === "not_found") {
          return next( );
        }

        var versions = Object.keys( body.versions )
          , maxVersion;

        if ([ '>', '<', '=', '*' ].indexOf( search[ 1 ] ) > -1) {
          maxVersion = semver.maxSatisfying( versions, search[ 1 ] );
        } else {
          maxVersion = semver.clean( search[ 1 ] );
        }

        var pkg = body.versions[ maxVersion ];
        if (typeof pkg === "undefined") {
          utils.fail( 'Invalid version ' + search[ 1 ] + ' for module ' + search[ 0 ], true );
          return next( );
        }

        if (_.intersection( pkg.keywords, _keywordRequired ).length > 0) {
          if (typeof pkg.repository === "object" && pkg.repository.hasOwnProperty( 'url' )) {
            pkg.homepage = pkg.repository.url;
          }

          repos.push( pkg );
        }

        next( );
      } );
    } );
    req.end( );
  }, function ( err ) {
    if (!!err) {
      return def.reject( err );
    }

    def.resolve( repos );
  } );

  return def.promise;
}

/**
 * Lists all of the CleverStack-friendly
 * modules within the NPM registry
 *
 * @return {Promise}
 * @api public
 */

var list = exports.list = function ( ) {
  var def = Promise.defer( );

  var req = http.request( {
    hostname: 'registry.npmjs.org',
    path: '/-/_view/byKeyword?startkey=["cleverstack"]&endkey=["cleverstack",{}]&group_level=2'
  }, function ( res ) {
    res.setEncoding( 'utf-8' );

    var responseString = '';

    res.on( 'data', function ( data ) {
      responseString += data;
    });

    res.on( 'end', function( ) {
      var body = JSON.parse( responseString );

      if (typeof body !== "object" || !body.hasOwnProperty( 'rows' )) {
        return def.resolve( [ ] );
      }

      var rows = body.rows.map( function ( r ) {
        return r.key[ 1 ];
      } );

      searchNPMRegistry( rows ).then( function ( response ) {
        def.resolve( response );
      } )
      .catch( function ( err ) {
        def.reject( err );
      } );
    } );

  } );

  req.end( );

  return def.promise;
}

/**
 * Searches through the NPM registry with a
 * info message, if queries is empty then simply return resolves
 *
 * @param  {String[]} queries
 * @return {Promise}
 * @api public
 */

var searchNPM = exports.npm = function ( queries ) {
  var def   = Promise.defer( );

  utils.info( 'Searching through NPM packages...' );

  if (queries.length < 1) {
    list( ).then( function ( res ) {
      def.resolve( res )
    } )
    .catch( function ( err ) {
      def.reject( err );
    } );
  } else {
    searchNPMRegistry( queries ).then( function ( res ) {
      def.resolve( res );
    } )
    .catch( function ( err ) {
      def.reject( err );
    } );
  }

  return def.promise;
}

/**
 * Lists all CleverStack-friendly modules within the Bower registry
 *
 * @return {Promise}
 * @api private
 */

function listBower( ) {
  var def   = Promise.defer( )
    , repos = [ ];

  utils.info( 'Searching through Bower packages' );

  // request( {
  //   url: 'https://bower-component-list.herokuapp.com/keyword/cleverstack',
  //   json: true
  // },
  // function ( err, res, body ) {
  var req = https.request( {
    hostname: 'bower-component-list.herokuapp.com',
    path: '/keyword/cleverstack'
  }, function ( res ) {
    res.setEncoding('utf-8');

    var responseString = '';

    res.on( 'data', function ( data ) {
      responseString += data;
    } );

    res.on( 'end', function( ) {
      var body  = JSON.parse( responseString );

      if (!Array.isArray( body )) {
        return def.resolve( repos );
      }

      async.each( body, function ( module, next ) {
        var req2 = https.request( {
          hostname: 'bower.herokuapp.com',
          path: '/packages/' + encodeURIComponent( module.name )
        }, function ( res ) {
          if (res.statusCode !== 200) {
            return next( );
          }

          res.setEncoding('utf-8');

          var responseString = '';

          res.on( 'data', function ( data ) {
            responseString += data;
          } );

          res.on( 'end', function( ) {
            var bower = JSON.parse( responseString );

            if (!bower || !bower.url) {
              return next( );
            }

            module.url = bower.url;
            repos.push( module );
            next( );
          } );
        } );
        req2.end( );
      }, function ( ) {
        def.resolve( repos );
      } );
    } );
  } );

  req.end( );

  return def.promise;
}

/**
 * Returns specific information from a Bower package
 * It will try to find if the version exists through
 * the packages GitHub page (this is what Bower does anyway)
 *
 * @param  {String} query
 * @return {Promise}
 * @api public
 */

var searchBower = exports.bower = function ( query ) {
  var def = Promise.defer( )
    , pkg = query.split( '@' );

  utils.info( 'Searching through Bower packages for ' + query + '...' );

  var req = https.request( {
    hostname: 'bower.herokuapp.com',
    path: '/packages/' + encodeURIComponent( pkg[ 0 ] )
  }, function ( res ) {
    res.setEncoding('utf-8');

    if (res.statusCode !== 200) {
      return def.resolve( );
    }

    var responseString = '';

    res.on( 'data', function ( data ) {
      responseString += data;
    } );

    res.on( 'end', function( ) {
      var bower = JSON.parse( responseString );

      if (typeof bower === "undefined") {
        return def.resolve( );
      }
      else if (typeof pkg[ 1 ] === "undefined") {
        return def.resolve( bower );
      }

      var req2 = https.request( {
        hostname: 'github.com',
        path: '/' + bower.url.split( '/' ).splice( -2 ).join( '/' ).replace( '.git', '' ) + '/tree/' + pkg[ 1 ],
        headers: {
          'User-Agent': 'cleverstack'
        }
      }, function ( res ) {
        if (res.statusCode !== 200) {
          utils.fail( 'Couldn\'t find version ' + pkg[ 1 ] + ' for ' + pkg[ 0 ], true );
          return def.resolve( );
        }

        bower.version = pkg[ 1 ];
        bower.bower = true;
        def.resolve( bower );
      } );

      req2.end( );
    } );
  } );

  req.end( );

  return def.promise;
}

/**
 * Aggregates searches from NPM and Bower
 *
 * @param  {String[]} args
 * @return {Promise}
 * @api public
 */

exports.aggregate = function ( args ) {
  var def = Promise.defer( )
    , all = [ ];

  all.push( searchNPM( args ) );
  all.push( listBower( ) );

  args.forEach( function ( arg ) {
    all.push( searchBower( arg ) );
  } );

  Promise.all( all ).then( function ( results ) {
    var npm   = results[ 0 ].map( function ( r ) { r.type = 'backend'; return r; } )
      , keys  = results[ 1 ]
      , repos = [ ];

    results.shift( );
    results.shift( );

    var bower = ( args.length < 1 ? keys : results );
    if (!Array.isArray( bower )) {
      bower = [ ];
    }

    bower.filter( function ( res ) {
      return typeof res === "object" && res.hasOwnProperty( 'url' );
    } ).forEach( function ( rep )  {
      var cleverStackBower = _.find( keys, function ( key ) {
        return key.name === rep.name;
      } );

      if (cleverStackBower) {
        rep = _.merge( cleverStackBower, rep );
        rep.type = 'frontend';
        repos.push( rep );
      }
    } );

    def.resolve( [ npm, repos ] );
  } )
  .catch( function ( err ) {
    def.reject( err );
  } );

  return def.promise;
}
