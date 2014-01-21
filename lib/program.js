var program = require( 'commander' )
  , path    = require( 'path' )
  , pkg     = require( path.join( __dirname, '..', 'package.json' ) );

program
  .usage( '<command> [options]' )
  .version( pkg.version );

program.on( '--help', function() {
  console.log( ' Commands:' );
  console.log( '' );
  console.log( '    downgrade [-v version] [-p path] - Downgrades a CleverStack implementation' );
  console.log( '    help - Displays this help message' );
  console.log( '    init <project> [backend|frontend] - Initialized a new project' );
  console.log( '    install <modules> - Installs a module within CleverStack' );
  console.log( '    generate <option> <name> - Generates a controller, service, model, etc. individually' );
  console.log( '    remove <modules> - Removes a module within CleverStack' );
  console.log( '    repl - Starts the CleverStack REPL' );
  console.log( '    scaffold <name> - Generates a controller, service, model, etc.' );
  console.log( '    search [query] - Searches for a cleverstack module' );
  console.log( '    server - Starts the CleverStack server' );
  console.log( '    test - Runs tests within your CleverStack environment' );
  console.log( '    upgrade [-v version] [-p path] - Upgrades a CleverStack implementation' );
  console.log( '' );
} );

program.parse( process.argv );

module.exports = program;
