var chai      = require( 'chai' )
  , expect    = chai.expect
  , exec      = require('child_process').exec
  , path      = require( 'path' )
  , rimraf    = require( 'rimraf' )
  , fs        = require( 'fs' )
  , binPath   = path.join( __dirname, '..', '..', '..', 'bin' )
  , assetPath = path.join( __dirname, '..', '..', 'assets' );

chai.Assertion.includeStack = true;

describe( 'Generate frontend seed (controllers)', function ( ) {
  before( function ( done ) {
    rimraf( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2' ), done );
  } );

  after( function ( done ) {
    rimraf( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2' ), done );
  } );

  it( 'should be able to generate a controller within the frontend seed', function ( done ) {
    exec( path.join( binPath, 'clever-generate' ) + ' controller Testing2', { cwd: path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) }, function ( err, stdout, stderr ) {
      expect( stderr ).to.equal( '' );
      expect( stdout ).to.not.match( /already exists within/ );

      expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'controllers', 'testing2_controller.js' ) ) ).to.be.true;

      var controller = fs.readFileSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'controllers', 'testing2_controller.js' ) );
      expect( controller ).to.match( /ng\.module\('testing2.controllers'\)/ );
      expect( controller ).to.match( /\.controller\('Testing2Controller', \[/ );

      done( err );
    } );
  } );

  it( 'should have trouble creating an existant controller', function ( done ) {
    exec( path.join( binPath, 'clever-generate' ) + ' controller Testing2', { cwd: path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) }, function ( err, stdout, stderr ) {
      expect( stderr ).to.equal( '' );
      expect( stdout ).to.match( /already exists within/ );
      done( err );
    } );
  } );
} );
