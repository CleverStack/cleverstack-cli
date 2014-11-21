var Promise = require( 'bluebird' )
    , path    = require( 'path' )
    , async   = require( 'async' )
    , fs      = require( 'fs');

/**
 * Finds a frontend and backend seed and determines
 * whether or not we can use Bower or NPM
 *
 * @return {Promise}
 * @api public
 */

exports.findAvailableCommands = function ( ) {
    return new Promise( function( resolve, reject ) {
        get()
            .then( function( locations ) {
                var useNPM    = false
                  , useBower  = false;

                if ( locations.length > 1 ) {
                    useNPM    = true;
                    useBower  = true;
                } else if ( locations.length < 1 ) {
                    lib.utils.fail( 'Couldn\'t find any CleverStack seeds within ' + process.cwd( ) );
                } else {
                    useNPM    = locations[ 0 ].name === "backend";
                    useBower  = locations[ 0 ].name === "frontend";
                }

                var _locations = locations.filter( function( location ) {
                    return ( useNPM && useBower ) || ( useNPM && location.name === "backend" ) || ( useBower && location.name === "frontend" );
                });

                resolve( [ _locations, useNPM, useBower ] );
            })
            .catch( function( err ) {
                reject( err );
            });
    });
}

/**
 * Finds seed locations within CWD
 *
 * @return {Promise}
 * @api public
 */
var find = exports.find = function() {
    return new Promise( function( resolve, reject ) {
        var cwd      = process.cwd();

        lib.utils.running( 'Finding seeds to target...' );
        lib.utils.info( '  Finding seeds to target...' );

        async.waterfall(
            [
                function readDir( callback ) {
                    fs.readdir( cwd, callback );
                },

                function isSeedInCurrentDirectory( list, callback ) {
                    if ( program.verbose ) {
                        lib.utils.info( [ '  Checking ', cwd, ' for seeds to target...' ].join( '' ) );
                    }

                    var packageJson = list.indexOf( 'package.json' ) !== -1 ? require( path.resolve( [ cwd, 'package.json' ].join( path.sep ) ) ) : false
                      , isCleverStack = !!packageJson && !!packageJson.author && !!packageJson.author.name &&  packageJson.author.name.toLowerCase() === 'cleverstack'
                      , isNodeSeed = isCleverStack && packageJson.name === 'node-seed'
                      , isAngularSeed = isCleverStack && packageJson.name === 'angular-seed';

                    if ( isCleverStack && ( isNodeSeed || isAngularSeed ) ) {

                        lib.utils.success( [ '    Found CleverStack ', ( isNodeSeed ? 'Backend (node' : 'Frontend (angular' ), '-seed)...' ].join( '' ) );

                        callback( null, list, {
                            path: cwd,
                            type: isNodeSeed ? 'backend' : 'frontend'
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
                        if ( program.verbose ) {
                            lib.utils.info( [ '    Walking through folders in ', cwd, ' to find seeds to target...' ].join( '' ) );
                        }

                        list.forEach( function( p ) {
                            var thePath = path.resolve( path.join( cwd, p ) )
                              , stats   = fs.statSync( thePath );

                            if ( !!stats.isDirectory() ) {
                                var packageJson = fs.readdirSync( thePath ).indexOf( 'package.json' ) !== -1 
                                            ? require( path.resolve( [ thePath, 'package.json' ].join( path.sep ) ) )
                                            : false
                                  , isCleverStack = !!packageJson && !!packageJson.author && !!packageJson.author.name &&  packageJson.author.name.toLowerCase() === 'cleverstack'
                                  , isNodeSeed = isCleverStack && packageJson.name === 'node-seed'
                                  , isAngularSeed = isCleverStack && packageJson.name === 'angular-seed';

                                if ( isCleverStack && ( isNodeSeed || isAngularSeed ) ) {
                                    lib.utils.success( [ '    Found CleverStack ', ( isNodeSeed ? 'Backend (node' : 'Frontend (angular' ), '-seed) in ', thePath ,'...' ].join( '' ) );

                                    newList.push({
                                        path: thePath,
                                        type: isNodeSeed ? 'backend' : 'frontend'
                                    });
                                }
                            }
                        });
                    }

                    callback( null, newList );
                },

                function reverseMatchIfStillNotFound( list, callback ) {
                    var behind  = cwd.split( path.sep )
                      , found   = false
                      , newList = [];

                    if ( list.length > 0 ) {
                        callback( null, list );
                    } else {
                        if ( program.verbose ) {
                            lib.utils.info( [ '    Traversing the tree backwards from ', cwd, ' to find seeds to target...' ].join( '' ) );
                        }

                        async.until(
                            function() {
                                return behind.length < 2 || found === true;
                            },
                            function ( next ) {
                                var thePath = behind.join( path.sep )
                                    , stats = fs.statSync( thePath );

                                if ( !!stats.isDirectory() ) {
                                    var packageJson = fs.readdirSync( thePath ).indexOf( 'package.json' ) !== -1 ? require( path.resolve( [ thePath, 'package.json' ].join( path.sep ) ) ) : false
                                      , isCleverStack = !!packageJson && !!packageJson.author && !!packageJson.author.name &&  packageJson.author.name.toLowerCase() === 'cleverstack'
                                      , isNodeSeed = isCleverStack && packageJson.name === 'node-seed'
                                      , isAngularSeed = isCleverStack && packageJson.name === 'angular-seed';

                                    if ( isCleverStack && ( isNodeSeed || isAngularSeed ) ) {
                                        lib.utils.success( [ '    Found CleverStack ', ( isNodeSeed ? 'Backend (node' : 'Frontend (angular' ), '-seed) in ', thePath ,'...' ].join( '' ) );

                                        newList.push({
                                            path: thePath,
                                            type: isNodeSeed ? 'backend' : 'frontend'
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
                                if ( !!err ) {
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
                !!err ? reject( err ) : resolve( res );
            }
        );
    });
}

/**
 * Finds seed locations and returns an object with common properties
 *
 * @param  {Boolean} [useCWD=false] - Whether or not we should use process.cwd()
 * @return {Promise}
 * @api public
 */

var get = exports.get = function( useCWD, fn ) {
    return new Promise( function( resolve, reject ) {
        if ( typeof useCWD === "function" ) {
            fn      = useCWD;
            useCWD  = false;
        }

        find()
            .then( function( foundProjects ) {
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

                resolve( projects );
            })
            .catch(function( err ) {
                reject( err );
            });
    });
}