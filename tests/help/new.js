var chai    = require( 'chai' )
  , expect  = chai.expect
  , exec    = require('child_process').exec
  , path    = require( 'path' )
  , binPath = path.join( __dirname, '..', '..', 'bin' );

chai.Assertion.includeStack = true;

exports.tap = function ( done ) {
  exec( path.join( binPath, 'clever-new -h' ), function ( err, stdout, stderr ) {
    expect( stderr ).to.equal( '' );
    expect( stdout ).to.match( new RegExp( [
      '',
      '  Usage: clever-new \\[options\\] <name>',
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
      '  Example:',
      '    clever new my_module',
      '    clever new myModule',
      '',
      ''
    ].join( '\\n' ) ) );
    done( err );
  } );
}
