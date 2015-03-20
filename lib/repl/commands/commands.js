module.exports = function(Table, env, lib, repl, local) {
  function Commands() {
    this.help    = 'Lists all of the REPL commands';
    this.aliases = ['h', 'help'];
    this.table   = new Table({
      head: [
        'Command',
        'Description'
      ],
      style: {
        head: [
          'yellow'
        ],
        compact: true
      }
    });
  }

  Commands.prototype.indexCommands = function() {
    Object.keys(local.commands).forEach(function getCommandsHelpText(cmd) {
      var command = local.commands[cmd];
      if (!!command && typeof command.action === 'function') {
        this.table.push([
          lib.colors.orange(cmd[0] === '.' ? cmd : '.' + cmd),
          lib.colors.darkGray(local.commands[cmd].help)
        ]);
      }
    }
    .bind(this));
  };

  Commands.prototype.action = function() {
    if (!this.table.length) {
      this.indexCommands();
    }

    return this.outputTable();
  };

  Commands.prototype.outputTable = function() {
    console.log(this.table.toString());
    return local.displayPrompt();
  };

  return Commands;
};
