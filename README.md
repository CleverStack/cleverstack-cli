# CleverStack CLI

[![NPM version](https://badge.fury.io/js/cleverstack-cli.png)](http://badge.fury.io/js/cleverstack-cli) [![GitHub version](https://badge.fury.io/gh/cleverstack%2Fcleverstack-cli.png)](http://badge.fury.io/gh/cleverstack%2Fcleverstack-cli) [![Dependency Status](https://david-dm.org/CleverStack/cleverstack-cli.png)](https://david-dm.org/CleverStack/cleverstack-cli) [![devDependency Status](https://david-dm.org/CleverStack/cleverstack-cli/dev-status.png)](https://david-dm.org/CleverStack/cleverstack-cli#info=devDependencies) [![Code Climate](https://codeclimate.com/github/CleverStack/cleverstack-cli.png)](https://codeclimate.com/github/CleverStack/cleverstack-cli) [![Build Status](https://secure.travis-ci.org/CleverStack/cleverstack-cli.png?branch=master)](https://travis-ci.org/CleverStack/cleverstack-cli) [![NPM downloads](http://img.shields.io/npm/dm/cleverstack-cli.png)](https://www.npmjs.org/package/cleverstack-cli) [![Coverage](https://codeclimate.com/github/CleverStack/cleverstack-cli/coverage.png)](https://codeclimate.com/github/CleverStack/cleverstack-cli) 


![CleverStack CLI](http://cleverstack.github.io/assets/img/logos/clevertech-seed-logo-clean.png "CleverStack CLI")

A command line interface (CLI) for the [CleverStack](http://cleverstack.io) ecosystem.

## Installation

```npm install cleverstack-cli -g```

## Prerequisites

cleverstack-cli depends on [NPM](http://npmjs.org/), [GruntJS](http://gruntjs.com) and [Bower](http://bower.io/) and for "npm", "grunt" and "bower" to be located in your `$PATH`

```npm install bower -g```

```npm install grunt-cli -g```

## Table of Contents

[Quick Setup Tutorial](https://github.com/CleverStack/cleverstack-cli#quick-setup-tutorial)
  1. [Initialize a new project](https://github.com/CleverStack/cleverstack-cli#initialize-a-new-project)
  2. [Installing a module](https://github.com/CleverStack/cleverstack-cli#installing-a-module)
  3. [Removing a module](https://github.com/CleverStack/cleverstack-cli#removing-a-module)
  4. [Running tests](https://github.com/CleverStack/cleverstack-cli#running-tests)

[Quick Tutorial for Building a New Module](https://github.com/CleverStack/cleverstack-cli#quick-tutorial-for-building-a-new-module)
  1. [generate](https://github.com/CleverStack/cleverstack-cli#generate)
  2. [scaffold](https://github.com/CleverStack/cleverstack-cli#scaffold)
  3. [new](https://github.com/CleverStack/cleverstack-cli#new)
  4. [repl](https://github.com/CleverStack/cleverstack-cli#repl)

[Commands](https://github.com/CleverStack/cleverstack-cli#commands)
  1. [help](https://github.com/CleverStack/cleverstack-cli#help)
  2. [downgrade](https://github.com/CleverStack/cleverstack-cli#downgrade)
  3. [generate (g)](https://github.com/CleverStack/cleverstack-cli#generate-g)
  4. [init](https://github.com/CleverStack/cleverstack-cli#init)
  5. [list](https://github.com/CleverStack/cleverstack-cli#list)
  6. [new](https://github.com/CleverStack/cleverstack-cli#new-1)
  7. [remove](https://github.com/CleverStack/cleverstack-cli#remove)
  8. [repl](https://github.com/CleverStack/cleverstack-cli#repl-1)
  9. [scaffold (s)](https://github.com/CleverStack/cleverstack-cli#scaffold-s)
  10. [search](https://github.com/CleverStack/cleverstack-cli#search)
  11. [setup](https://github.com/CleverStack/cleverstack-cli#setup)
  12. [server (serve)](https://github.com/CleverStack/cleverstack-cli#server-serve)
  13. [test (tests)](https://github.com/CleverStack/cleverstack-cli#test-tests)
  14. [upgrade](https://github.com/CleverStack/cleverstack-cli#upgrade)

[Help & Resources](https://github.com/CleverStack/cleverstack-cli#help--resources)
  1. [CleverStack Website](https://github.com/CleverStack/cleverstack-cli#cleverstack-website)
  2. [CleverStack Wiki](https://github.com/CleverStack/cleverstack-cli#cleverstack-wiki)
  3. [Official CleverStack Backend Seed](https://github.com/CleverStack/cleverstack-cli#official-cleverstack-backend-seed)
  4. [Official CleverStack Frontend Seed](https://github.com/CleverStack/cleverstack-cli#official-cleverstack-frontend-seed)
[Running Tests](https://github.com/CleverStack/cleverstack-cli#running-tests-1)
[Contributors](https://github.com/CleverStack/cleverstack-cli#contributors)
[License](https://github.com/CleverStack/cleverstack-cli#license)

## Quick Setup Tutorial

### Initialize a new project

Initializing a new project will download and grab CleverStack's [angular-seed](https://github.com/CleverStack/angular-seed) and [node-seed](https://github.com/CleverStack/node-seed) seeds. After initializing the project, cleverstack-cli will automatically install any depedencies that are required through [NPM](http://npmjs.org) and [Bower](http://bower.io).

`$: clever init my-new-project`

You will be asked for database credentials, this is due to the fact that we currently run ```grunt db``` after the initialization. This will soon change, and your database credentials will only be asked for when you install a module that requires it.

This will create a new directory called **my-new-project** with two folders: **backend** and **frontend**.

`$: cd my-new-project && tree -d  -L 1`

```
.
├── backend
└── frontend

2 directories
```

### Installing a module

When installing a module, CleverStack will automatically detect:

1. If the module exists
2. If the module is for the frontend or the backend based on it's package.json's keywords.

The command is:

`$: clever install <modules>`

For a list of modules, visit [CleverStack's module page](http://cleverstack.io/modules/)

`$: clever install clever-background-tasks`

This will install ```clever-background-tasks``` within the ```backend/modules``` folder.

### Removing a module

When removing a module, CleverStack will:

1. Check to see which directory that you're in. If it detects both a backend and a frontend directory then it'll try to remove the module from both seeds.
2. Remain quiet / do nothing if the module does not exist within the module folders (unless there's absolutely nothing to remove).

`$: clever remove clever-background-tasks`

### Running tests

### Aliases tests

To ensure that everything is working correctly, you can run tests with:

`$: clever test unit`

CleverStack will run ```grunt test``` within each seed.

### Running the server

### Aliases: serve

`$: clever server`

## Quick Tutorial for Building a New Module

There are three commands to be aware of when building a module:

1. generate (or *g*)
2. scaffold (or *s*)
3. new

### generate

Generate will create a template of a specific component (controller, services, model, tasks, or tests) within module's name that's residing in your **current working directory.**

`$: tree -d -L 1`

```
.

0 directories
```

`$: clever g model my-new-model`

`$: tree . -d -L 1`

```
.
└── my-new-model

1 directory
```

`$: cd my-new-model && tree . -L 1`

```
.
└── models

1 directory, 0 files
```

`$: tree ./models`

```
./models
└── MyNewModelModel.js

2 directories, 2 files
```

### scaffold

Scaffolding is similar to generate except it'll generate every component's template for you.

**Note:** These files will be generated within your current working directory.

`$: tree -d -L 1`

```
.

0 directories
```

`$: clever s my-new-module`

`$: tree . -d -L 1`

```
.
└── my-new-module
```

`$: tree ./my-new-module -L 3`

```
./my-new-module
├── config
│   └── default.json
├── controllers
│   └── MyNewModuleController.js
├── models
│   └── MyNewModuleModel.js
├── schema
│   └── seedData.json
├── services
│   └── MyNewModuleService.js
├── tasks
│   └── MyNewModuleTask.js
└── tests
    ├── integration
    │   └── MyNewModuleTest.js
    └── unit
        └── MyNewModuleTest.js

11 directories, 9 files
```

### new

The ```new``` command is similar to ```scaffold``` except it'll create the module within the application's ```module``` folder.


`$: tree ./modules -d -L 1`

```
./modules
└── my-new-module

1 directory
```

`$: tree ./modules/my-new-module -L 3 `

```
./modules/my-new-module
├── config
│   └── default.json
├── controllers
│   └── MyNewModuleController.js
├── models
│   └── MyNewModuleModel.js
├── schema
│   └── seedData.json
├── services
│   └── MyNewModuleService.js
├── tasks
│   └── MyNewModuleTask.js
└── tests
    ├── integration
    │   └── MyNewModuleTest.js
    └── unit
        └── MyNewModuleTest.js

11 directories, 9 files
```

### repl

In order to interact with your environment's models directly, simply type in:

`$: clever repl`

## Commands

### help

`$: clever help`

```
  Usage: clever <command> [options]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

 Commands:

    downgrade - Downgrades a CleverStack implementation
    help - Displays this help message
    init <project> [backend|frontend] - Initialized a new project
    generate <option> <name> - Generates a controller, service, model, etc. individually
    repl - Starts the CleverStack REPL
    scaffold <name> - Generates a controller, service, model, etc.
    search [query] - Searches for a cleverstack module
    setup - Installs NPM & Bower packages for each module and adds modules to bundleDependencies
    server - Starts the CleverStack server
    test - Runs tests within your CleverStack environment
    upgrade - Upgrades a CleverStack implementation
```

### downgrade

Downgrades to the next version (or specified version) of the seed/module (depending on what directory that you're currently in).

**Note:** This command must run under project's root directory (where frontend and backend are).

`$: clever downgrade -h`

```
  Usage: clever-downgrade [options]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

  Examples:

    clever downgrade clever-orm
    clever downgrade clever-orm@0.0.1 clever-datatables@0.0.1
    clever downgrade backend
    clever downgrade frontend
```

### generate (g)

`$: clever generate -h`

```
  Usage: clever-generate [options] [command]

  Commands:

    service <name>         Generates a service as <name> within /Users/jenniferhartwig/services
    services <names>       Generates services specified with <name ...> within /Users/jenniferhartwig/services
    controller <name>      Generates a controller as <name> within /Users/jenniferhartwig/controllers
    controllers <names>    Generates controllers specified with <name ...> within /Users/jenniferhartwig/controllers
    model <name>           Generates a model as <name> within /Users/jenniferhartwig/models
    models <names>         Generates models specified with <name ...> within /Users/jenniferhartwig/models
    task <name>            Generates a task as <name> within /Users/jenniferhartwig/tasks
    tasks <names>          Generates tasks specified with <name ...> within /Users/jenniferhartwig/tasks
    view <name>            Generates a view as <name> within /Users/jenniferhartwig/views
    views <names>          Generates views specified with <name ...> within /Users/jenniferhartwig/views
    factory <name>         Generates a factory as <name> within /Users/jenniferhartwig/factories
    factories <names>      Generates factories specified with <name ...> within /Users/jenniferhartwig/factories
    service <name>         Generates a service as <name> within /Users/jenniferhartwig/services
    services <names>       Generates services specified with <name ...> within /Users/jenniferhartwig/services
    directive <name>       Generates a directive as <name> within /Users/jenniferhartwig/directives
    directives <names>     Generates directives specified with <name ...> within /Users/jenniferhartwig/directives
    test [options] <name>  Generates a test t as <name> within /Users/jenniferhartwig/tests
    tests [options] <names> Generates test specified with <name ...> within /Users/jenniferhartwig/tests

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

  Example:

    clever generate model users
    clever generate controller users
    clever g controller users
    clever g controllers users auth email
```

### init

`$: clever init -h`

```
  Usage: clever-init [options] [command]

  Commands:

    <project>              creates a new project named <project>

  Options:

    -h, --help             output usage information
    -f, --force            delete existing projects in your current directory /Users/jenniferhartwig
    -v, --verbose          verbose output useful for debugging
    -A, --allow-root       allow root for bower
    -S, --skip-protractor  skips installing protractor (Frontend only)
    -V, --version          output the version number

  Examples:

    clever init my-project                      install the backend and frontend
    clever init my-project clever-auth          with the clever-auth module
    clever init my-project backend frontend     verbose way of running "clever init my-project"
    clever init my-project frontend             only install the frontend
    clever init my-project backend clever-auth  install the clever-auth module after installing the backend and frontend seeds

    Installing specific versions:

      clever init my-project backend@<version>
      clever init my-project clever-auth@<version>
```

### list

Lists all modules available for CleverStack.

`$: clever list -h`

```
  Usage: clever-list [options]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

  Example:
    clever list
```

### new

`$: clever new -h`

```
  Usage: clever-new [options] <name>

  Options:

    -h, --help       output usage information
    -V, --version    output the version number
    --no-service     Disables generating a service.
    --no-controller  Disables generating a controller.
    --no-model       Disables generating a model.
    --no-task        Disables generating a task.
    --no-test        Disables generating a test.

  Example:
    clever new my_module
    clever new myModule
```

### remove

Removes a module from the project.

`$: clever remove -h`

```
  Usage: clever-remove [options] [modules ...]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

  Examples:
    clever remove clever-background-tasks
    clever remove auth clever-background-tasks
```

### repl

Creates a REPL instance within your project's environment. Useful for executing ORM/Model commands.

**Note:** You must set the ```NODE_ENV``` environment variable.

`$: NODE_ENV=local clever repl`

```
Scanning for seed locations...
Welcome to CleverStack version 0.0.2
Type .commands or .help for a list of commands
cleverstack::local> .commands
.commands   Lists all of the REPL commands
.help       Alias for .commands
.h          Alias for .commands
.modules    List all of the modules within this project
.models     Lists all models
.exit       Exits the CleverStack REPL
.quit       Alias for .exit
.q          Alias for .exit
.history    Show command history
cleverstack::local> .quit
```

### scaffold (s)

`$: clever scaffold -h`

```
  Usage: clever-scaffold [options] <name>

  Options:

    -h, --help       output usage information
    -V, --version    output the version number
    --no-service     Disables generating a service.
    --no-controller  Disables generating a controller.
    --no-model       Disables generating a model.
    --no-task        Disables generating a task.
    --no-test        Disables generating a test.

  Note:
    Scaffold will generate templates within $PWD
    If you wish to generate an entire model use clever new <name>

  Example:
    clever scaffold my_component
    clever scaffold myComponent
```

### search

`$: clever search -h`

```
  Usage: clever-search [options]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

  Examples:
    clever search users
    clever search users auth email
```

### setup

`$: clever setup -h`

```
  Usage: clever-setup [options]

  Options:

    -h, --help             output usage information
    -A, --allow-root       allow root for bower
    -S, --skip-protractor  skips installing protractor (Frontend only)
    -v, --verbose          verbose output useful for debugging
    -V, --version          output the version number

  Description:

    Installs all NPM and Bower components for each module as well as building bundleDependencies.
    This command will also install Protractor unless explicitly skipping.

  Examples:

    clever setup
```

### server (serve)

`$: clever server -h`

```
  Usage: clever-server [options]

  Options:

    -h, --help         output usage information
    -V, --version      output the version number
    -x, --host [host]  Set the host for grunt server
    -p, --port [port]  Set the port for grunt server

  Example:
    clever server
    clever --host 10.0.0.0 server
    clever --port 7777 server
```

### test (tests)

`$: clever test -h`

```
  Usage: clever-test [options] [command]

  Commands:

    e2e                    Runs e2e tests
    unit                   Runs unit tests
    coverage               Generates unit test coverage reports.

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

  Examples:

    clever test coverage
    clever test e2e
    clever test unit
```

### upgrade

`$: clever upgrade -h`

```
  Usage: clever-upgrade [options]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

  Examples:

    clever upgrade clever-orm
    clever upgrade clever-orm@0.0.3 clever-datatables@0.0.2
    clever upgrade backend
    clever upgrade frontend
```

## Help & Resources

### CleverStack Website

[http://cleverstack.io](http://cleverstack.io/developer)

### CleverStack Wiki

An online Wiki which can provide support for install, configurations and troubleshooting.

https://github.com/CleverStack/cleverstack-cli/wiki

### Official CleverStack Backend Seed

[node-seed](https://github.com/CleverStack/node-seed)

### Official CleverStack Frontend Seed

[angular-seed](https://github.com/CleverStack/angular-seed)

### Communication

* HipChat: [http://www.hipchat.com/gwM43u4Mw](http://www.hipchat.com/gwM43u4Mw)
* Stackoverflow: [http://stackoverflow.com/questions/tagged/cleverstack](http://stackoverflow.com/questions/tagged/cleverstack)
* Google Groups/Mailing list: [https://groups.google.com/forum/#!forum/cleverstack](https://groups.google.com/forum/#!forum/cleverstack)

## Running Tests

To run the test suite, first invoke the following command within the repo, installing the development dependencies:

    $ npm install

Then run the tests:

    $ make test

## Contributors

  https://github.com/CleverStack/cleverstack-cli/graphs/contributors

## License

See our [LICENSE](https://github.com/CleverStack/cleverstack-cli/blob/master/LICENSE)