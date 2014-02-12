var chai    = require( 'chai' )
  , expect  = chai.expect
  , exec    = require('child_process').exec
  , path    = require( 'path' )
  , binPath = path.join( __dirname, '..', '..', 'bin' );

chai.Assertion.includeStack = true;

describe( 'Help documentation', function( ) {
  it( 'should be able to list the help documentation for search', function ( done ) {
    exec( path.join( binPath, 'clever-search -h' ), function ( err, stdout, stderr ) {
      expect( stderr ).to.equal( '' );
      expect( stdout ).to.match( new RegExp( [
        '',
        '  Usage: clever-search \\[options\\]',
        '',
        '  Options:',
        '',
        '    -h, --help     output usage information',
        '    -V, --version  output the version number',
        '',
        '  Examples:',
        '    clever search users',
        '    clever search users auth email',
        '',
        ''
      ].join( '\\n' ) ) );
      done( err );
    } );
  } );
} );
