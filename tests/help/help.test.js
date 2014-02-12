var chai    = require( 'chai' )
  , expect  = chai.expect
  , exec    = require('child_process').exec
  , path    = require( 'path' )
  , binPath = path.join( __dirname, '..', '..', 'bin' );

chai.Assertion.includeStack = true;

describe( 'Help documentation', function( ) {
  it( 'should be able to list the help documentation for help', function ( done ) {
    exec( path.join( binPath, 'clever-help -h' ), function ( err, stdout, stderr ) {
      expect( stderr ).to.equal( '' );
      expect( stdout ).to.match( new RegExp( [
        '',
        '  Usage: clever-help <command> \\[options\\]',
        '',
        '  Options:',
        '',
        '    -h, --help     output usage information',
        '    -V, --version  output the version number',
        '',
        '  Commands:',
        '',
        '    build - Builds production-ready code for the frontend seed',
        '    downgrade - Downgrades a CleverStack implementation',
        '    help - Displays this help message',
        '    init <project> \\[backend|frontend\\] - Initialized a new project',
        '    install <modules> - Installs a module within CleverStack',
        '    generate <option> <name> - Generates a controller, service, model, etc. individually',
        '    list - Lists all of the available CleverStack modules',
        '    new <name> - Scaffolds into a specific directory called <name>',
        '    remove <modules> - Removes a module within CleverStack',
        '    repl - Starts the CleverStack REPL',
        '    scaffold <name> - Generates a controller, service, model, etc.',
        '    search [query] - Searches for a cleverstack module',
        '    setup - Installs NPM & Bower packages for each module and adds modules to bundleDependencies',
        '    server - Starts the CleverStack server',
        '    test - Runs tests within your CleverStack environment',
        '    upgrade - Upgrades a CleverStack implementation',
        '',
        ''
      ].join( '\\n' ) ) );
      done( err );
    } );
  } );
} );
