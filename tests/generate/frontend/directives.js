var path      = require('path')
  , assetPath = path.join(__dirname, '..', '..', 'assets');

exports.tap   = function (done) {
  done(null, {
    file: path.join(assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'directives', 'Testing2Directive.js'),
    matches: [
      /\.module\('Testing2.directives'\)/,
      /\.directive\('Testing2Directive',\ function\(\)\ {/
    ]
  });
};
