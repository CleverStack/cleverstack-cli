var Promise = require( 'bluebird' )
  , path    = require( 'path' )
  , async   = require( 'async' )
  , exec    = require( 'child_process' ).exec
  , fs      = Promise.promisifyAll( require( 'fs' ) )
  , install = GLOBAL.lib.install
  , _bower  = GLOBAL.lib.util.bower
  , utils   = GLOBAL.lib.utils;

Promise.longStackTraces( );

/**
 * Helper function for running clever-install if there are modules to install
 *
 * @param  {Object} projectFolder location returned by util.locations.get( )
 * @param  {String[]} modules
 * @return {Promise}
 * @api public
 */

exports.setupModules = function( projectFolder, modules ) {
  var deferred  = Promise.defer()
    , cwd       = process.cwd();

  process.chdir( projectFolder.moduleDir );

  install.run( modules )
    .then(function() {
      process.chdir( cwd );
      deferred.resolve();
    }, function ( err ) {
      process.chdir( cwd );
      deferred.reject( err );
    });

  return deferred.promise;
}

/**
 * Installs module bower components within the frontend seed's component dir
 *
 * @param  {Object} projectFolder Object returned from util.locations.get( )
 * @return {Promise}              Promise from bluebird
 * @api public
 */

exports.installBowerComponents = function ( projectFolder, programOptions ) {
  var def       = Promise.defer( )
    , bowerRC   = path.join( projectFolder.moduleDir, '.bowerrc' )
    , _bowerRC  = fs.readFileSync( bowerRC );

  _bowerRC = JSON.parse( _bowerRC );

  // if (!fs.existsSync( bowerPath ) || !fs.existsSync( bowerRC )) {
    // utils.warn( 'bower.json and .bowerrc files not found within ' + projectFolder.moduleDir + ' .. skipping...' );
  // }

  utils.info( 'Installing bower packages for ' + projectFolder.moduleDir );

  _bower.install( projectFolder.moduleDir, programOptions, function ( err ) {
    if (!!err) {
      return def.reject( err );
    }

    utils.success( 'Finished installing bower packages' );
    utils.info( 'Installing bower components for each module...' );

    async.filter( fs.readdirSync( path.join( projectFolder.moduleDir, projectFolder.modulePath ) ), function ( dir, next ) {
      fs.exists( path.join( projectFolder.moduleDir, projectFolder.modulePath, dir, 'bower.json' ), next );
    },
    function ( modules, err ) {
      if (!!err) {
        return def.reject( err );
      }

      if (modules.length < 1) {
        return def.resolve( );
      }

      async.each( modules, function ( moduleDir, fn ) {
        utils.info( 'Installing bower components for ' + moduleDir );

        _bower.install( path.join( projectFolder.moduleDir, projectFolder.modulePath, moduleDir ), {
          cwd: path.join( projectFolder.moduleDir, projectFolder.modulePath, moduleDir ),
          directory: path.relative( path.join( projectFolder.moduleDir, projectFolder.modulePath, moduleDir ), [ projectFolder.moduleDir ].concat( _bowerRC.directory.split( '/' ) ).join( path.sep ) ),
          env: process.env
        }, function ( ) {
          utils.success( 'Finished bower components for ' + moduleDir );
          fn( );
        } );
      },
      function ( _err_ ) {
        if (!!_err_) {
          return def.reject( _err_ );
        }

        def.resolve( );
      } );
    } );
  } );

  return def.promise;
}

/**
 * Looks into package.json within the seed's module directory
 * and finds each (dev)dependency and installs individually
 * due to use using the --prefix flag for NPM
 *
 * @param  {Object} project
 * @param  {String} modulePath
 * @param  {Object} programOptions program instance sent by commander
 * @return {Promise}
 * @api public
 */

exports.installModule = function ( project, modulePath, programOptions ) {
  return new Promise( function ( resolve, reject ) {
    var projectFolder = project.moduleDir;
    var moduleDir = path.join( project.moduleDir, project.modulePath );

    var jsonPath  = path.resolve( path.join( modulePath, 'package.json' ) )
      , deps      = [ ];

    if (!fs.existsSync( jsonPath )) {
      return resolve( );
    }

    var jsonFile = require( jsonPath );

    jsonFile.dependencies     = jsonFile.dependencies     || {};
    jsonFile.devDependencies  = jsonFile.devDependencies  || {};

    Object.keys( jsonFile.dependencies ).forEach( function ( k ) {
      deps.push( k + '@' + jsonFile.dependencies[k] );
    } );

    Object.keys( jsonFile.devDependencies ).forEach( function ( k ) {
      deps.push( k + '@' + jsonFile.devDependencies[k] );
    } );

    utils.info( '  Installing NPM packages for ' + modulePath.split( path.sep ).pop() + '...' );

    // we need series here in order to prevent NPM from overwriting packages
    async.eachSeries( deps, function ( dep, _next ) {
      exec( 'npm install ' + dep + ' --prefix ' + projectFolder, { cwd: moduleDir }, function ( err ) {
        if (!!err) {
          return _next( err );
        }

        _next( );
      } );
    },
    function ( err ) {
      if (!!err) {
        return reject( err );
      }

      utils.success( '  Finished installing NPM packages for ' + modulePath.split( path.sep ).pop() + '...' );

      var bowerPath = path.resolve( path.join( projectFolder, 'bower.json' ) );

      // backend folder?
      if (!fs.existsSync( bowerPath ) ) {
        return resolve( );
      }

      utils.info( 'Installing bower packages for ' + modulePath.split( path.sep ).pop() + '...' );

      _bower.install( modulePath, programOptions, function ( _err ) {
        if (!!_err) {
          return reject( _err );
        }

        utils.success( 'Finished installing bower packages.' );
        resolve( );
      } );
    } );
  } );
}
