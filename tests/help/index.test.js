var chai    = require( 'chai' )
  , expect  = chai.expect
  , exec    = require( 'child_process' ).exec
  , path    = require( 'path' )
  , binPath = path.join( __dirname, '..', '..', 'bin' )
  , keg     = {
    build:      require( path.join( __dirname, 'build' ) ),
    downgrade:  require( path.join( __dirname, 'downgrade' ) ),
    generate:   require( path.join( __dirname, 'generate' ) ),
    help:       require( path.join( __dirname, 'help' ) ),
    init:       require( path.join( __dirname, 'init' ) ),
    install:    require( path.join( __dirname, 'install' ) ),
    list:       require( path.join( __dirname, 'list') ),
    new:        require( path.join( __dirname, 'new' ) ),
    remove:     require( path.join( __dirname, 'remove' ) ),
    scaffold:   require( path.join( __dirname, 'scaffold' ) ),
    search:     require( path.join( __dirname, 'search' ) ),
    server:     require( path.join( __dirname, 'server' ) ),
    setup:      require( path.join( __dirname, 'setup' ) ),
    test:       require( path.join( __dirname, 'test' ) ),
    upgrade:    require( path.join( __dirname, 'upgrade' ) )
  };

chai.Assertion.includeStack = true;

function tap ( cmd, fn ) {
  exec( path.join( binPath, 'clever-' + cmd + ' -h' ), function ( err, stdout, stderr ) {
    expect( stderr ).to.equal( '' );
    expect( stdout ).to.match( new RegExp( [ '' ].concat( keg[ cmd ].tap, [ '', '' ] ).join( '\\n' ) ) );
    fn( err );
  } );
}

describe( 'Help documentation', function( ) {
  it( 'build', function ( done ) {
    tap( 'build', done );
  } );

  it( 'downgrade', function ( done ) {
    tap( 'downgrade', done );
  } );

  it( 'generate', function ( done ) {
    tap( 'generate', done );
  } );

  it( 'help', function ( done ) {
    tap( 'help', done );
  } );

  it( 'init', function ( done ) {
    tap( 'init', done );
  } );

  it( 'install', function ( done ) {
    tap( 'install', done );
  } );

  it( 'list', function ( done ) {
    tap( 'list', done );
  } );

  it( 'new', function ( done ) {
    tap( 'new', done );
  } );

  it( 'remove', function ( done ) {
    tap( 'remove', done );
  } );

  it( 'scaffold', function ( done ) {
    tap( 'scaffold', done );
  } );

  it( 'search', function ( done ) {
    tap( 'search', done );
  } );

  it( 'server', function ( done ) {
    tap( 'server', done );
  } );

  it( 'setup', function ( done ) {
    tap( 'setup', done );
  } );

  it( 'test', function ( done ) {
    tap( 'test', done );
  } );

  it( 'upgrade', function ( done ) {
    tap( 'upgrade', done );
  } );
} );
