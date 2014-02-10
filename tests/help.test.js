var chai    = require( 'chai' )
  , expect  = chai.expect
  , exec    = require('child_process').exec
  , path    = require( 'path' )
  , binPath = path.join( __dirname, '..', 'bin' );

chai.Assertion.includeStack = true;

describe( 'Help documentation', function( ) {
  it( 'should be able to list the help documentation for help', function ( done ) {
    exec( path.join( binPath, 'clever-help -h' ), function ( err, stdout, stderr ) {
      expect( err ).to.be.null;
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
      done( );
    } );
  } );

  it( 'should be able to list the help documentation for build', function ( done ) {
    exec( path.join( binPath, 'clever-build -h' ), function ( err, stdout, stderr ) {
      expect( err ).to.be.null;
      expect( stderr ).to.equal( '' );
      expect( stdout ).to.match( new RegExp( [
        '',
        '  Usage: clever-build \\[options\\]',
        '',
        '  Options:',
        '',
        '    -h, --help     output usage information',
        '    -V, --version  output the version number',
        '',
        '  Example:',
        '    clever build',
        '',
        ''
      ].join( '\\n' ) ) );
      done( );
    } );
  } );

  it( 'should be able to list the help documentation for downgrade', function ( done ) {
    exec( path.join( binPath, 'clever-downgrade -h' ), function ( err, stdout, stderr ) {
      expect( err ).to.be.null;
      expect( stderr ).to.equal( '' );
      expect( stdout ).to.match( new RegExp( [
        '',
        '  Usage: clever-downgrade \\[options\\]',
        '',
        '  Options:',
        '',
        '    -h, --help     output usage information',
        '    -V, --version  output the version number',
        '',
        '  Examples:',
        '',
        '    clever downgrade clever-orm',
        '    clever downgrade clever-orm@0.0.1 clever-datatables@0.0.1',
        '    clever downgrade backend',
        '    clever downgrade frontend',
        '',
        ''
      ].join( '\\n' ) ) );
      done( );
    } );
  } );

  it( 'should be able to list the help documentation for init', function ( done ) {
    exec( path.join( binPath, 'clever-init -h' ), function ( err, stdout, stderr ) {
      expect( err ).to.be.null;
      expect( stderr ).to.equal( '' );

      expect( stdout ).to.match( new RegExp( [
        '',
        '  Usage: clever-init \\[options\\] \\[command\\]',
        '',
        '  Commands:',
        '',
        '    <project>               Creates a project named <project>',
        '',
        '  Options:',
        '',
        '    -h, --help         output usage information',
        '    --skip-protractor  Skips installing protractor',
        '    -V, --version      output the version number',
        '',
        '  Examples:',
        '    clever init my-project',
        '    clever init project-frontend frontend',
        '    clever init my-project-everything backend frontend',
        '',
        '  Installing specific versions:',
        '    clever init my-project backend\\@<version>',
        '    clever init my-project frontend\\@<version>',
        '',
        ''
      ].join( '\\n' ) ) );
      done( );
    } );
  } );

  it( 'should be able to list the help documentation for install', function ( done ) {
    exec( path.join( binPath, 'clever-install -h' ), function ( err, stdout, stderr ) {
      expect( err ).to.be.null;
      expect( stderr ).to.equal( '' );
      expect( stdout ).to.match( new RegExp( [
        '',
        '  Usage: clever-install \\[options\\] \\[modules ...\\]',
        '',
        '  Options:',
        '',
        '    -h, --help                 output usage information',
        '    -V, --version              output the version number',
        '    -v, --versions \\[versions\\]  Install a specific package version.',
        '',
        '  Examples:',
        '    clever install clever-background-tasks',
        '    clever install clever-background-tasks@0.0.1',
        '',
        ''
      ].join( '\\n' ) ) );
      done( );
    } );
  } );

  it( 'should be able to list the help documentation for generate', function ( done ) {
    exec( path.join( binPath, 'clever-generate -h' ), function ( err, stdout, stderr ) {
      expect( err ).to.be.null;
      expect( stderr ).to.equal( '' );
      expect( stdout ).to.match( new RegExp( [
        '',
        '  Usage: clever-generate \\[options\\] \\[command\\]',
        '',
        '  Commands:',
        '',
        '    service <name>         Generates a service as <name> within .*services',
        '    services <names>       Generates services specified with <name ...> within .*services',
        '    controller <name>      Generates a controller as <name> within .*controllers',
        '    controllers <names>    Generates controllers specified with <name ...> within .*controllers',
        '    model <name>           Generates a model as <name> within .*models',
        '    models <names>         Generates models specified with <name ...> within .*models',
        '    task <name>            Generates a task as <name> within .*tasks',
        '    tasks <names>          Generates tasks specified with <name ...> within .*tasks',
        '    view <name>            Generates a view as <name> within .*views',
        '    views <names>          Generates views specified with <name ...> within .*views',
        '    factory <name>         Generates a factory as <name> within .*factories',
        '    factories <names>      Generates factories specified with <name ...> within .*factories',
        '    service <name>         Generates a service as <name> within .*services',
        '    services <names>       Generates services specified with <name ...> within .*services',
        '    directive <name>       Generates a directive as <name> within .*directives',
        '    directives <names>     Generates directives specified with <name ...> within .*directives',
        '    test \\[options\\] <name>  Generates a test t as <name> within .*tests',
        '    tests \\[options\\] <names> Generates test specified with <name ...> within .*tests',
        '',
        '  Options:',
        '',
        '    -h, --help     output usage information',
        '    -V, --version  output the version number',
        '',
        '  Example:',
        '',
        '    clever generate model users',
        '    clever generate controller users',
        '    clever g controller users',
        '    clever g controllers users auth email',
        '',
        ''
      ].join( '\\n' ) ) );
      done( );
    } );
  } );

  it( 'should be able to list the help documentation for list', function ( done ) {
    exec( path.join( binPath, 'clever-list -h' ), function ( err, stdout, stderr ) {
      expect( err ).to.be.null;
      expect( stderr ).to.equal( '' );
      expect( stdout ).to.match( new RegExp( [
        '',
        '  Usage: clever-list \\[options\\]',
        '',
        '  Options:',
        '',
        '    -h, --help     output usage information',
        '    -V, --version  output the version number',
        '',
        '  Example:',
        '    clever list',
        '',
        ''
      ].join( '\\n' ) ) );
      done( );
    } );
  } );

  it( 'should be able to list the help documentation for new', function ( done ) {
    exec( path.join( binPath, 'clever-new -h' ), function ( err, stdout, stderr ) {
      expect( err ).to.be.null;
      expect( stderr ).to.equal( '' );
      expect( stdout ).to.match( new RegExp( [
        '',
        '  Usage: clever-new \\[options\\] <name>',
        '',
        '  Options:',
        '',
        '    -h, --help       output usage information',
        '    -V, --version    output the version number',
        '    --no-service     Disables generating a service.',
        '    --no-controller  Disables generating a controller.',
        '    --no-model       Disables generating a model.',
        '    --no-task        Disables generating a task.',
        '    --no-test        Disables generating a test.',
        '',
        '  Example:',
        '    clever new my_module',
        '    clever new myModule',
        '',
        ''
      ].join( '\\n' ) ) );
      done( );
    } );
  } );

  it( 'should be able to list the help documentation for remove', function ( done ) {
    exec( path.join( binPath, 'clever-remove -h' ), function ( err, stdout, stderr ) {
      expect( err ).to.be.null;
      expect( stderr ).to.equal( '' );
      expect( stdout ).to.match( new RegExp( [
        '',
        '  Usage: clever-remove \\[options\\] \\[modules ...\\]',
        '',
        '  Options:',
        '',
        '    -h, --help     output usage information',
        '    -V, --version  output the version number',
        '',
        '  Examples:',
        '    clever remove clever-background-tasks',
        '    clever remove auth clever-background-tasks',
        '',
        ''
      ].join( '\\n' ) ) );
      done( );
    } );
  } );

  it( 'should be able to list the help documentation for scaffold', function ( done ) {
    exec( path.join( binPath, 'clever-scaffold -h' ), function ( err, stdout, stderr ) {
      expect( err ).to.be.null;
      expect( stderr ).to.equal( '' );
      expect( stdout ).to.match( new RegExp( [
        '',
        '  Usage: clever-scaffold \\[options\\] <name>',
        '',
        '  Options:',
        '',
        '    -h, --help       output usage information',
        '    -V, --version    output the version number',
        '    --no-service     Disables generating a service.',
        '    --no-controller  Disables generating a controller.',
        '    --no-model       Disables generating a model.',
        '    --no-task        Disables generating a task.',
        '    --no-test        Disables generating a test.',
        '',
        '  Note:',
        '    Scaffold will generate templates within .*',
        '    If you wish to generate an entire model use clever new <name>',
        '',
        '  Example:',
        '    clever scaffold my_component',
        '    clever scaffold myComponent',
        '',
        ''
      ].join( '\\n' ) ) );
      done( );
    } );
  } );

  it( 'should be able to list the help documentation for search', function ( done ) {
    exec( path.join( binPath, 'clever-search -h' ), function ( err, stdout, stderr ) {
      expect( err ).to.be.null;
      expect( stderr ).to.equal( '' );
      expect( stdout ).to.match( new RegExp( [
        '',
        '  Usage: clever-search \\[options\\]',
        '',
        '  Options:',
        '',
        '    -h, --help     output usage information',
        '    -V, --version  output the version number',
        '',
        '  Examples:',
        '    clever search users',
        '    clever search users auth email',
        '',
        ''
      ].join( '\\n' ) ) );
      done( );
    } );
  } );

  it( 'should be able to list the help documentation for setup', function ( done ) {
    exec( path.join( binPath, 'clever-setup -h' ), function ( err, stdout, stderr ) {
      expect( err ).to.be.null;
      expect( stderr ).to.equal( '' );
      expect( stdout ).to.match( new RegExp( [
        '',
        '  Usage: clever-setup \\[options\\]',
        '',
        '  Options:',
        '',
        '    -h, --help         output usage information',
        '    --skip-protractor  Skips installing protractor',
        '    -V, --version      output the version number',
        '',
        '  Description:',
        '',
        '    Installs all NPM and Bower components for each module as well as building bundleDependencies.',
        '    This command will also install Protractor unless explicitly skipping.',
        '',
        '  Examples:',
        '',
        '    clever setup',
        '',
        ''
      ].join( '\\n' ) ) );
      done( );
    } );
  } );

  it( 'should be able to list the help documentation for server', function ( done ) {
    exec( path.join( binPath, 'clever-server -h' ), function ( err, stdout, stderr ) {
      expect( err ).to.be.null;
      expect( stderr ).to.equal( '' );
      expect( stdout ).to.match( new RegExp( [
        '',
        '  Usage: clever-server \\[options\\]',
        '',
        '  Options:',
        '',
        '    -h, --help         output usage information',
        '    -V, --version      output the version number',
        '    -x, --host \\[host\\]  Set the host for grunt server',
        '    -p, --port \\[port\\]  Set the port for grunt server',
        '',
        '  Example:',
        '    clever server',
        '    clever --host 10.0.0.0 server',
        '    clever --port 7777 server',
        '',
        ''
      ].join( '\\n' ) ) );
      done( );
    } );
  } );

  it( 'should be able to list the help documentation for test', function ( done ) {
    exec( path.join( binPath, 'clever-test -h' ), function ( err, stdout, stderr ) {
      expect( err ).to.be.null;
      expect( stderr ).to.equal( '' );
      expect( stdout ).to.match( new RegExp( [
        '',
        '  Usage: clever-test \\[options\\] \\[command\\]',
        '',
        '  Commands:',
        '',
        '    e2e                    Runs e2e tests',
        '    unit                   Runs unit tests',
        '    coverage               Generates unit test coverage reports.',
        '',
        '  Options:',
        '',
        '    -h, --help     output usage information',
        '    -V, --version  output the version number',
        '',
        '  Examples:',
        '',
        '    clever test coverage',
        '    clever test e2e',
        '    clever test unit',
        '',
        ''
      ].join( '\\n' ) ) );
      done( );
    } );
  } );

  it( 'should be able to list the help documentation for upgrade', function ( done ) {
    exec( path.join( binPath, 'clever-upgrade -h' ), function ( err, stdout, stderr ) {
      expect( err ).to.be.null;
      expect( stderr ).to.equal( '' );
      expect( stdout ).to.match( new RegExp( [
        '',
        '  Usage: clever-upgrade \\[options\\]',
        '',
        '  Options:',
        '',
        '    -h, --help     output usage information',
        '    -V, --version  output the version number',
        '',
        '  Examples:',
        '',
        '    clever upgrade clever-orm',
        '    clever upgrade clever-orm@0.0.3 clever-datatables@0.0.2',
        '    clever upgrade backend',
        '    clever upgrade frontend',
        '',
        ''
      ].join( '\\n' ) ) );
      done( );
    } );
  } );
} );
