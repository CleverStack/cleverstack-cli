var path  = require( 'path' )
    , tab   = require( 'tab' )
    , _     = require( 'lodash' )
    , env   = require( path.join( __dirname, 'boot' ) ).env;

env.moduleLoader.on( 'modulesLoaded', function() {
    env.moduleLoader.initializeRoutes();
});

env.moduleLoader.on( 'routesInitialized', function() {
    var routes  = []
      , cmds    = [];

    Object.keys( env.app.routes ).forEach( function( method ) {
        routes = routes.concat( env.app.routes[ method ] );
    });

    routes = _.sortBy( routes, [ 'path', 'method' ] );

    routes.forEach( function( route ) {
        cmds.push( [ route.path, route.method.toUpperCase() ] );
    });

    tab.emitTable({
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
    });

    process.exit( 0 );
});