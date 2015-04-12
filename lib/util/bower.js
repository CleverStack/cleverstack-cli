var spawn = require('child_process').spawn
  , os    = require('os')
  , isWin = /^win32/.test(os.platform());

/**
 * Runs bower install
 *
 * @param  {String}   modulePath Path to the directory in which bower.json resides
 * @param  {Object}   options    Object given to us from commander
 * @param  {Callback} fn         Callback function
 * @return {Function}            Returns fn
 * @public
 */

exports.install = function(modulePath, options, fn) {
  var additionalOptions = [ ]
    , params = { cwd: modulePath };

  if (typeof options === 'function') {
    fn = options;
    options = { };
  }

  options = typeof options === 'object' && options !== null ? options : { };

  additionalOptions.push('install');

  if (program.allowRoot) {
    additionalOptions.push('--allow-root');
  }

  // Bower specific arguments
  var bowerArgs = [ 'cwd', 'directory' ].filter(function(option) {
    return options.hasOwnProperty(option);
  });

  if (bowerArgs.length) {
    additionalOptions.push('-F'); // force
  }

  bowerArgs.forEach(function(option) {
    additionalOptions.push('--config.' + option + '=' + options[ option ]);
  });

  // Any additional paramters in which we want to allow within spawn()
  [ 'env' ].filter(function(key) {
    return program.hasOwnProperty(key);
  })
  .forEach(function(key) {
    params[ key ] = params[ key ];
  });

  if (!!program.verbose) {
    additionalOptions.push('--verbose');
  }

  var proc = spawn(!isWin ? 'bower' : 'bower.cmd', additionalOptions, params)
    , error;

  proc.on('error', function(err) {
    error += err;
  });

  proc.on('close', function(code) {
    if (code !== 0 || !!error) {
      fn(error);
    } else {
      fn(null);
    }
  });
};
