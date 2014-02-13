var chai      = require( 'chai' )
  , expect    = chai.expect
  , path      = require( 'path' )
  , fs        = require( 'fs' )
  , assetPath = path.join( __dirname, '..', '..', 'assets' );

exports.tap = function ( err, stderr, stdout, done ) {
  expect( stderr ).to.equal( '' );
  expect( stdout ).to.not.match( /already exists within/ );

  expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'views', 'testing2-view.html' ) ) ).to.be.true;

  var html = fs.readFileSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'views', 'testing2-view.html' ) );
  expect( html ).to.match( /<h1>Testing2 Module<\/h1>/ );

  done( err );
}
