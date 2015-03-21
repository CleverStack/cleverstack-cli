var repl     = require('repl')
  , path     = require('path')
  , semver   = require('semver')
  , major    = semver.major(process.version)
  , minor    = semver.minor(process.version)
  , lib      = require(process.env.libDir)
  , env      = require(path.join(__dirname, 'boot')).env
  , Table    = require('cli-table')
  , injector = require('clever-injector')()
  , cmds     = require('require-folder-tree')(path.resolve(path.join(__dirname, 'repl', 'commands')));

injector.instance('_',     require('lodash'));
injector.instance('repl',  repl);
injector.instance('lib',   lib);
injector.instance('env',   env);
injector.instance('Table', Table);
injector.instance('util',  require('util'));

lib.utils.success('Welcome to CleverStack ' + lib.colors.darkGray(' using seed version ' + env.packageJson.version));
lib.utils.success('Type .commands or .help for a list of commands');

var local = repl.start({
  prompt          : 'cleverstack::' + (process.env.NODE_ENV ? process.env.NODE_ENV : 'local') +  '> ',
  useGlobal       : true,
  ignoreUndefined : true
});
injector.instance('local', local);

Object.keys(cmds).forEach(function addCommandToRepl(cmdName) {
  injector.inject(cmds[cmdName], function(Command) {
    var name = (major === 0 && minor <= 10) ? ('.' + cmdName) : cmdName;

    cmds[cmdName] = new Command();

    local.commands[name] = {
      help   : cmds[cmdName].help,
      action : cmds[cmdName].action.bind(cmds[cmdName])
    };

    if (cmds[cmdName].aliases) {
      cmds[cmdName].aliases.forEach(function(alias) {
        var aliasName = (major === 0 && minor <= 10) ? '.' + alias : alias;

        local.commands[aliasName] = {
          help   : 'Alias for .' + cmdName,
          action : cmds[cmdName].action.bind(cmds[cmdName])
        };
      });
    }
  });
});

local.on('exit', function() {
  process.exit(0);
});
