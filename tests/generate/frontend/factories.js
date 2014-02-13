var chai      = require( 'chai' )
  , expect    = chai.expect
  , path      = require( 'path' )
  , fs        = require( 'fs' )
  , assetPath = path.join( __dirname, '..', '..', 'assets' );


exports.tap = function ( err, stderr, stdout, done ) {
  expect( stderr ).to.equal( '' );

  expect( stdout ).to.not.match( /already exists within/ );
  expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'factories', 'testing2_factory.js' ) ) ).to.be.true;

  var factory = fs.readFileSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'factories', 'testing2_factory.js' ) );
  expect( factory ).to.match( /ng\.module\('testing2.factories'\)/ );
  expect( factory ).to.match( /\.factory\('Testing2Factory', function\(\){/ );

  done( err );
}

exports.tapfail = function ( err, stderr, stdout, done ) {
  expect( stderr ).to.equal( '' );
  expect( stdout ).to.match( /already exists within/ );
  done( err );
}
