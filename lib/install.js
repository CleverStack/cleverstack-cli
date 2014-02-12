var Promise   = require( 'bluebird' )
  , async     = require( 'async' )
  , path      = require( 'path' )
  , _         = require( 'lodash' )
  , utils     = require( path.join( __dirname, 'utils'    ) )
  , project   = require( path.join( __dirname, 'project'  ) )
  , search    = require( path.join( __dirname, 'search'   ) )
  , packages  = require( path.join( __dirname, 'packages' ) )
  , util      = require( path.join( __dirname, 'util'     ) );

/**
 * Launches the installation process
 * Checks for seed folders depending on CWD
 * Separates which packages we need via Bower and NPM
 * Installs the NPM/Bower modules within the seeds
 *
 * @param  {Array} repos
 * @return {Promise}
 * @api private
 */

function install ( repos ) {
  var def = Promise.defer( );

  project.useUtils( )
  .spread( function ( locations ) {
    return search.aggregate( repos ).spread( function ( npm, bower ) {
      return [ locations, npm, bower ];
    } );
  } )
  .spread( function ( locations, npm, bower ) {
    var actions = [ ]
     // todo: make this into a function...
     // todo: also make packages.locations() a prototype for .isBackend() utility functions, etc.
      , backend = _.find( locations, function ( location ) {
        return location.name === "backend";
      } )
      , frontend = _.find( locations, function ( location ) {
        return location.name === "frontend";
      } );

    if (typeof backend === "undefined" && frontend === "undefined") {
      utils.fail( 'Couldn\'t find a CleverStack seed. Please make sure that you\'re trying to install within your CleverStack project.' );
    }

    if (typeof backend === "undefined") {
      npm = [ ];
    }

    if (typeof frontend === "undefined") {
      bower = [ ];
    }

    if (npm.length < 1 && bower.length < 1) {
      utils.fail( 'No modules to install, please make sure you\'re tring to install CleverStack compatible modules and that you\'re in the correct seed folder.' );
    }

    if (npm.length > 0) {
      actions.push( packages.installWithNpm( backend, npm ) );
    }

    if (bower.length > 0) {
      actions.push( packages.installWithBower( frontend, bower ) );
    }

    Promise.all( actions )
    .then( function ( ) {
      def.resolve( [ backend, frontend, npm, bower ] );
    } )
    .catch( function ( err ) {
      def.reject( err );
    } );
  } )
  .catch( function ( err ) {
    def.reject( err );
  } );

  return def.promise;
}

function installBackendModules ( backendPath, npm ) {
  var def = Promise.defer( );

  npm = npm.map( function ( n ) {
    return n.name;
  } );

  utils.info( 'Installing any bundled dependencies if applicable... ');

  var walker = require( 'findit' )( path.join( backendPath.moduleDir, backendPath.modulePath ) )
    , dirs   = [ ];

  walker.on( 'directory', function ( dir, stat, stop ) {
    var _dirs = dir.split( path.sep )
      , _dir  = _dirs.pop( )
      , mdir  = path.dirname( dir ).split( path.sep ).pop( );

    if (mdir === "modules") {
      if (npm.indexOf( _dir ) === -1) {
        return stop( );
      }

      dirs.push( path.join( _dirs.join( path.sep ), _dir ) );
    }
  } );

  walker.on( 'end', function ( ) {
    if (dirs.length > 0) {
      async.each( dirs, function ( dir, next ) {
        util.dependencies.installBundleDeps( dir, path.join( backendPath.moduleDir, backendPath.modulePath ) )
        .then( function ( ) {
          next( );
        }, next );
      },
      function ( err ) {
        if (!!err) {
          return def.reject( err );
        }

        util.dependencies.addToMainBundleDeps( backendPath )
        .then( function ( ) {
          // needs to be a series just in case if we ask for user input/prompt
          async.eachSeries( npm, function ( module, _next ) {
            util.grunt.runTasks( backendPath.moduleDir, path.join( backendPath.moduleDir, backendPath.modulePath, module ) )
            .then( _next, _next );
          },
          function ( _err ) {
            if (!!_err) {
              return def.reject( _err );
            }

            def.resolve( );
          } );
        }, function ( err ) {
          def.reject( err );
        } )
      } );
    }
  } );

  return def.promise;
}

exports.run = function ( args ) {
  var def = Promise.defer( );

  install( args )
  .spread( function ( backendPath, frontendPath, npm /*, bower */ ) {
    var actions = [ ];

    if (npm.length > 0) {
      actions.push( installBackendModules( backendPath, npm ) );
    }

    Promise.all( actions ).then( function ( ) {
      def.resolve( );
    }, function ( err ) {
      def.reject( err );
    } );
  }, function ( err ) {
    def.reject( err );
  } );

  return def.promise;
}
