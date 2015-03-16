var Promise = require( 'bluebird' )
  , async   = require( 'async' )
  , path    = require( 'path' )
  , semver  = require( 'semver' )
  , findit  = require( 'findit' );

/**
 * Finds bower/package.json file, checks for the actual name, and returns
 * the name of the module and a type (frontend or backend) module.
 *
 * @param  {Object[]} lib.utils.locations.get( )
 * @param  {String} moduleName
 * @param  {String} moduleVersion
 * @param  {String} [check=gt] Semver version satisfying ('gt' or 'lt')
 * @return {Promise}
 * @api public
 */

exports.findConfigAndVersionForModule = function( locations, moduleName, moduleVersion, check ) {
  return new Promise( function( resolve ) {

    var _module = {};

    if ( typeof check === 'undefined' || check !== 'lt' ) {
      check = 'gt';
    }

    // Detect the first location that we find..
    // and make sure the location matches npm/bower.json
    async.filterSeries(
      locations,
      function( location, next ) {
        var loc     = path.join( location.moduleDir, location.modulePath )
          , walk    = findit( loc )
          , found   = false;

        walk.on( 'directory', function( dir, stat, stop ) {
          if ( path.basename( dir ) !== 'modules' && path.dirname( dir ).split( path.sep ).splice( -1 )[ 0 ] !== 'modules' ) {
            return stop();
          }
        });

        walk.on( 'file', function( pkgFilePath ) {
          var pkgFileName = path.basename( pkgFilePath );

          if ( [ 'package.json', 'bower.json' ].indexOf( pkgFileName ) > -1 ) {
            var jsonConfig = require( pkgFilePath );

            if ( pkgFileName.indexOf( 'package.json' ) > -1 && location.name === 'frontend' ) {
              lib.utils.fail( moduleName + ' is a backend module, please install from your project\'s root directory.', true );
            } else if ( pkgFileName.indexOf( 'bower.json' ) > -1 && location.name === 'backend' ) {
              lib.utils.fail( moduleName + ' is a backend module, please install from your project\'s root directory.', true );
            } else if ( semver[ check ]( jsonConfig.version, moduleVersion ) ) {
              lib.utils.fail( moduleName + '\'s version is already ' + ( check === 'gt' ? 'greater' : 'lesser' ) + ' than ' + moduleVersion + ' (currently at version ' + jsonConfig.version + ')', true );
            } else if ( jsonConfig.name === moduleName ) {
              if ( semver.eq( jsonConfig.version, moduleVersion ) ) {
                lib.utils.fail( moduleName + ' is already at version' + jsonConfig.version, true );
              } else {
                found = true;
                _module = {
                  name: moduleName + ( moduleVersion !== '*' ? '@' + moduleVersion : '' ),
                  type:[ 'package.json' ].indexOf( pkgFileName ) > -1 ? 'backend' : 'frontend'
                };
              }
            }
          }
        });

        walk.on( 'end', function() {
          next( found );
        });
      },
      function( _location ) {
        resolve( _location.length > 0 ? _module : false );
      });
  });
};
