var path    = require( 'path' )
  , build   = require( path.join( __dirname, 'build' ) )
  , downgrade = require( path.join( __dirname, 'downgrade' ) )
  , generate = require( path.join( __dirname, 'generate' ) )
  , help = require( path.join( __dirname, 'help' ) )
  , init = require( path.join( __dirname, 'init' ) )
  , install = require( path.join( __dirname, 'install' ) )
  , list = require( path.join( __dirname, 'list') )
  , _new = require( path.join( __dirname, 'new' ) )
  , remove = require( path.join( __dirname, 'remove' ) )
  , scaffold = require( path.join( __dirname, 'scaffold' ) )
  , search = require( path.join( __dirname, 'search' ) )
  , server = require( path.join( __dirname, 'server' ) )
  , setup = require( path.join( __dirname, 'setup' ) )
  , test = require( path.join( __dirname, 'test' ) )
  , upgrade = require( path.join( __dirname, 'upgrade' ) );

describe( 'Help documentation', function( ) {
  it( 'build', function ( done ) {
    build.tap( done );
  } );

  it( 'downgrade', function ( done ) {
    downgrade.tap( done );
  } );

  it( 'generate', function ( done ) {
    generate.tap( done );
  } );

  it( 'help', function ( done ) {
    help.tap( done );
  } );

  it( 'init', function ( done ) {
    init.tap( done );
  } );

  it( 'install', function ( done ) {
    install.tap( done );
  } );

  it( 'list', function ( done ) {
    list.tap( done );
  } );

  it( 'new', function ( done ) {
    _new.tap( done );
  } );

  it( 'remove', function ( done ) {
    remove.tap( done );
  } );

  it( 'scaffold', function ( done ) {
    scaffold.tap( done );
  } );

  it( 'search', function ( done ) {
    search.tap( done );
  } );

  it( 'server', function ( done ) {
    server.tap( done );
  } );

  it( 'setup', function ( done ) {
    setup.tap( done );
  } );

  it( 'test', function ( done ) {
    test.tap( done );
  } );

  it( 'upgrade', function ( done ) {
    upgrade.tap( done );
  } );
} );
