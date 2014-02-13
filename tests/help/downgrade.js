var chai    = require( 'chai' )
  , expect  = chai.expect
  , exec    = require('child_process').exec
  , path    = require( 'path' )
  , binPath = path.join( __dirname, '..', '..', 'bin' );

chai.Assertion.includeStack = true;

exports.tap = function ( done ) {
  exec( path.join( binPath, 'clever-downgrade -h' ), function ( err, stdout, stderr ) {
    expect( stderr ).to.equal( '' );
    expect( stdout ).to.match( new RegExp( [
      '',
      '  Usage: clever-downgrade \\[options\\]',
      '',
      '  Options:',
      '',
      '    -h, --help     output usage information',
      '    -V, --version  output the version number',
      '',
      '  Examples:',
      '',
      '    clever downgrade clever-orm',
      '    clever downgrade clever-orm@0.0.1 clever-datatables@0.0.1',
      '    clever downgrade backend',
      '    clever downgrade frontend',
      '',
      ''
    ].join( '\\n' ) ) );
    done( err );
  } );
}
