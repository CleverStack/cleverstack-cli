var chai      = require( 'chai' )
  , expect    = chai.expect
  , path      = require( 'path' )
  , fs        = require( 'fs' )
  , assetPath = path.join( __dirname, '..', '..', 'assets' );

exports.tap = function ( err, stderr, stdout, done ) {
  expect( stderr ).to.equal( '' );
  expect( stdout ).to.not.match( /already exists within/ );

  expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'controllers', 'testing2_controller.js' ) ) ).to.be.true;

  var controller = fs.readFileSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'controllers', 'testing2_controller.js' ) );
  expect( controller ).to.match( /ng\.module\('testing2.controllers'\)/ );
  expect( controller ).to.match( /\.controller\('Testing2Controller', \[/ );

  done( err );
}

exports.tapfail = function ( err, stderr, stdout, done ) {
  expect( stderr ).to.equal( '' );
  expect( stdout ).to.match( /already exists within/ );
  done( err );
}
