var chai    = require( 'chai' )
  , expect  = chai.expect
  , exec    = require('child_process').exec
  , path    = require( 'path' )
  , binPath = path.join( __dirname, '..', 'bin' )
  , assetPath = path.join( __dirname, 'assets' );

chai.Assertion.includeStack = true;

describe( 'List', function( ) {
  it( 'should be able to list all of the modules', function ( done ) {
    exec( path.join( binPath, 'clever-list' ), { cwd: assetPath }, function ( err, stdout, stderr ) {
      expect( stderr ).to.equal( '' );
      expect( stdout ).to.match( /clever-auth/ );
      expect( stdout ).to.match( /git:\/\/github.com\/CleverStack\/clever-auth.git/ );
      expect( stdout ).to.match( /CleverStack Authentication Module/ );

      expect( stdout ).to.match( /clever-datatables/ );
      expect( stdout ).to.match( /git:\/\/github.com\/CleverStack\/clever-datatables.git/ );
      expect( stdout ).to.match( /This module provides a directive to create jQuery dataTables./ );

      done( err );
    } );
  } );
} );
