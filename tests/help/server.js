var chai    = require( 'chai' )
  , expect  = chai.expect
  , exec    = require('child_process').exec
  , path    = require( 'path' )
  , binPath = path.join( __dirname, '..', '..', 'bin' );

chai.Assertion.includeStack = true;

exports.tap = function ( done ) {
  exec( path.join( binPath, 'clever-server -h' ), function ( err, stdout, stderr ) {
    expect( stderr ).to.equal( '' );
    expect( stdout ).to.match( new RegExp( [
      '',
      '  Usage: clever-server \\[options\\]',
      '',
      '  Options:',
      '',
      '    -h, --help         output usage information',
      '    -V, --version      output the version number',
      '    -x, --host \\[host\\]  Set the host for grunt server',
      '    -p, --port \\[port\\]  Set the port for grunt server',
      '',
      '  Example:',
      '    clever server',
      '    clever --host 10.0.0.0 server',
      '    clever --port 7777 server',
      '',
      ''
    ].join( '\\n' ) ) );
    done( err );
  } );
}
