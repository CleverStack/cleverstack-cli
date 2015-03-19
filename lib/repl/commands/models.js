module.exports = function(Table, env, lib, repl, local, util, _) {
  var ormFuncs = [
    'all', 'find', 'create', 'update', 'describe', 'findAll', 'findOrCreate',
    'findAndCountAll', 'findAllJoin', 'findOrInitialize', 'findOrBuild', 'bulkCreate',
    'destroy', 'aggregate', 'build', 'count', 'min', 'max'
  ];

  function Models() {
    this.help   = 'Lists all of the models within this project';
    this.models = {};
    this.table = new Table({
      head: [
        'ModelName'
      ],
      style : {
        head: [
          'yellow'
        ],
        compact: true
      }
    });

    env.moduleLoader.on('modulesLoaded', function() {
      var _models = require('models');

      // Wrap each public function in order to omit the need for then()/catch()...
      Object.keys(_models).forEach(function(key) {
        var modelName = key + 'Model';

        this.models[modelName] = _models[key] || {};

        ormFuncs.forEach(function(fn) {
          this.models[modelName][fn] = _.wrap(this.models[modelName][fn], function(func) {
            func
              .apply(this.models[modelName], Array.prototype.slice.call(arguments, 1))
              .then(function(res) {
                console.log(util.inspect(res, { depth: 4, colors: true }));
                local.displayPrompt();
              })
              .catch(function(err) {
                console.error(lib.colors.red(err));
                local.displayPrompt();
              });
          }
          .bind(this));
        }
        .bind(this));

        // Load the model into REPL's context...
        local.context[modelName] = this.models[modelName];
      }
      .bind(this));

      // Load all of the models into REPL's context...
      local.context.models = this.models;
    }
    .bind(this));
  }

  Models.prototype.indexModels = function() {
    Object.keys(this.models).forEach(function(modelName) {
      var model = this.models[modelName];
      this.table.push([
        model.modelName + 'Model',
        // Object.keys(model.fields).join(',\n')
      ]);
    }
    .bind(this));
  };

  Models.prototype.action = function() {
    if (!this.table.length) {
      this.indexModels();
    }

    return this.outputTable();
  };

  Models.prototype.outputTable = function() {
    console.log(this.table.toString());
    return local.displayPrompt();
  };

  return Models;
};
