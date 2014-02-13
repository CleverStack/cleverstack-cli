var chai    = require( 'chai' )
  , expect  = chai.expect
  , exec    = require('child_process').exec
  , path    = require( 'path' )
  , binPath = path.join( __dirname, '..', '..', 'bin' );

chai.Assertion.includeStack = true;

exports.tap = function ( done ) {
  exec( path.join( binPath, 'clever-install -h' ), function ( err, stdout, stderr ) {
    expect( stderr ).to.equal( '' );
    expect( stdout ).to.match( new RegExp( [
      '',
      '  Usage: clever-install \\[options\\] \\[modules ...\\]',
      '',
      '  Options:',
      '',
      '    -h, --help                 output usage information',
      '    -V, --version              output the version number',
      '    -v, --versions \\[versions\\]  Install a specific package version.',
      '',
      '  Examples:',
      '    clever install clever-background-tasks',
      '    clever install clever-background-tasks@0.0.1',
      '',
      ''
    ].join( '\\n' ) ) );
    done( err );
  } );
}
