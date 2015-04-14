var Promise  = require('bluebird')
  , path     = require('path')
  , async    = require('async')
  , fs       = require('fs')
  , spawn    = require('child_process').spawn
  , readline = require('readline')
  , os       = require('os')
  , isWin    = /^win32/.test(os.platform());

/**
 * Mimmicks a small grunt-cli utility
 *
 * @return {gruntCLI}
 * @private
 */
function gruntCLI() {
  this.tasks = [];

  this.option = function(key) {
    return process.env[ key ];
  };

  this.registerTask = function(cmd) {
    this.tasks.push(cmd);
  };

  this.loadNpmTasks = function() {};
}

/**
 * Finds the correct Gruntfile name
 *
 * @param  {String} pathSrc - Directory path where the Gruntfile resides.
 * @return {Promise}
 * @api public
 */
var findGruntFile = exports.findGruntFile = function(pathSrc) {
  return new Promise(function(resolve, reject) {
    async.detect([
      path.join(pathSrc, 'Gruntfile.js'),
      path.join(pathSrc, 'gruntfile.js'),
      path.join(pathSrc, 'Grunt.js'),
      path.join(pathSrc, 'grunt.js')
    ], fs.exists, function(filePath) {
      if (typeof filePath === 'undefined') {
        return reject('Gruntfile within ' + pathSrc + ' could not be found.');
      }

      resolve(filePath);
    });
  });
};

/**
 * We're essentially creating a small grunt utility to bypass
 * grunt functions... this is better than requiring grunt
 * entirely and trying to regex parse...
 *
 * @param  {String} filePath
 * @return {Object}
 * @api public
 */
var gruntUtility = exports.gruntUtility = function(filePath) {
  var cli  = new gruntCLI()
    , file = require(filePath)(cli);

  if (Array.isArray(file) && typeof file[ file.length-1 ] === 'function') {
    file[ file.length-1 ].call(file,  cli);
  }

  return cli.tasks;
};

/**
 * Reads/parses Grunt tasks within pathSrc
 *
 * @param  {String} pathSrc - Source to the Gruntfile
 * @param  {Boolean} [silence=true] - Silences errors returned from reading the Gruntfile
 * @return {Promise}
 * @api public
 */
var readTasks = exports.readTasks = function(pathSrc, silence) {
  return new Promise(function(resolve, reject) {
    if (typeof silence === 'undefined') {
      silence = true;
    }

    findGruntFile(pathSrc)
      .then(function(filePath) {
        var tasks = gruntUtility(filePath);
        resolve([ tasks, pathSrc ]);
      })
      .catch(function (err) {
        if (err.match(/^Gruntfile within/) !== null && silence === true) {
          return resolve([ [], pathSrc ]);
        }

        reject(err);
      });
  });
};

/**
 * Runs a grunt task within projectFolder
 *
 * @param  {String} projectFolder Path to the project's seed folder
 * @param  {String} cmd           Command to run within grunt
 * @return {Promise}              Returns a promise from bluebird
 * @api private
 */
exports.runTask = function runTask(projectFolder, command) {
  var args       = [].slice.call(arguments, 1);

  return new Promise(function(resolve, reject) {
    var cmd      = !isWin ? 'grunt' : 'grunt.cmd'
      , env      = process.env
      , opts     = {env: env, cwd: projectFolder}
      , paths    = process.env.NODE_PATH ? [process.env.NODE_PATH] : [];

    // Pass the --verbose call down to grunt as well
    if (!!program.verbose) {
      args.push('--verbose');
      
      var logMsg = 'Spawning posix child process to run '+lib.colors.lightGreen(cmd+' '+args.join(' ')) + '...';
      lib.utils.info(logMsg).running(logMsg);
    }

    paths.push(path.resolve(path.join(projectFolder, 'lib')) + path.sep);
    paths.push(path.resolve(path.join(projectFolder, 'modules')) + path.sep);

    env.NODE_PATH = paths.join(!!isWin ? ';' : ':');

    var posixProc = spawn(cmd, args, opts)
      , exitHdlr  = process.kill.bind(process, posixProc)
      , error     = '';

    process.on('SIGTERM', exitHdlr);

    if (!!program.verbose || process.mainModule.filename.match('build')) {
      readline
        .createInterface({
          input    : posixProc.stdout,
          terminal : false
        })
        .on('line', function(line) {
          console.log('      ' + line);
        });
    }

    posixProc.on('error', function(err) {
      error += err;
    });

    posixProc.on('close', function(code) {
      process.removeListener('SIGTERM', exitHdlr);

      if (code !== 0 || !!error) {
        return reject(error);
      }

      if (command.indexOf('prompt')) {
        lib.utils.progress();
        lib.utils.startBar(function() {
          resolve();
        });
      } else {
        resolve();
      }
    });
  });
}

/**
 * Runs DB migrations from grunt
 *
 * @param  {String} projectFolder Path to the project's folder
 * @return {Promise}              Returns a promise from bluebird
 * @api private
 */
function runDBMigrations(projectFolder) {
  lib.utils.warn('Running database migrations...');

  return new Promise(function(resolve, reject) {
    var env        = process.env
      , paths      = process.env.NODE_PATH ? [process.env.NODE_PATH] : [];

    paths.push(path.resolve(path.join(projectFolder, 'lib')) + path.sep);
    paths.push(path.resolve(path.join(projectFolder, 'modules')) + path.sep);

    env.NODE_PATH  = paths.join(!!isWin ? ';' : ':');

    // check for NODE_ENV json config file if it doesn't exist then revert to local
    if (!fs.existsSync(path.join(projectFolder, 'config', env.NOD_ENV + '.json'))) {
      env.NODE_ENV = 'local';
    }

    var opts = {env: env, cwd: projectFolder}
      , args = ['db']
      , cmd  = !isWin ? 'grunt' : 'grunt.cmd';


    if (!!program.verbose) {
      opts.stdio = 'inherit';
    } else {
      args.push('--silent');
    }

    var proc = spawn(cmd, args, opts)
      , error = '';

    proc.on('error', function(err) {
      error += err;
    });

    proc.on('close', function(code) {
      if (code !== 0 || !!error) {
        return reject(error);
      }

      lib.utils.progress();
      resolve();
    });
  });
}

/**
 * Runs Grunt tasks specifically for CleverStack
 *
 * @param  {String} projectFolder Path to the project's backend folder
 * @param  {String} modulePath    Path to the module (where to look for the grunt file)
 * @return {Promise}              Promise from bluebird
 * @api public
 */
exports.runTasks = function(projectFolder, modulePath) {
  return new Promise(function(resolve, reject) {
    var originalCwd = process.cwd();
    process.chdir(projectFolder);

    readTasks(modulePath)
      .spread(function(tasks) {
        
        process.chdir(originalCwd);

        if (tasks.length) {
          lib.utils.warn('  Running grunt tasks for module ' + modulePath.split(path.sep).pop() + '...');
        }
        
        Promise
          .all(tasks)
          .then(function() {
            if (tasks.indexOf('readme') > -1) {
              lib.utils.expandProgress(1);
              return runTask(projectFolder, 'readme');
            }
            return true;
          })
          .then(function() {
            return new Promise(function(resolve, reject) {
              async.forEachSeries(
                tasks,
                function(task, callback) {
                  if (/^prompt:clever.*/.test(task)) {
                    lib.utils.expandProgress(1);
                    lib.utils.stopBar(function() {
                      runTask(projectFolder, task)
                        .then(function() {
                          callback(null);
                        })
                        .catch(callback);
                    });
                  } else {
                    callback(null);
                  }
                },
                function(err) {
                  !err ? resolve() : reject(err);
                }
               );
            });
          })
          .then(function() {
            if (tasks.indexOf('db') > -1) {
              lib.utils.expandProgress(1);
              return runDBMigrations(projectFolder);
            }
            return true;
          })
          .then(function() {
            resolve();
          }, function(err) {
            reject(err);
          });
      });
  });
};
