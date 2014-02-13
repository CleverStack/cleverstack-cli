var chai      = require( 'chai' )
  , expect    = chai.expect
  , path      = require( 'path' )
  , fs        = require( 'fs' )
  , assetPath = path.join( __dirname, '..', '..', 'assets' );

exports.tap = function ( done ) {
  expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'services', 'testing2_service.js' ) ) ).to.be.true;

  var service = fs.readFileSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'services', 'testing2_service.js' ) );
  expect( service ).to.match( /ng\.module\('testing2.services'\)/ );
  expect( service ).to.match( /\.service\('Testing2Service', \[/ );

  done( );
}
