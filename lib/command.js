var spawn = require('child_process').spawn
  , path  = require('path')
  , fs    = require('fs');

/**
 * Launches the main clever bin program
 *
 * @param  {String} thePath
 * @param  {Commander} program
 * @param  {String} cmd
 * @param  {String[]} args
 * @api public
 */

module.exports = function (thePath, program, cmd, args) {
  if (arguments.length < 4) {
    args    = cmd;
    cmd     = program;
    program = require(path.join(__dirname, 'program'));
  }

  if (arguments.length < 2) {
    cmd = 'clever';
  }

  if (!cmd) {
    program.help();
  }

  // executable name
  var bin = 'clever-' + cmd;
  if (cmd === 'clever') {
    bin = 'clever';
  }

  // local or resolve to absolute executable path
  var local = path.join(thePath, bin);

  if (fs.existsSync(local)) {
    bin = local;
  } else {
    // @TODO Support windows here
    bin = process.env.PATH.split(':').reduce(function(binary, p) {
      p = path.resolve(p, bin);
      return fs.existsSync(p) && fs.statSync(p).isFile() ? p : binary;
    }, bin);
  }

  // if the bin doesn't exist within the cleverstack binary, try in the path
  if (!fs.existsSync(bin)) {
    bin = path.join(__dirname, cmd);

    // if bin/cmd doesn't exist, then try clever- prefix
    if (!fs.existsSync(bin)) {
      bin = path.join(__dirname, 'clever-' + cmd);
      
      // try finding it within the project folder...
      if (!fs.existsSync(bin)) {
        bin = path.join(process.cwd(), 'bin', 'clever-' + cmd);
      }
    }
  }

  // display help if bin does not exist
  if (!fs.existsSync(bin)) {
    console.error('\n  %s command does not exist', bin);
    program.help();
    process.exit(0);
  }

  // Windows support
  args.unshift(bin);

  var processEnv        = process.env;
  processEnv.cliDir     = path.resolve(path.join(__dirname, '..'));
  processEnv.libDir     = path.join(processEnv.cliDir, 'lib');

  // spawn
  var proc = spawn('node', args, { stdio: 'inherit', env: processEnv });
  proc.on('close', function(code) {
    process.exit(code);
  });
};
