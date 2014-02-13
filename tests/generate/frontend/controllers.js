var path      = require( 'path' )
  , assetPath = path.join( __dirname, '..', '..', 'assets' );

exports.tap = function ( done ) {
  done( null, {
    file: path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'controllers', 'testing2_controller.js' ),
    matches: [
      /ng\.module\('testing2.controllers'\)/,
      /\.controller\('Testing2Controller', \[/
    ]
  } );
}
