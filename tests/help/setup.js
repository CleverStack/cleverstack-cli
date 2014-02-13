var chai    = require( 'chai' )
  , expect  = chai.expect
  , exec    = require('child_process').exec
  , path    = require( 'path' )
  , binPath = path.join( __dirname, '..', '..', 'bin' );

chai.Assertion.includeStack = true;

exports.tap = function ( done ) {
  exec( path.join( binPath, 'clever-setup -h' ), function ( err, stdout, stderr ) {
    expect( stderr ).to.equal( '' );
    expect( stdout ).to.match( new RegExp( [
      '',
      '  Usage: clever-setup \\[options\\]',
      '',
      '  Options:',
      '',
      '    -h, --help         output usage information',
      '    --skip-protractor  Skips installing protractor',
      '    -V, --version      output the version number',
      '',
      '  Description:',
      '',
      '    Installs all NPM and Bower components for each module as well as building bundleDependencies.',
      '    This command will also install Protractor unless explicitly skipping.',
      '',
      '  Examples:',
      '',
      '    clever setup',
      '',
      ''
    ].join( '\\n' ) ) );
    done( err );
  } );
}
