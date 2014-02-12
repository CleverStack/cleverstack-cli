var chai    = require( 'chai' )
  , expect  = chai.expect
  , exec    = require('child_process').exec
  , path    = require( 'path' )
  , binPath = path.join( __dirname, '..', '..', 'bin' );

chai.Assertion.includeStack = true;

describe( 'Help documentation', function( ) {
  it( 'should be able to list the help documentation for init', function ( done ) {
    exec( path.join( binPath, 'clever-init -h' ), function ( err, stdout, stderr ) {
      expect( stderr ).to.equal( '' );

      expect( stdout ).to.match( new RegExp( [
        '',
        '  Usage: clever-init \\[options\\] \\[command\\]',
        '',
        '  Commands:',
        '',
        '    <project>               Creates a project named <project>',
        '',
        '  Options:',
        '',
        '    -h, --help         output usage information',
        '    --skip-protractor  Skips installing protractor',
        '    -V, --version      output the version number',
        '',
        '  Examples:',
        '    clever init my-project',
        '    clever init project-frontend frontend',
        '    clever init my-project-everything backend frontend',
        '',
        '  Installing specific versions:',
        '    clever init my-project backend\\@<version>',
        '    clever init my-project frontend\\@<version>',
        '',
        ''
      ].join( '\\n' ) ) );
      done( err );
    } );
  } );
} );
