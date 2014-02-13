var chai      = require( 'chai' )
  , path      = require( 'path' )
  , rimraf    = require( 'rimraf' )
  , exec      = require('child_process').exec
  , assetPath = path.join( __dirname, '..', '..', 'assets' )
  , controllers = require( path.join( __dirname, 'controllers' ) )
  , directives  = require( path.join( __dirname, 'directives' ) )
  , factories   = require( path.join( __dirname, 'factories' ) )
  , services    = require( path.join( __dirname, 'services' ) )
  , views       = require( path.join( __dirname, 'views' ) );

chai.Assertion.includeStack = true;

function run ( cmd, fn ) {
  exec( path.join( __dirname, '..', '..', '..', 'bin', 'clever-generate' ) + ' ' + cmd + ' Testing2', { cwd: path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) }, fn );
}

function tapfail ( err, stderr, stdout, done ) {
  expect( stderr ).to.equal( '' );
  expect( stdout ).to.match( /already exists within/ );
  done( err );
}

describe( 'Generate frontend', function ( ) {
  before( function ( done ) {
    rimraf( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2' ), done );
  } );

  after( function ( done ) {
    rimraf( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2' ), done );
  } );

  it( 'should be able to generate a controller within the frontend seed', function ( done ) {
    run( 'controller', function ( err, stderr, stdout ) {
      controllers.tap( err, stderr, stdout, done );
    } );
  } );

  it( 'should have trouble creating an existant controller', function ( done ) {
    run( 'controller', function ( err, stderr, stdout ) {
      tapfail( err, stderr, stdout, done );
    } );
  } );

  it( 'should be able to generate a directive within the frontend seed', function ( done ) {
    run( 'directive', function ( err, stderr, stdout ) {
      directives.tap( err, stderr, stdout, done );
    } );
  } );

  it( 'should have trouble creating an existant directive', function ( done ) {
    run( 'directive', function ( err, stderr, stdout ) {
      tapfail( err, stderr, stdout, done );
    } );
  } );

  it( 'should be able to generate a factory within the frontend seed', function ( done ) {
    run( 'factory', function ( err, stderr, stdout ) {
      factories.tap( err, stderr, stdout, done );
    } );
  } );

  it( 'should have trouble creating an existant factory', function ( done ) {
    run( 'factory', function ( err, stderr, stdout ) {
      tapfail( err, stderr, stdout, done );
    } );
  } );

  it( 'should be able to generate a service within the frontend seed', function ( done ) {
    run( 'serivce', function ( err, stderr, stdout ) {
      services.tap( err, stderr, stdout, done );
    } );
  } );

  it( 'should have trouble creating an existant service', function ( done ) {
    run( 'service', function ( err, stderr, stdout ) {
      tapfail( err, stderr, stdout, done );
    } );
  } );

  it( 'should be able to generate a view within the frontend seed', function ( done ) {
    run( 'views', function ( err, stderr, stdout ) {
      views.tap( err, stderr, stdout, done );
    } );
  } );

  it( 'should have trouble creating an existant controller', function ( done ) {
    run( 'views', function ( err, stderr, stdout ) {
      tapfail( err, stderr, stdout, done );
    } );
  } );
} );
