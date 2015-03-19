module.exports = function(Table, env, lib, repl, local, util, _) {
  var serviceFuncs = ['find', 'findAll', 'create', 'update', 'destroy'];

  function Services() {
    this.help      = 'Lists all of the services within this project';
    this.services  = {};
    this.table     = new Table({
      head: [
        'Name',
        'Uses Model'
      ],
      style : {
        head: [
          'yellow'
        ],
        compact: true
      }
    });

    env.moduleLoader.on('modulesLoaded', function() {
      this.services = require('services');

      // Wrap each public function in order to omit the need for then()/catch()...
      Object.keys(this.services).forEach(function(serviceName) {
        serviceFuncs.forEach(function(fn) {
          this.services[serviceName][fn] = _.wrap(this.services[serviceName][fn], function(func) {
            func
              .apply(this.services[serviceName], Array.prototype.slice.call(arguments, 1))
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

        // Load the service into REPL's context...
        local.context[serviceName] = this.services[serviceName];
      }
      .bind(this));

      // Load all of the services into REPL's context...
      local.context.services = this.services;
    }
    .bind(this));
  }

  Services.prototype.indexServices = function() {
    Object.keys(this.services).forEach(function(serviceName) {
      var service = this.services[serviceName];
      this.table.push([service._name, (service.model !== undefined && service.model.modelName ? service.model.modelName : '')]);
    }
    .bind(this));
  };

  Services.prototype.action = function() {
    if (!this.table.length) {
      this.indexServices();
    }

    return this.outputTable();
  };

  Services.prototype.outputTable = function() {
    console.log(this.table.toString());
    return local.displayPrompt();
  };

  return Services;
};
