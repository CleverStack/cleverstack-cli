var request = require( 'request' )
  , Promise = require( 'bluebird' )
  , zlib    = require( 'zlib' )
  , async   = require( 'async' )
  , path    = require( 'path' )
  , fs      = require( 'fs' )
  , ncp     = require( 'ncp' )
  , rimraf  = require( 'rimraf' )
  , semver  = require( 'semver' )
  , findit  = require( 'findit' )
  , tar     = require( 'tar' )
  , project = require( path.join( __dirname, 'project' ) )
  , utils   = require( path.join( __dirname, 'utils' ) )

/**
 * Downloads from GitHub or the optional url param
 * then it will unzip and extract into dir
 *
 * @param  {Object} pkg
 * @param  {String=} url
 * @param  {String} dir
 * @return {Promise}
 * @api public
 */

var get = exports.get = function ( pkg, url, dir ) {
  var def = Promise.defer( );

  if (arguments.length < 3) {
    var name = pkg.name.split( '@' )[ 0 ];
    dir = url;
    url = 'https://api.github.com/repos/' + pkg.owner + '/' + name + '/tarball/master';
  }

  var Pkg = [ ];
  if (pkg.name.indexOf( '@' ) > -1) {
    Pkg = pkg.name.split( '@' );
  }
  else if (pkg.hasOwnProperty( 'version' ) && pkg.hasOwnProperty( 'bower' ) && pkg.bower === true) {
    Pkg = [pkg.name, pkg.version];
  }

  if (Pkg.length > 0) {
    url = 'https://github.com/' + pkg.owner + '/' + Pkg[ 0 ] + '/archive/' + Pkg[ 1 ] + '.tar.gz';
  }

  request( {
    url: url,
    rejectUnauthorized: false,
    method: 'GET',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip,deflate,sdch',
      'Accept-Language': 'en-US,en;q=0.8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'User-Agent': 'cleverstack'
    },
    strictSSL: false,
    secureOptions: require( 'constants' ).SSL_OP_NO_TLSv1_2,
    agentOptions: {
      secureOptions: require( 'constants' ).SSL_OP_NO_TLSv1_2
    }
  } )
  .pipe( zlib.Unzip( ) )
  .pipe( tar.Extract( { strip: 1, path: dir } ) )
  .on( 'error', function ( err ) {
    def.reject( err );
  } )
  .on( 'end', function ( ) {
    def.resolve( );
  } );

  return def.promise;
}

/**
 * Finds bower/package.json file, checks for the actual name, and returns
 * the name of the module and a type (frontend or backend) module.
 *
 * @param  {Object[]} locations
 * @param  {String} moduleName
 * @param  {String} moduleVersion
 * @param  {String} [check=gt] Semver version satisfying ('gt' or 'lt')
 * @return {Promise}
 * @api public
 */

exports.findConfigAndVersionForModule = function ( locations, moduleName, moduleVersion, check ) {
  var def = Promise.defer( );

  if (typeof check === "undefined" || check !== "lt") {
    check = 'gt';
  }

  // Detect the first location that we find..
  // and make sure the location matches npm/bower.json
  async.filter( locations, function ( location, next ) {
    var loc   = path.join( location.moduleDir, location.modulePath )
      , walk  = findit( loc )
      , found = false;

    walk.on( 'directory', function ( dir, stat, stop ) {
      if (path.basename( dir ) !== "modules" && path.dirname( dir ).split( path.sep ).splice( -1 )[ 0 ] !== "modules") {
        return stop( );
      }
    } );

    walk.on( 'file', function ( pkgFilePath ) {
      var pkgFileName = path.basename( pkgFilePath );

      if ( [ 'package.json', 'bower.json' ].indexOf( pkgFileName ) > -1) {
        var jsonConfig = require( pkgFilePath );

        if (pkgFileName.indexOf( 'package.json' ) > -1 && location.name === "frontend") {
          utils.fail( moduleName + ' is a backend module, please install from your project\'s root directory.', true );
        }
        else if (pkgFileName.indexOf( 'bower.json' ) > -1 && location.name === "backend") {
          utils.fail( moduleName + ' is a backend module, please install from your project\'s root directory.', true );
        }
        else if (semver[ check ]( jsonConfig.version, moduleVersion )) {
          utils.fail( moduleName + '\'s version is already ' + (check === "gt" ? 'greater' : 'lesser' ) + ' than ' + moduleVersion + ' (currently at version ' + jsonConfig.version + ')', true );
        }
        else if (semver.eq( jsonConfig.version, moduleVersion )) {
          utils.fail( moduleName + ' is already at version' + jsonConfig.version, true );
        }
        else if (jsonConfig.name === moduleName) {
          found = true;
          module = {
            name: moduleName + ( moduleVersion !== "*" ? '@' + moduleVersion : '' ),
            type:[ 'package.json' ].indexOf( pkgFileName ) > -1 ? 'backend' : 'frontend'
          };
        }
      }
    } );

    walk.on( 'end', function ( ) {
      next( found );
    } );
  },
  function ( _location ) {
    def.resolve( _location.length > 0 ? module : false );
  } );

  return def.promise;
}

/**
 * Installs bower components into the correct path for
 * the frontend seed
 *
 * @param  {Object} location
 * @param  {Array} packages
 * @return {Promise}
 * @api public
 */

var installFrontendModules = exports.installFrontendModules = function ( location, packages ) {
  var def = Promise.defer( );

  async.each( packages, function ( pkg, next ) {
    utils.info( 'Checking bower.json file for instructions within ' + pkg.name);

    var bowerFile = path.join( location.moduleDir, location.modulePath, pkg.name, 'bower.json' );

    if (!fs.existsSync( bowerFile )) {
      return next( );
    }

    var bowerJson       = require( bowerFile )
      , name            = typeof bowerJson.rename === "string" ? bowerJson.rename : pkg.name
      , moduleLocation  = path.resolve( path.join( location.moduleDir, location.modulePath, name ) );

    // todo: ask for confirmation first...
    // if (fs.existsSync( moduleLocation ) || path.dirname( bowerFile ) === moduleLocation) {
    //   return next( );
    // }

    ncp( path.dirname( bowerFile ), moduleLocation, function ( err ) {
      if (!!err) {
        return def.reject( err );
      }

      rimraf( path.dirname( bowerFile ), function ( err ) {
        if (!!err) {
          return def.reject( err );
        }

        utils.success( 'Finished renaming ' + pkg.name );
        next( );
      } );
    } );
  },
  function ( err ) {
    if (!!err) {
      return def.reject( err );
    }

    def.resolve( );
  } );

  return def.promise;
}

/**
 * Installs Bower packages within the frontend seed.
 *
 * @param  {Object} location
 * @param  {Array} packages
 * @return {Promise}
 * @api public
 */

exports.installWithBower = function ( location, packages ) {
  var def     = Promise.defer( );

  async.each( packages, function ( pkg, next ) {
    if (!pkg.hasOwnProperty( 'url' )) {
      return next( );
    }

    var dir = path.join( location.moduleDir, location.modulePath, pkg.name );

    get( pkg, dir )
    .then( function ( ) {
      utils.success( 'Installed ' + pkg.name );
      next( );
    }, function ( err ) {
      next( err );
    } );
  }, function ( err ) {
    if (!!err) {
      return def.reject( err );
    }

    installFrontendModules( location, packages )
    .then( function ( ) {
      def.resolve( );
    }, function ( err ) {
      def.reject( err );
    } );
  } );

  return def.promise;
}

/**
 * Installs NPM packages (from modules) and installs any dependencies
 * The reason why we need to do each package one-by-one
 * is due to the fact that we need to utilize the --prefix
 * npm option. Which sets the current node_module path
 *
 * @param  {Object} location
 * @param  {Array} packages
 * @return {Promise}
 * @api public
 */

// todo: Strip out the need for npm install and directly use the installWithNPM() function
var installNpmModules = exports.installNpmModules = function ( location, packages ) {
  var def = Promise.defer( );

  async.each( packages, function ( pkg, next ) {
    project.installModule( location, path.join( location.moduleDir, location.modulePath, pkg.name ) )
    .then( function ( ) {
      next( )
    }, next );
  },
  function ( err ) {
    if (!!err) {
      return def.reject( err );
    }

    utils.info( 'Finished installing dependencies' );
    def.resolve( );
  } );

  return def.promise;
}

/**
 * Installs NPM modules through tarball links
 *
 * @param  {Objects} location
 * @param  {Array} packages
 * @return {Promise}
 * @api public
 */

exports.installWithNpm = function ( location, packages ) {
  var def   = Promise.defer( );

  async.each( packages, function ( pkg, next ) {
    if (!pkg.hasOwnProperty( 'dist' ) || !pkg.dist.hasOwnProperty( 'tarball' )) {
      return next( );
    }

    get( pkg, pkg.dist.tarball, path.join( location.moduleDir, location.modulePath, pkg.name ) )
    .then( function ( ) {
      utils.success( 'Installed ' + pkg.name );
      next( );
    }, next );
  }, function ( err ) {
    if (!!err) {
      return def.reject( err );
    }

    installNpmModules( location, packages )
    .then( function ( ) {
      def.resolve( );
    } )
    .catch( function ( err ) {
      def.reject( err );
    } );
  } );

  return def.promise;
}
