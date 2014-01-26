var path    = require( 'path' )
  , Promise = require( 'bluebird' )
  , async   = require( 'async' )
  , semver  = require( 'semver' )
  , _       = require( 'lodash' )
  , request = require( 'request' )
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

  async.each( queries, function ( q, next ) {
    var search = q.split( '@' );
    if (typeof search[ 1 ] === "undefined") {
      search[ 1 ] = '*';
    }

    request( {
      url: 'http://registry.npmjs.org/' + encodeURIComponent( search[ 0 ] ),
      json: true
    },
    function ( err, response, res ) {
      if (!!err || (res.error && res.error === "not_found")) {
        return next( );
      }

      var versions = Object.keys( res.versions );
      var maxVersion = semver.maxSatisfying( versions, search[ 1 ] );

      var pkg = res.versions[maxVersion];
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

  request.get( {
    url: 'https://registry.npmjs.org/-/_view/byKeyword?startkey=["cleverstack"]&endkey=["cleverstack",{}]&group_level=2',
    json: true
  },
  function ( err, res, body ) {
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

  request( {
    url: 'https://bower-component-list.herokuapp.com/keyword/cleverstack',
    json: true
  },
  function ( err, res, body ) {
    async.each( body, function ( module, next ) {
      request( {
        url: 'https://bower.herokuapp.com/packages/' + encodeURIComponent( module.name ),
        json: true
      },
      function ( e, response, bower ) {
        if (!bower || !bower.url) {
          return next( );
        }

        module.url = bower.url;
        repos.push( module );
        next( );
      } );
    }, function ( ) {
      def.resolve( repos );
    } );
  } );

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

  request( {
    url: 'https://bower.herokuapp.com/packages/' + encodeURIComponent( pkg[ 0 ] ),
    json: true
  },
  function ( e, response, bower ) {
    if (!!e) {
      utils.fail( 'Couldn\'t find CleverStack frontend module ' + pkg[ 0 ], true );
      return def.resolve( );
    }

    if (typeof bower === "undefined") {
      return def.resolve( );
    }

    if (typeof pkg[ 1 ] === "undefined") {
      return def.resolve( bower );
    }

    request( {
      url: 'https://api.github.com/repos/' + bower.url.split( '/' ).splice( -2 ).join( '/' ).replace( '.git', '' ) + '/releases',
      json: true,
      headers: {
        'User-Agent': 'cleverstack'
      }
    }, function ( err, res, releases ) {
      var rel = releases.filter( function ( release ) {
        return releases.tag_name === pkg[ 1 ];
      } );

      if (!rel.length) {
        utils.fail( 'Couldn\'t find version ' + pkg[ 1 ] + ' for ' + pkg[ 0 ], true );
        return def.resolve( );
      }

      def.resolve( bower );
    } );
  } );

  return def.promise;
}

/**
 * Aggregates searches from NPM and Bower
 *
 * @param  {String[]} args
 * @return {Promise}
 * @api public
 */

var aggregate = exports.aggregate = function ( args ) {
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
