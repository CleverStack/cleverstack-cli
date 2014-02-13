var chai      = require( 'chai' )
  , expect    = chai.expect
  , path      = require( 'path' )
  , fs        = require( 'fs' )
  , assetPath = path.join( __dirname, '..', '..', 'assets' );

exports.tap = function ( err, stderr, stdout, done ) {
  expect( stderr ).to.equal( '' );
  expect( stdout ).to.not.match( /already exists within/ );

  expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'directives', 'testing2_directive.js' ) ) ).to.be.true;

  var directive = fs.readFileSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'directives', 'testing2_directive.js' ) );
  expect( directive ).to.match( /ng\.module\('testing2.directives'\)/ );
  expect( directive ).to.match( /\.directive\('Testing2Directive', function\(\) {/ );

  done( err );
}

exports.tapfail = function ( err, stderr, stdout, done ) {
  expect( stderr ).to.equal( '' );
  expect( stdout ).to.match( /already exists within/ );
  done( err );
}
