var chai    = require( 'chai' )
  , expect  = chai.expect
  , exec    = require('child_process').exec
  , path    = require( 'path' )
  , binPath = path.join( __dirname, '..', '..', 'bin' );

chai.Assertion.includeStack = true;

exports.tap = function ( done ) {
  exec( path.join( binPath, 'clever-scaffold -h' ), function ( err, stdout, stderr ) {
    expect( stderr ).to.equal( '' );
    expect( stdout ).to.match( new RegExp( [
      '',
      '  Usage: clever-scaffold \\[options\\] <name>',
      '',
      '  Options:',
      '',
      '    -h, --help       output usage information',
      '    -V, --version    output the version number',
      '    --no-service     Disables generating a service.',
      '    --no-controller  Disables generating a controller.',
      '    --no-model       Disables generating a model.',
      '    --no-task        Disables generating a task.',
      '    --no-test        Disables generating a test.',
      '',
      '  Note:',
      '    Scaffold will generate templates within .*',
      '    If you wish to generate an entire model use clever new <name>',
      '',
      '  Example:',
      '    clever scaffold my_component',
      '    clever scaffold myComponent',
      '',
      ''
    ].join( '\\n' ) ) );
    done( err );
  } );
}
