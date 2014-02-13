var path      = require( 'path' )
  , assetPath = path.join( __dirname, '..', '..', 'assets' );

exports.tap = function ( done ) {
  done( null, {
    file: path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'views', 'testing2-view.html' ),
    matches: [
      /<h1>Testing2 Module<\/h1>/
    ]
  } );
}
