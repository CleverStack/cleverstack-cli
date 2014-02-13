var chai    = require( 'chai' )
  , expect  = chai.expect
  , exec    = require('child_process').exec
  , path    = require( 'path' )
  , binPath = path.join( __dirname, '..', '..', 'bin' );

chai.Assertion.includeStack = true;

exports.tap = function ( done ) {
  exec( path.join( binPath, 'clever-remove -h' ), function ( err, stdout, stderr ) {
    expect( stderr ).to.equal( '' );
    expect( stdout ).to.match( new RegExp( [
      '',
      '  Usage: clever-remove \\[options\\] \\[modules ...\\]',
      '',
      '  Options:',
      '',
      '    -h, --help     output usage information',
      '    -V, --version  output the version number',
      '',
      '  Examples:',
      '    clever remove clever-background-tasks',
      '    clever remove auth clever-background-tasks',
      '',
      ''
    ].join( '\\n' ) ) );
    done( err );
  } );
}
