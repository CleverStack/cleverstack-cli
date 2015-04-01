var path      = require('path')
  , assetPath = path.join(__dirname, '..', '..', 'assets');

exports.tap   = function (done) {
  done(null, {
    file: path.join(assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'services', 'Testing2Service.js'),
    matches: [
      /\.module\('Testing2.services'\)/,
      /\.service\('Testing2Service',\ function\(\Testing2Model\)\ {/
    ]
  });
};
