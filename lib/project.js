var Promise = require('bluebird')
  , path    = require('path')
  , async   = require('async')
  , spawn   = require('child_process').spawn
  , fs      = Promise.promisifyAll(require('fs'))
  , install = GLOBAL.lib.install
  , _bower  = GLOBAL.lib.util.bower
  , utils   = GLOBAL.lib.utils
  , os      = require('os')
  , isWin   = /^win32/.test(os.platform());

Promise.longStackTraces();

/**
 * Helper function for running clever-install if there are modules to install
 *
 * @param  {Object} projectFolder location returned by util.locations.get()
 * @param  {String[]} modules
 * @return {Promise}
 * @api public
 */

exports.setupModules = function(projectFolder, modules) {
  return new Promise(function(resolve, reject) {
    var cwd = process.cwd();

    process.chdir(projectFolder.moduleDir);

    install
      .run(modules)
      .then(function() {
        process.chdir(cwd);
        resolve();
      }, function(err) {
        process.chdir(cwd);
        reject(err);
      });
  });
};

/**
 * Installs module bower components within the frontend seed's component dir
 *
 * @param  {Object} projectFolder Object returned from util.locations.get()
 * @return {Promise}              Promise from bluebird
 * @api public
 */

exports.installBowerComponents = function(projectFolder) {
  return new Promise(function(resolve, reject) {
    var bowerRC     = path.join(projectFolder.moduleDir, '.bowerrc')
      , _bowerRC    = fs.readFileSync(bowerRC);

    _bowerRC = JSON.parse(_bowerRC);

    if (program.verbose) {
      utils.info('  Installing bower components for ' + projectFolder.moduleDir + '...');
    }

    _bower.install(projectFolder.moduleDir, function (err) {
      if (!!err) {
        return reject(err);
      }

      async.filter(
        fs.readdirSync(path.join(projectFolder.moduleDir, projectFolder.modulePath)),
        function(dir, next) {
          fs.exists(path.join(projectFolder.moduleDir, projectFolder.modulePath, dir, 'bower.json'), next);
        },
        function (modules, err) {
          if (!!err) {
            return reject(err);
          }

          if (modules.length < 1) {
            return resolve();
          }

          async.each(
            modules,
            function(moduleDir, callback) {
              utils.running('Installing bower components for ' + moduleDir + '...' );
              if (program.verbose) {
                utils.info('  Installing bower components for ' + moduleDir + '...');
              } else {
                utils.info('  Installing bower components for ' + moduleDir.split('/').pop() + '...');
              }

              _bower.install(
                path.join(projectFolder.moduleDir, projectFolder.modulePath, moduleDir),
                {
                  cwd: path.join(projectFolder.moduleDir, projectFolder.modulePath, moduleDir),
                  directory: path.relative(path.join(projectFolder.moduleDir, projectFolder.modulePath, moduleDir), [ projectFolder.moduleDir ].concat(_bowerRC.directory.split('/')).join(path.sep)),
                  env: process.env
                },
                function(err) {
                  callback(err);
                }
             );
            },
            function(moduleErr) {
              if (!!moduleErr) {
                return reject(moduleErr);
              }

              resolve();
            }
         );
        }
     );
    });
  });
};

/**
 * Looks into package.json within the seed's module directory
 * and finds each (dev)dependency and installs individually
 * due to use using the --prefix flag for NPM
 *
 * @param  {Object} project
 * @param  {String} modulePath
 * @param  {Object} programOptions program instance sent by commander
 * @return {Promise}
 * @api public
 */

exports.installModule = function(project, modulePath) {
  return new Promise(function(resolve, reject) {
    var projectFolder   = project.moduleDir
      , moduleDir       = path.join(project.moduleDir, project.modulePath)
      , jsonPath        = path.resolve(path.join(modulePath, 'package.json'))
      , deps            = [];

    if (!fs.existsSync(jsonPath)) {
      return resolve();
    }

    var jsonFile = require(jsonPath);

    jsonFile.dependencies    = jsonFile.dependencies     || {};
    jsonFile.devDependencies = jsonFile.devDependencies  || {};

    Object.keys(jsonFile.dependencies).forEach(function(k) {
      deps.push(k + '@' + jsonFile.dependencies[ k ]);
    });

    Object.keys(jsonFile.devDependencies).forEach(function(k) {
      deps.push(k + '@' + jsonFile.devDependencies[ k ]);
    });

    utils.info('  Installing NPM modules for ' + modulePath.split(path.sep).pop() + '...');
    async.waterfall(
      [
        function installNpmDependencies(callback) {
          var opts = {cwd: moduleDir, env: process.env}
            , args = ['install', '--prefix', projectFolder].concat(deps)
            , cmd  = !isWin ? 'npm' : 'npm.cmd';

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
              callback(error);
            } else {
              callback(null);
            }
          });
        },

        function installBowerDependencies(callback) {
          if (program.verbose) {
            utils.success('  Finished installing NPM packages for ' + modulePath.split(path.sep).pop() + '...');
          }

          var bowerPath = path.resolve(path.join(projectFolder, 'bower.json'));

          // backend folder?
          if (!fs.existsSync(bowerPath)) {
            utils.success('  Successfully installed ' + modulePath.split(path.sep).pop() + '...');
            return callback(null);
          }

          utils.info('  Installing bower components for ' + modulePath.split(path.sep).pop() + '...');
          _bower.install(modulePath, function(_err) {
            if (!!_err) {
              return callback(_err);
            }

            utils.success('  Successfully installed ' + modulePath.split(path.sep).pop() + '...');
            callback(null);
          });
        }
      ],
      function checkInstallation(err) {
        if (!!err) {
          resolve();
        } else {
          reject(err);
        }
      }
    );
  });
};
