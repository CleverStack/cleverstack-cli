var Promise = require( 'bluebird' )
  , path    = require( 'path' )
  , async   = require( 'async' )
  , fs      = require( 'fs')
  , utils   = require( path.join( __dirname, '..', 'utils' ) );

/**
 * Finds a frontend and backend seed and determines
 * whether or not we can use Bower or NPM
 *
 * @return {Promise}
 * @api public
 */

exports.findAvailableCommands = function ( ) {
  var def = Promise.defer( );

  get( )
  .then( function ( locations ) {
    var useNPM = false
      , useBower = false;

    if (locations.length > 1) {
      useNPM    = true;
      useBower  = true;
    }
    else if (locations.length < 1) {
      utils.fail( 'Couldn\'t find any CleverStack seeds within ' + process.cwd( ) );
    }
    else {
      useNPM    = locations[ 0 ].name === "backend";
      useBower  = locations[ 0 ].name === "frontend";
    }

    var _locations = locations.filter( function ( location ) {
      return ( useNPM && useBower ) || ( useNPM && location.name === "backend" ) || ( useBower && location.name === "frontend" );
    } );

    def.resolve( [ _locations, useNPM, useBower ] );
  } );

  return def.promise;
}

/**
 * Finds seed locations within CWD
 *
 * @return {Promise}
 * @api public
 */

var find = exports.find = function( ) {
  var def = Promise.defer( );

  // As of right now... our best bet is to look forward once
  // and then backwards first match. The limitation of this
  // is that we're presuming the folders are called backend and frontend
  // todo: Enable support for any folder name

  fs.readdir( process.cwd( ), function ( err, list ) {
    if (!!err) {
      return def.reject( err );
    }

    list = list.filter( function ( f ) {
      var stats = fs.statSync( path.resolve( path.join( process.cwd( ), f ) ) );
      return stats.isDirectory( ) && [ 'frontend', 'backend' ].indexOf( f ) > -1;
    } )
    .map( function ( f ) {
      return path.resolve( path.join( process.cwd( ), f ) );
    } );

    if (list.length > 0) {
      return def.resolve( list );
    }

    var behind = process.cwd( ).split( path.sep ).reverse( )
      , found  = false;

    async.until(
      function ( ) { return behind.length < 1 || found === true; },
      function ( next ) {
        if (['frontend', 'backend'].indexOf( behind[ 0 ] ) > -1) {
          found = true;
        } else {
          behind.shift( );
        }
        next( );
      },
      function ( err ) {
        if (!!err) {
          return def.reject( err );
        }

        if (!behind.length) {
          return utils.fail( 'Couldn\'t find a seed directory within ' + process.cwd( ) );
        }

        def.resolve( [ behind.reverse( ).join( path.sep ) ] );
      }
    );
  } );

  return def.promise;
}

/**
 * Finds seed locations and returns an object with common properties
 *
 * @param  {Boolean} [useCWD=false] - Whether or not we should use process.cwd()
 * @return {Promise}
 * @api public
 */

var get = exports.get = function ( useCWD, fn ) {
  var def = Promise.defer( );

  if (typeof useCWD === "function") {
    fn      = useCWD;
    useCWD  = false;
  }

  find( ).then( function ( foundProjects ) {
    var projects         = []
    var projectTemplates = {
      backend: {
        name: 'backend',
        modulePath: 'modules'
      },
      frontend: {
        name: 'frontend',
        modulePath: path.join( 'app', 'modules' )
      }
    };

    foundProjects.forEach( function ( proj ) {
      var projectName = proj.split( path.sep ).slice( -1 )[ 0 ];

      if (projectTemplates.hasOwnProperty( projectName ) ) {
        projectTemplates[projectName].moduleDir = proj;
        projectTemplates[projectName].useCWD    = useCWD;
        projects.push( projectTemplates[projectName] );
      }
    } );

    def.resolve( projects );
  } );

  return def.promise;
}
