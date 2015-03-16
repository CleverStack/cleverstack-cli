var path      = require( 'path' )
  , assetPath = path.join( __dirname, '..', '..', 'assets' );

exports.tap   = function ( done ) {
  done( null, {
    file: path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'factories', 'Testing2Factory.js' ),
    matches: [
      /\.module\('Testing2.factories'\)/,
      /\.factory\('Testing2Factory',\ function\(\)\ {/
    ]
  });
};
