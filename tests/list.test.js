var chai    = require( 'chai' )
  , expect  = chai.expect
  , exec    = require('child_process').exec
  , path    = require( 'path' )
  , binPath = path.join( __dirname, '..', 'bin' );

chai.Assertion.includeStack = true;

describe( 'List', function( ) {
  it( 'should be able to list all of the modules', function ( done ) {
    exec( path.join( binPath, 'clever-list' ), function ( err, stdout, stderr ) {
      expect( err ).to.be.null;
      expect( stderr ).to.equal( '' );
      expect( stdout ).to.match( new RegExp( [
        '\\u001b\\[38;5;172mclever-auth \\u001b\\[38;5;8m@ \\d+\\.\\d+\\.\\d+\\u001b\\[39m\\u001b\\[39m',
        '\\u001b\\[38;5;7mgit://github.com/CleverStack/clever-auth.git\\u001b\\[39m',
        '\\u001b\\[38;5;250mClevertech Authentication Module\\u001b\\[39m'
      ].join( '\\n' ) ) );

      expect( stdout ).to.match( new RegExp( [
        '\\u001b\\[96mclever-datatables\\u001b\\[39m',
        '\\u001b\\[38;5;7mgit://github.com/CleverStack/clever-datatables.git\\u001b\\[39m',
        '\\u001b\\[38;5;250mThis module provides a directive to create jQuery dataTables.\\u001b\\[39m'
      ].join( '\\n' ) ) );

      done( );
    } );
  } );
} );
