module.exports = function(Table, env, lib, repl, local) {
  function Modules() {
    this.help  = 'Lists all of the modules within this project';
    this.table = new Table({
      head: [
        'Name',
        'Version',
        'Status',
        'Description'
      ],
      style : {
        head: [
          'yellow'
        ],
        compact: true
      }
    });
  }

  Modules.prototype.indexModules = function() {
    env.moduleLoader.modules.forEach(
      function listModuleRow(csModule) {
        this.table.push([
          lib.colors.orange(csModule.pkg.name),
          lib.colors.green(csModule.pkg.version),
          lib.colors.green('Ok'),
          lib.colors.darkGray(csModule.pkg.description)
        ]);
      }
      .bind(this)
    );
  };

  Modules.prototype.action = function() {
    if (!this.table.length) {
      this.indexModules();
    }

    return this.outputTable();
  };

  Modules.prototype.outputTable = function() {
    console.log(this.table.toString());
    return local.displayPrompt();
  };

  return Modules;
};
