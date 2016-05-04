var path    = require('path')
  , fs      = require('fs')
  , lib     = require(process.env.libDir)
  , tryPath = path.resolve(path.join(process.env.projectDir, 'lib', 'utils'))
  , utils;

if (fs.existsSync(tryPath)) {
  try {
    utils = require(tryPath);
  } catch (error) {
    if (error.code === 'ENOENT' && error.path.match(/lib\.json$/) !== null) {
      lib.utils.fail('CleverStack couldn\'t find the environment configuration file. Please make sure you set your NODE_ENV envrionment variable.');
    } else {
      lib.utils.fail(error);
    }
  }
}

if (utils === null) {
  lib.utils.fail('Couldn\'t find the backend CleverStack directory! Possible reasons could include:\n* Not running the command within the root folder of the project\n* Not setting the correct NODE_PATH environment variable');
}

// Bootstrap the environment
var env = utils.bootstrapEnv();

// Load all the modules
try {
  // Fire the routesInitialized event so that our templated event handlers are parsed
  env.moduleLoader.on('modulesLoaded', function() {
    env.moduleLoader.emit('routesInitialized');
  });
  env.moduleLoader.loadModules();
} catch (_error) {
  if (_error.code === 'MODULE_NOT_FOUND') {
    lib.utils.fail('Couldn\'t find the backend CleverStack directory! Possible reasons could include:\n* Not running the command within the root folder of the project\n* Not setting the correct NODE_PATH environment variable');
  }
}

exports.env = env;
