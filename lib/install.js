var Promise  = require('bluebird')
  , _        = require('lodash')
  , https    = require('follow-redirects').https
  , utils    = GLOBAL.lib.utils
  , search   = GLOBAL.lib.search
  , packages = GLOBAL.lib.packages
  , util     = GLOBAL.lib.util;

/**
 * Launches the installation process
 * Checks for seed folders depending on CWD
 * Separates which packages we need via Bower and NPM
 * Installs the NPM/Bower modules within the seeds
 *
 * @param  {Array} repos
 * @return {Promise}
 * @api private
 */
function install(repos) {
  return new Promise(function(resolve, reject) {
    util.locations
      .findAvailableCommands()
      .spread(function(locations) {
        return search.aggregate(repos).spread(function(npm, bower) {
          return [ locations, npm, bower ];
        });
      })
      .spread(function(locations, npm, bower) {
        var actions = []
         // todo: make this into a function...
         // todo: also make packages.locations() a prototype for .isBackend() utility functions, etc.
          , backend = _.find(locations, function(location) {
            return location.name === 'backend';
          })
          , frontend = _.find(locations, function(location) {
            return location.name === 'frontend';
          });

        if (typeof backend === 'undefined' && frontend === 'undefined') {
          utils.fail('Couldn\'t find a CleverStack seed. Please make sure that you\'re trying to install within your CleverStack project.');
        }

        if (typeof backend === 'undefined') {
          npm = [];
        }

        if (typeof frontend === 'undefined') {
          bower = [];
        }

        if (npm.length < 1 && bower.length < 1) {
          utils.fail('No modules to install, please make sure you\'re tring to install CleverStack compatible modules and that you\'re in the correct seed folder.');
        }

        if (npm.length > 0) {
          actions.push(packages.installWithNpm(backend, npm));
        }

        if (bower.length > 0) {
          actions.push(packages.installWithBower(frontend, bower));
        }

        Promise
          .all(actions)
          .then(function() {
            resolve([ backend, frontend, npm, bower ]);
          })
          .catch(function(err) {
            reject(err);
          });
      })
      .catch(function(err) {
        reject(err);
      });
  });
}

exports.run = function(args) {
  return new Promise(function(resolve, reject) {
    install(args)
      .spread(function() {
        resolve();
      }, function (err) {
        reject(err);
      });
  });
};

/**
 * Returns JSON object from an HTTP(S) request
 *
 * @param  {Object} options HTTP Object
 * @return {Promise}        Returns a promise from bluebird
 * @public
 */
exports.getJSON = function(options) {
  return new Promise(function(resolve) {
    var req = https.request(options, function(res) {
      res.setEncoding('utf-8');

      if (res.statusCode !== 200) {
        return resolve();
      }

      var responseString = '';

      res.on('data', function(data) {
        responseString += data;
      });

      res.on('end', function() {
        var body = JSON.parse(responseString);
        resolve(body);
      });
    });

    req.end();
  });
};
