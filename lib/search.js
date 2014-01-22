var path    = require( 'path' )
  , Promise = require( 'bluebird' )
  , async   = require( 'async' )
  , npmconf = require( 'npmconf' )
  , semver  = require( 'semver' )
  , _       = require( 'lodash' )
  , utils   = require( path.join( __dirname, 'utils' ) )
  , RegClient       = require('npm-registry-client')
  , RegistryClient  = require( 'bower-registry-client' )
  , registry        = new RegistryClient( );

var _keywordRequired = ['cleverstack module', 'cleverstack-module', 'cleverstack seed', 'cleverstack-seed']
  , _keywordType     = ['cleverstack-backend', 'cleverstack backend', 'cleverstack-frontend', 'cleverstack frontend', 'frontend', 'backend', 'seed'];

var searchNPM = exports.npm = function ( queries ) {
  var def   = Promise.defer( )
    , repos = [];

  utils.info( 'Searching through NPM packages...' );

  npmconf.load( {}, function ( er, conf ) {
    var client = new RegClient( conf );

    async.each( queries, function ( q, next ) {
      var search = q.split( '@' );
      if (typeof search[1] === "undefined") {
        search[1] = '*';
      }

      client.get( search[0], 10000, false, true, function ( err, res ) {
        if (!!err) {
          if (err.code === 'E404') {
            return next( );
          }

          return next( err );
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
  } );
  return def.promise;
}

var searchBower = exports.bower = function ( query ) {
  var def = Promise.defer( );

  utils.info( 'Searching through Bower packages for ' + query + '...' );

  registry.search( query, function ( err, res ) {
    if (!!err) {
      return def.reject( err );
    }

    def.resolve( res );
  } );

  return def.promise;
}

var aggregate = exports.aggregate = function ( args ) {
  var def = Promise.defer( )
    , all = [];

  all.push( searchNPM( args ) );

  args.forEach( function ( arg ) {
    all.push( searchBower( arg ) );
  } );

  Promise.all( all ).then( function ( results ) {
    var npm   = results[0].map( function ( r ) { r.type = 'backend'; return r; } )
      , repos = [];

    results.shift( );

    // Bower is pretty limiting in terms of keywords, etc.
    // Note: We'll need to figure out a way to allow external frontend projects
    // to be added to seeds.. I'm fairly certain we can take Sam's idea of just fetching
    // from raw.github.com (limited to just github though...) and look into package.json
    console.log('res', results);
    results[0].forEach( function ( rep )  {
      if (!!rep.url && rep.url.match(/^git:\/\/github\.com\/(clevertech|CleverStack)\//) !== null) {
        rep.type = 'frontend';
        repos.push( rep );
      }
    } );

    def.resolve( [ npm, repos ] );
  } )
  .error( def.reject );

  return def.promise;
}
