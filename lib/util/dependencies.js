var Promise = require('bluebird')
  , path    = require('path')
  , async   = require('async')
  , fs      = require('fs')
  , install = require(path.join(__dirname, '..', 'install'));

/**
 * Installs CleverStack modules listed within the peerDependencies array
 *
 * @param  {String} project
 * @param  {Array} deps
 * @return {Promise}
 * @api public
 */
function installPeerModules(project, dependencies, projectDir) {
  var originalCwd = process.cwd();

  return new Promise(function(resolve, reject) {
    projectDir    = typeof projectDir !== 'undefined' ? projectDir : project;
    dependencies  = Array.isArray(dependencies) ? dependencies : [dependencies];

    // @todo refactor this
    if (dependencies.length < 1) {
      return new Promise(function(res) {
        res();
      });
    }

    async.filter(
      dependencies,
      function filterAlreadyInstalledModules(dependency, moduleIsInstalled) {
        fs.exists(path.join(projectDir, Object.keys(dependency)[0]), function IsModuleInModulesFolder(exists) {
          moduleIsInstalled(!exists);
        });
      },
      function installModuleDependencies(modulesToInstall) {
        if (modulesToInstall.length < 1) {
          return resolve();
        }

        modulesToInstall = modulesToInstall.map(function(dependency) {
          var dependencyName = Object.keys(dependency)[0]
            , dependencyVersion = dependency[dependencyName];

          return dependencyName + '@' + dependencyVersion;
        });

        lib
          .utils
          .info('  Installing modules: ' + modulesToInstall.join(' '))
          .expandProgress(modulesToInstall.length);

        process.chdir(projectDir);

        install
          .run(modulesToInstall)
          .then(function completeInstallation() {
            process.chdir(originalCwd);
            resolve();
          }, function installationFailed(err) {
            process.chdir(originalCwd);
            reject(err);
          });
      });
  });
}
exports.installPeerModules = installPeerModules;


/**
 * Installs peerDependencies through lib.project.installPeerModules if applicable
 *
 * @param  {String} projectDir
 * @return {Promise}
 * @api public
 */
function installPeerDependencies(moduleDir, projectDir) {
  return new Promise(function(resolve, reject) {
    var pkg = require(path.join(moduleDir, 'package.json'));

    if (!pkg.hasOwnProperty('peerDependencies') || pkg.peerDependencies.length < 1) {
      return resolve();
    }

    lib.utils.info('  Installing peer dependencies within ' + moduleDir);
    installPeerModules(moduleDir, pkg.peerDependencies, projectDir).then(function() {
      resolve();
    })
    .catch(reject);
  });
}
exports.installPeerDependencies = installPeerDependencies;

/**
 * Adds modules to the backend's peerDependencies automatically
 * with dependency management
 *
 * @todo investigate DepTree's issue with peerDependencies that depend on each other!
 * @todo this might not really be needed anymore!
 * @param   {Object}  backendPath Path to the backend folder
 * @return  {Promise}
 * @api public
 */
function addPeerDependenciesToMain(backendPath) {
  return new Promise(function(resolve, reject) {
    var pkgPath      = path.join(backendPath.moduleDir, 'package.json')
      , projectPkg   = require(pkgPath)
      , dependencies = {}
      , walk         = require('findit')(path.join(backendPath.moduleDir, backendPath.modulePath));

    walk.on('file', function inspectFile(file) {
      if (path.basename(file) === 'package.json') {
        var packageJson = require(file);

        packageJson.peerDependencies = packageJson.peerDependencies || [];

        if (Object.keys(dependencies).indexOf(packageJson.name) === -1) {
          dependencies[packageJson.name] = packageJson.version;
        }

        Object.keys(packageJson.peerDependencies).forEach(function(dependencyName){
          if (Object.keys(dependencies).indexOf(dependencyName) === -1) {
            dependencies[dependencyName] = packageJson.peerDependencies[dependencyName];
          }
        });
      }
    });

    walk.on('end', function() {

      projectPkg.peerDependencies = dependencies;

      fs.writeFile(pkgPath, JSON.stringify(projectPkg, null, '  '), function(err) {
        if (!!err) {
          return reject(err);
        }

        resolve();
      });
    });
  });
}
exports.addPeerDependenciesToMain = addPeerDependenciesToMain;
