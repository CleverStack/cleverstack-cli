var chai      = require( 'chai' )
  , path      = require( 'path' )
  , rimraf    = require( 'rimraf' )
  , assetPath = path.join( __dirname, '..', '..', 'assets' )
  , controllers = require( path.join( __dirname, 'controllers' ) )
  , directives  = require( path.join( __dirname, 'directives' ) )
  , factories   = require( path.join( __dirname, 'factories' ) )
  , services    = require( path.join( __dirname, 'services' ) )
  , views       = require( path.join( __dirname, 'views' ) );

chai.Assertion.includeStack = true;

describe( 'Generate frontend', function ( ) {
  before( function ( done ) {
    rimraf( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2' ), done );
  } );

  after( function ( done ) {
    rimraf( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2' ), done );
  } );

  it( 'should be able to generate a controller within the frontend seed', function ( done ) {
    controllers.tap( done );
  } );

  it( 'should have trouble creating an existant controller', function ( done ) {
    controllers.tapfail( done );
  } );

  it( 'should be able to generate a directive within the frontend seed', function ( done ) {
    directives.tap( done );
  } );

  it( 'should have trouble creating an existant directive', function ( done ) {
    directives.tapfail( done );
  } );

  it( 'should be able to generate a factory within the frontend seed', function ( done ) {
    factories.tap( done );
  } );

  it( 'should have trouble creating an existant factory', function ( done ) {
    factories.tapfail( done );
  } );

  it( 'should be able to generate a service within the frontend seed', function ( done ) {
    services.tap( done );
  } );

  it( 'should have trouble creating an existant service', function ( done ) {
    services.tapfail( done );
  } );

  it( 'should be able to generate a view within the frontend seed', function ( done ) {
    views.tap( done );
  } );

  it( 'should have trouble creating an existant controller', function ( done ) {
    views.tapfail( done );
  } );
} );
