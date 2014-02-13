var chai    = require( 'chai' )
  , expect  = chai.expect
  , exec    = require('child_process').exec
  , path    = require( 'path' )
  , binPath = path.join( __dirname, '..', '..', 'bin' );

chai.Assertion.includeStack = true;

exports.tap = function ( done ) {
  exec( path.join( binPath, 'clever-upgrade -h' ), function ( err, stdout, stderr ) {
    expect( stderr ).to.equal( '' );
    expect( stdout ).to.match( new RegExp( [
      '',
      '  Usage: clever-upgrade \\[options\\]',
      '',
      '  Options:',
      '',
      '    -h, --help     output usage information',
      '    -V, --version  output the version number',
      '',
      '  Examples:',
      '',
      '    clever upgrade clever-orm',
      '    clever upgrade clever-orm@0.0.3 clever-datatables@0.0.2',
      '    clever upgrade backend',
      '    clever upgrade frontend',
      '',
      ''
    ].join( '\\n' ) ) );
    done( err );
  } );
}
