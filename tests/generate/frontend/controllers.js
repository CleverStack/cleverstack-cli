var path      = require('path')
  , assetPath = path.join(__dirname, '..', '..', 'assets');

exports.tap = function (done) {
  done(null, {
    file: path.join(assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'controllers', 'Testing2Controller.js'),
    matches: [
      /\.module\(\'Testing2.controllers'\)/,
      /\.controller\(\'Testing2Controller',\ function\(\$scope\)\ {/
    ]
  });
};
