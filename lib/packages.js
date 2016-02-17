var Promise     = require('bluebird')
  , zlib        = require('zlib')
  , async       = require('async')
  , path        = require('path')
  , fs          = require('fs')
  , ncp         = require('ncp')
  , rimraf      = require('rimraf')
  , tar         = require('tar')
  , _url        = require('url')
  , https       = require('follow-redirects').https
  , proxyAgent  = require('https-proxy-agent')
  , project     = GLOBAL.lib.project
  , utils       = GLOBAL.lib.utils;

/**
 * Downloads the package, unzips and untars into dir
 *
 * @param  {Object} options Agent Options
 * @param  {String} dir     Path to untar to
 * @return {Promise}        Returns a promise provided by Bluebird
 * @private
 */

function download(options, dir) {
  return new Promise(function(resolve, reject) {
    var req = https.request(options, function(res) {
      res
      .pipe(zlib.Unzip())
      .pipe(tar.Extract({ strip: 1, path: dir }))
      .on('error', function(err) {
        reject(err);
      })
      .on('end', function() {
        resolve();
      });
    });

    req.end();
  });
}

/**
 * Downloads from GitHub or the optional url param
 * then it will unzip and extract into dir
 *
 * @param  {Object} pkg
 * @param  {String=} url
 * @param  {String} dir
 * @return {Promise}
 * @api public
 */

var get = exports.get = function(pkg, url, dir) {
  if (arguments.length < 3) {
    var name = pkg.name.split('@')[ 0 ];
    dir = url;
    url = 'https://github.com/' + pkg.owner + '/' + name + '/archive/master.tar.gz';
  }

  var Pkg = [];
  if (pkg.name.indexOf('@') > -1) {
    Pkg = pkg.name.split('@');
  } else if (pkg.hasOwnProperty('version') && pkg.hasOwnProperty('bower') && pkg.bower === true) {
    Pkg = [ pkg.name, pkg.version ];
  }

  if (Pkg.length > 0) {
    url = 'https://github.com/' + pkg.owner + '/' + Pkg[ 0 ] + '/archive/' + Pkg[ 1 ] + '.tar.gz';
  }

  var parsed  = _url.parse(url)
    , options = {
      hostname: parsed.hostname,
      path: parsed.path,
      method: 'GET',
      port: 443,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip,deflate,sdch',
        'Accept-Language': 'en-US,en;q=0.8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'User-Agent': 'cleverstack'
      },
      rejectUnauthorized: false,
      secureProtocol: require('constants').SSL_OP_NO_TLSv1_2
    };

  var proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || null;
  if (proxy !== null) {
    options.agent = new proxyAgent(proxy);
  } else {
    options.agent = new https.Agent(options);
  }

  return download(options, dir);
};

/**
 * Installs bower components into the correct path for
 * the frontend seed
 *
 * @param  {Object}   location Object returned from util.locations.get()
 * @param  {String[]} packages Module/package names
 * @return {Promise}
 * @api public
 */

var installFrontendModules = exports.installFrontendModules = function(location, packages) {
  return new Promise(function(resolve, reject) {
    async.eachSeries(
      packages,
      function(pkg, next) {
        utils.info('  Checking bower.json file for instructions within ' + pkg.name);

        var bowerFile = path.join(location.moduleDir, location.modulePath, pkg.name, 'bower.json');

        if (!fs.existsSync(bowerFile)) {
          return next();
        }

        var bowerJson       = require(bowerFile)
          , name            = typeof bowerJson.rename === 'string' ? bowerJson.rename : pkg.name
          , moduleLocation  = path.resolve(path.join(location.moduleDir, location.modulePath, name));

        // todo: ask for confirmation first...
        // if (fs.existsSync(moduleLocation) || path.dirname(bowerFile) === moduleLocation) {
        //   return next();
        // }

        ncp(path.dirname(bowerFile), moduleLocation, function(err) {
          if (!!err) {
            return reject(err);
          }

          rimraf(path.dirname(bowerFile), function(err) {
            if (!!err) {
              return reject(err);
            }

            if (pkg.name !== name) {
              utils.info('  Finished renaming ' + pkg.name + ' to ' + name);
            }
            next();
          });
        });
      },
    function(err) {
      if (!!err) {
        return reject(err);
      }

      resolve();
    });
  });
};

/**
 * Installs Bower packages within the frontend seed.
 *
 * @param  {Object} location
 * @param  {Array} packages
 * @return {Promise}
 * @api public
 */

exports.installWithBower = function(location, packages) {
  return new Promise(function(resolve, reject) {
    async.each(
      packages,
      function(pkg, next) {
        if (!pkg.hasOwnProperty('url')) {
          return next();
        }

        var dir = path.join(location.moduleDir, location.modulePath, pkg.name);

        utils.warn('  Installing ' + pkg.name + '...');
        get(pkg, dir)
          .then(function() {
            next();
          }, function(err) {
            next(err);
          });
      },
      function(err) {
        if (!!err) {
          return reject(err);
        }

        installFrontendModules(location, packages)
        .then(function() {
          return project.installBowerComponents(location);
        })
        .then(function() {
          utils.progress();
          resolve();
        }, function(err) {
          reject(err);
        });
      }
     );
  });
};

/**
 * Installs NPM packages (from modules) and installs any dependencies
 * The reason why we need to do each package one-by-one
 * is due to the fact that we need to utilize the --prefix
 * npm option. Which sets the current node_module path
 *
 * @param  {Object} location
 * @param  {Array} packages
 * @return {Promise}
 * @api public
 */

// todo: Strip out the need for npm install and directly use the installWithNPM() function
var installNpmModules = exports.installNpmModules = function(location, packages) {
  return new Promise(function(resolve, reject) {
    async.eachSeries(
      packages,
      function(pkg, next) {
        project
          .installModule(location, path.join(location.moduleDir, location.modulePath, pkg.name))
          .then(function() {
            next();
          }, next);
      },
      function(err) {
        if (!!err) {
          return reject(err);
        }

        resolve();
      });
  });
};

/**
 * Installs NPM modules through tarball links
 *
 * @param  {Objects} location
 * @param  {Array} packages
 * @return {Promise}
 * @api public
 */

exports.installWithNpm = function(location, packages) {
  return new Promise(function(resolve, reject) {
    async.each(
      packages,
      function(pkg, next) {
        if (!pkg.hasOwnProperty('dist') || !pkg.dist.hasOwnProperty('tarball')) {
          return next();
        }

        utils.warn('  Installing ' + pkg.name + '...');
        utils.running('Installing ' + pkg.name + '...');

        get(pkg, pkg.dist.tarball, path.join(location.moduleDir, location.modulePath, pkg.name))
          .then(function() {
            next();
          }, next);
      },
      function (err) {
        if (!!err) {
          return reject(err);
        }

        installNpmModules(location, packages)
          .then(function() {
            utils.progress();
            resolve();
          }, function(err) {
            reject(err);
          });
      }
     );
  });
};
