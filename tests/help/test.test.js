var chai    = require( 'chai' )
  , expect  = chai.expect
  , exec    = require('child_process').exec
  , path    = require( 'path' )
  , binPath = path.join( __dirname, '..', '..', 'bin' );

chai.Assertion.includeStack = true;

describe( 'Help documentation', function( ) {
  it( 'should be able to list the help documentation for test', function ( done ) {
    exec( path.join( binPath, 'clever-test -h' ), function ( err, stdout, stderr ) {
      expect( stderr ).to.equal( '' );
      expect( stdout ).to.match( new RegExp( [
        '',
        '  Usage: clever-test \\[options\\] \\[command\\]',
        '',
        '  Commands:',
        '',
        '    e2e                    Runs e2e tests',
        '    unit                   Runs unit tests',
        '    coverage               Generates unit test coverage reports.',
        '',
        '  Options:',
        '',
        '    -h, --help     output usage information',
        '    -V, --version  output the version number',
        '',
        '  Examples:',
        '',
        '    clever test coverage',
        '    clever test e2e',
        '    clever test unit',
        '',
        ''
      ].join( '\\n' ) ) );
      done( err );
    } );
  } );
} );
