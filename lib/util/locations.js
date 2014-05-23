var Promise = require( 'bluebird' )
  , path    = require( 'path' )
  , async   = require( 'async' )
  , fs      = require( 'fs')
  , utils   = require( path.join( __dirname, '..', 'utils' ) )
  , debug   = require('debug')('clever:install');

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

  var deferred = Promise.defer()
    , cwd      = process.cwd();

  async.waterfall(
    [
      function readDir( callback ) {
        debug( 'Reading directory with path of ' + cwd );

        fs.readdir( cwd, callback );
      },

      function isSeedInCurrentDirectory( list, callback ) {
        debug( 'Checking if directory list confirms that the current directory is a cleverstack-seed' );

        var packageJson = list.indexOf( 'package.json' ) !== -1 
              ? require( path.resolve( [ cwd, 'package.json' ].join( path.sep ) ) )
              : false;

        if ( !!packageJson && ( !!packageJson.keywords && packageJson.keywords.indexOf( 'cleverstack-seed' ) !== -1 ) ) {
          debug( 'Found a Cleverstack Seed at ' + cwd );

          callback( null, list, {
            path: cwd,
            type: !!packageJson.dependencies && !!packageJson.dependencies.express ? 'backend' : 'frontend'
          });
        } else {
          callback( null, list, false );
        }
      },

      function walkChildren( list, seedFound, callback ) {
        var newList = [];

        if ( !!seedFound ) {
          newList.push( seedFound );
        } else {
          debug( 'Walking through children to try and find seeds' );

          list.forEach( function( p ) {
            var thePath = path.resolve( path.join( cwd, p ) )
              , stats   = fs.statSync( thePath );

            if ( !!stats.isDirectory() ) {
              var packageJson = fs.readdirSync( thePath ).indexOf( 'package.json' ) !== -1 
                    ? require( path.resolve( [ thePath, 'package.json' ].join( path.sep ) ) )
                    : false;

              if ( !!packageJson && ( !!packageJson.keywords && packageJson.keywords.indexOf( 'cleverstack-seed' ) !== -1 ) ) {
                debug( 'Found a Cleverstack seed at ' + thePath );

                newList.push({
                  path: thePath,
                  type: !!packageJson.dependencies && !!packageJson.dependencies.express ? 'backend' : 'frontend'
                });
              }
            }
          });
        }

        callback( null, newList );
      },

      function reverseMatchIfStillNotFound( list, callback ) {
        var behind = cwd.split( path.sep )
          , found  = false
          , newList = [];

        if ( list.length > 0 ) {
          callback( null, list );
        } else {
          debug( 'Traversing the tree backwards to try and find seeds' );

          async.until(
            function () {
              return behind.length < 1 || found === true;
            },
            function ( next ) {
              var thePath = behind.join( path.sep )
                , stats = fs.statSync( thePath );

              if ( !!stats.isDirectory() ) {
                var packageJson = fs.readdirSync( thePath ).indexOf( 'package.json' ) !== -1 
                      ? require( path.resolve( [ thePath, 'package.json' ].join( path.sep ) ) )
                      : false;

                if ( !!packageJson && ( !!packageJson.keywords && packageJson.keywords.indexOf( 'cleverstack-seed' ) !== -1 ) ) {
                  debug( 'Found a Cleverstack seed at ' + thePath );

                  newList.push({
                    path: thePath,
                    type: !!packageJson.dependencies && !!packageJson.dependencies.express ? 'backend' : 'frontend'
                  });

                  found = true;
                } else {
                  behind.pop();
                }
              } else {
                behind.pop();
              }

              next();
            },
            function ( err ) {
              if (!!err) {
                callback( err );
              } else if ( !newList.length ) {
                callback( 'Couldn\'t find a seed directory within ' + cwd );
              } else {
                callback( null, newList );
              }
            }
          );
        }
      }
    ],
    function( err, res ) {
      !!err ? deferred.reject( err ) : deferred.resolve( res );
    }
  );

  return deferred.promise;
}

/**
 * Finds seed locations and returns an object with common properties
 *
 * @param  {Boolean} [useCWD=false] - Whether or not we should use process.cwd()
 * @return {Promise}
 * @api public
 */

var get = exports.get = function( useCWD, fn ) {
  var def = Promise.defer();

  if ( typeof useCWD === "function" ) {
    fn      = useCWD;
    useCWD  = false;
  }

  find().then( function( foundProjects ) {
    var projects         = []
      , projectTemplates = {
          backend: {
            name: 'backend',
            modulePath: 'modules'
          },
          frontend: {
            name: 'frontend',
            modulePath: path.join( 'app', 'modules' )
          }
        };

    foundProjects.forEach( function( proj ) {

      if ( projectTemplates.hasOwnProperty( proj.type ) ) {

        projectTemplates[ proj.type ].moduleDir = proj.path;
        projectTemplates[ proj.type ].useCWD    = useCWD;

        projects.push( projectTemplates[ proj.type ] );
      }

    });

    def.resolve( projects );
  });

  return def.promise;
}