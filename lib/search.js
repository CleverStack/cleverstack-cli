var path    = require( 'path' )
  , Promise = require( 'bluebird' )
  , async   = require( 'async' )
  , semver  = require( 'semver' )
  , _       = require( 'lodash' )
  , request = require( 'request' )
  , utils   = require( path.join( __dirname, 'utils' ) );

var _keywordRequired = ['cleverstack module', 'cleverstack-module', 'cleverstack seed', 'cleverstack-seed'];

function searchNPMRegistry ( queries ) {
  var def = Promise.defer( )
    , repos = [];

  async.each( queries, function ( q, next ) {
    var search = q.split( '@' );
    if (typeof search[1] === "undefined") {
      search[1] = '*';
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
      var maxVersion = semver.maxSatisfying( versions, search[1] );

      var pkg = res.versions[maxVersion];
      if (typeof pkg === "undefined") {
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

var list = exports.list = function ( ) {
  var def = Promise.defer( );

  request.get( {
    url: 'https://registry.npmjs.org/-/_view/byKeyword?startkey=["cleverstack"]&endkey=["cleverstack",{}]&group_level=2',
    json: true
  },
  function ( err, res, body ) {
    var rows = body.rows.map( function ( r ) {
      return r.key[1];
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

var searchBower = exports.bower = function ( query ) {
  var def = Promise.defer( );

  utils.info( 'Searching through Bower packages for ' + query + '...' );

  request( {
    url: 'https://bower.herokuapp.com/packages/' + encodeURIComponent( query ),
    json: true
  },
  function ( e, response, bower ) {
    if (!!e) {
      return def.reject( e );
    }

    def.resolve( bower );
  } );

  return def.promise;
}

var aggregate = exports.aggregate = function ( args ) {
  var def = Promise.defer( )
    , all = [];

  all.push( searchNPM( args ) );
  all.push( listBower( ) );

  args.forEach( function ( arg ) {
    all.push( searchBower( arg ) );
  } );

  Promise.all( all ).then( function ( results ) {
    var npm   = results[0].map( function ( r ) { r.type = 'backend'; return r; } )
      , keys  = results[1]
      , repos = [];

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
