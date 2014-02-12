var chai      = require( 'chai' )
  , expect    = chai.expect
  , exec      = require('child_process').exec
  , path      = require( 'path' )
  , rimraf    = require( 'rimraf' )
  , fs        = require( 'fs' )
  , binPath   = path.join( __dirname, '..', '..', '..', 'bin' )
  , assetPath = path.join( __dirname, '..', '..', 'assets' );

chai.Assertion.includeStack = true;

describe( 'Generate frontend seed (views)', function ( ) {
  after( function ( done ) {
    rimraf( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2' ), done );
  } );

  it( 'should be able to generate a view within the frontend seed', function ( done ) {
    exec( path.join( binPath, 'clever-generate' ) + ' views Testing2', { cwd: path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) }, function ( err, stdout, stderr ) {
      expect( stderr ).to.equal( '' );
      expect( stdout ).to.not.match( /already exists within/ );

      expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'views', 'testing2-view.html' ) ) ).to.be.true;

      var html = fs.readFileSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'views', 'testing2-view.html' ) );
      expect( html ).to.match( /<h1>Testing2 Module<\/h1>/ );

      done( err );
    } );
  } );

  it( 'should have trouble creating an existant controller', function ( done ) {
    exec( path.join( binPath, 'clever-generate' ) + ' views Testing2', { cwd: path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) }, function ( err, stdout, stderr ) {
      expect( stderr ).to.equal( '' );
      expect( stdout ).to.match( /already exists within/ );
      done( err );
    } );
  } );
} );
