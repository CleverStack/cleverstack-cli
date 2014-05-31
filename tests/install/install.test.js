var chai      = require( 'chai' )
  , expect    = chai.expect
  , exec      = require('child_process').exec
  , path      = require( 'path' )
  , fs        = require( 'fs' )
  , binPath   = path.join( __dirname, '..', '..', 'bin' )
  , assetPath = path.join( __dirname, '..', 'assets' );

chai.Assertion.includeStack = true;

describe( 'Install (generic)', function ( ) {
  describe( 'should have trouble installing a module', function ( ) {
    it( 'outside of the project\'s scope', function ( done ) {
      exec( path.join( binPath, 'clever-install' ) + ' clever-orm@0.0.2', { cwd: path.resolve( path.join( assetPath, '..' ) ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /Couldn't find a seed directory within/ );
        done( err );
      } );
    } );

    it( 'with a non-existant version', function ( done ) {
      exec( path.join( binPath, 'clever-install' ) + ' clever-orm@0.0.2', { cwd: path.join( assetPath, 'my-new-project' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /Invalid version 0.0.2 for module clever-orm/ );
        done( err );
      } );
    } );

    it( 'a backend module within the frontend seed directory', function ( done ) {
      exec( path.join( binPath, 'clever-install' ) + ' clever-background-tasks', { cwd: path.join( assetPath, 'my-new-project', 'frontend' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-background-tasks' ) ) ).to.be.false;
        done( err );
      } );
    } );

    it( 'a frontend module within the backend seed directory', function ( done ) {
      exec( path.join( binPath, 'clever-install' ) + ' clever-datatables', { cwd: path.join( assetPath, 'my-new-project', 'backend' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables' ) ) ).to.be.false;
        done( err );
      } );
    } );
  } );
} );
