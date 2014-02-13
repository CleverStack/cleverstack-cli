var path  = require( 'path' )
  , tab   = require( 'tab' )
  , fs    = require( 'fs' )
  , _     = require( 'lodash' )
  , lib   = require( process.env.libDir );

var utils
  , tryPath = path.resolve( path.join( process.env.projectDir, 'lib', 'utils' ) );

if (fs.existsSync( tryPath ) ) {
  try {
    utils = require( tryPath );
  } catch ( _error ) {
    if (_error.code === "ENOENT" && _error.path.match(/lib\.json$/) !== null) {
      lib.utils.fail( 'CleverStack couldn\'t find the environment configuration file. Please make sure you set your NODE_ENV envrionment variable.' );
    }
  }
}

if (utils === null) {
  lib.utils.fail( 'Couldn\'t find the backend CleverStack directory! Possible reasons could include:\n* Not running the command within the root folder of the project\n* Not setting the correct NODE_PATH environment variable' );
}

// Bootstrap the environment
var env = utils.bootstrapEnv( );

// Load all the modules
try {
  env.moduleLoader.loadModules( process.env );
} catch ( _error ) {
  if (_error.code === "MODULE_NOT_FOUND") {
    lib.utils.fail( 'Couldn\'t find the backend CleverStack directory! Possible reasons could include:\n* Not running the command within the root folder of the project\n* Not setting the correct NODE_PATH environment variable' );
  }
}

env.moduleLoader.initializeRoutes( injector );

var routes  = [ ]
  , cmds    = [ ];

Object.keys( env.app.routes ).forEach( function ( method ) {
  routes = routes.concat( env.app.routes[ method ] );
} );

routes = _.sortBy( routes, [ 'path', 'method' ] );

routes.forEach( function ( route ) {
  cmds.push( [ route.path, route.method.toUpperCase( ) ] );
} );

tab.emitTable( {
  columns: [
    {
      label: 'Path',
      align: 'left',
      width: 40
    },
    {
      label: 'Method',
      align: 'left'
    }
  ],
  // omitHeader: true,
  rows: cmds
} );

process.exit( 0 );
