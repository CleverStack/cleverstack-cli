var chai      = require( 'chai' )
  , expect    = chai.expect
  , exec      = require('child_process').exec
  , path      = require( 'path' )
  , rimraf    = require( 'rimraf' )
  , async     = require( 'async' )
  , fs        = require( 'fs' )
  , binPath   = path.join( __dirname, '..', 'bin' )
  , assetPath = path.join( __dirname, 'assets' );

chai.Assertion.includeStack = true;

describe( 'Setup', function ( ) {
  after( function ( done ) {
    rimraf( path.join( assetPath, 'my-new-project' ), done );
  } );

  before( function ( done ) {
    async.parallel( [
      async.apply( rimraf, path.join( assetPath, 'my-new-project', 'backend', 'node_modules', 'passport' ) ),
      async.apply( rimraf, path.join( assetPath, 'my-new-project', 'frontend', 'app', 'components', 'datatables' ) )
    ], done );
  } );

  it( 'should be able to setup a new environment', function ( done ) {
    exec( path.join( binPath, 'clever-setup --skip-protractor' ), { cwd: path.join( assetPath, 'my-new-project' ) }, function ( err, stdout, stderr ) {
      expect( stderr ).to.equal( '' );
      expect(fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'node_modules', 'passport' ) ) ).to.be.true;
      expect(fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'components', 'datatables' ) ) ).to.be.true;
      done( err );
    } );
  } );
} );
