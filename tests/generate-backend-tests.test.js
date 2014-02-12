var chai      = require( 'chai' )
  , expect    = chai.expect
  , exec      = require('child_process').exec
  , path      = require( 'path' )
  , rimraf    = require( 'rimraf' )
  , fs        = require( 'fs' )
  , binPath   = path.join( __dirname, '..', 'bin' )
  , assetPath = path.join( __dirname, 'assets' );

chai.Assertion.includeStack = true;

describe( 'Generate backend seed (tests)', function ( ) {
  before( function ( done ) {
    rimraf( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing2' ), function ( ) { done( ); } );
  } );

  after( function ( done ) {
    rimraf( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing2' ), function ( ) { done( ); } );
  } );

  it( 'should be able to create', function ( done ) {
    exec( path.join( binPath, 'clever-generate' ) + ' test Testing2', { cwd: path.join( assetPath, 'my-new-project', 'backend', 'modules' ) }, function ( err, stdout, stderr ) {
      expect( stderr ).to.equal( '' );
      expect( stdout ).to.not.match( /already exists within/ );

      expect( fs.readdirSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing2') ).length ).to.equal( 1 );
      expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing2', 'tests', 'integration', 'Testing2Test.js' ) ) ).to.be.true;
      expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing2', 'tests', 'unit', 'Testing2Test.js' ) ) ).to.be.true;

      var testInt = fs.readFileSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing2', 'tests', 'integration', 'Testing2Test.js' ) );
      expect( testInt ).to.match( /describe \( '\/testing2', function \(\) \{/ );
      expect( testInt ).to.match( /describe \( 'POST \/testing2', function \(\) \{/ );
      expect( testInt ).to.match( /describe \( 'GET \/testing2', function \(\) \{/ );
      expect( testInt ).to.match( /describe \( 'GET \/testing2\/:id', function \(\) \{/ );
      expect( testInt ).to.match( /describe \( 'PUT \/testing2\/:id', function \(\) \{/ );
      expect( testInt ).to.match( /describe \( 'DELETE \/testing2\/:id', function \(\) \{/ );
      expect( testInt ).to.match( /describe \( 'GET \/testing2\/custom', function \(\) \{/ );
      expect( testInt ).to.match( /message: 'Hello from customAction inside Testing2Controller'/ );

      var testUnit = fs.readFileSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing2', 'tests', 'unit', 'Testing2Test.js' ) );
      expect( testUnit ).to.match( /describe \( 'controllers\.Testing2Controller', function \(\) \{/ );
      expect( testUnit ).to.match( /testEnv \( function \( Testing2Controller, Testing2Service \) \{/ );
      expect( testUnit ).to.match( /message: 'Hello from customAction inside Testing2Controller'/ );

      done( err );
    } );
  } );

  it( 'should have trouble creating an existing test', function ( done ) {
    exec( path.join( binPath, 'clever-generate' ) + ' test Testing2', { cwd: path.join( assetPath, 'my-new-project', 'backend', 'modules' ) }, function ( err, stdout, stderr ) {
      expect( stderr ).to.equal( '' );
      expect( stdout ).to.match( /Testing2Test\.js already exists within/ );
      done( err );
    } );
  } );
} );
