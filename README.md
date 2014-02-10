# CleverStack CLI

[![Build Status](https://travis-ci.org/CleverStack/cleverstack-cli.png?branch=master)](https://travis-ci.org/CleverStack/cleverstack-cli)

![CleverStack CLI](http://cleverstack.github.io/assets/img/logos/clevertech-seed-logo-clean.png "CleverStack CLI")

A command line interface (CLI) for the [CleverStack](http://cleverstack.io) ecosystem.

## Installation

```npm install cleverstack-cli -g```

## Prerequisites

cleverstack-cli depends on [NPM](http://npmjs.org/) and [Bower](http://bower.io/) and for "npm" and "bower" to be located in your `$PATH`

```npm install bower -g```

## Quick Setup Tutorial

### Initialize a new project

Initializing a new project will download and grab CleverStack's [cleverstack-angular-seed](https://github.com/clevertech/cleverstack-angular-seed) and [cleverstack-node-seed](https://github.com/clevertech/cleverstack-node-seed) seeds. After initializing the project, cleverstack-cli will automatically install any depedencies that are required through [NPM](http://npmjs.org) and [Bower](http://bower.io).

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
├── odm
│   └── MyNewModelModel.js
└── orm
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
│   ├── odm
│   │   └── MyNewModuleModel.js
│   └── orm
│       └── MyNewModuleModel.js
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
│   ├── odm
│   │   └── MyNewModuleModel.js
│   └── orm
│       └── MyNewModuleModel.js
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

    service <name>         Generates a service as <name> within $PWD/services
    services <names>       Generates services specified with <name ...> within $PWD/services
    controller <name>      Generates a controller as <name> within $PWD/controllers
    controllers <names>    Generates controllers specified with <name ...> within $PWD/controllers
    model <name>           Generates a model as <name> within $PWD/models
    models <names>         Generates models specified with <name ...> within $PWD/models
    task <name>            Generates a task as <name> within $PWD/tasks
    tasks <names>          Generates tasks specified with <name ...> within $PWD/tasks
    test [options] <name>  Generates a test t as <name> within $PWD/tests
    tests [options] <names> Generates test specified with <name ...> within $PWD/tests

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

    <project>               Creates a project named <project>

  Options:

    -h, --help         output usage information
    --skip-protractor  Skips installing protractor
    -V, --version      output the version number

  Examples:
    clever init my-project
    clever init project-frontend frontend
    clever init my-project-everything backend frontend

  Installing specific versions:
    clever init my-project backend@<version>
    clever init my-project frontend@<version>
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

    -h, --help         output usage information
    --skip-protractor  Skips installing protractor
    -V, --version      output the version number

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

[http://cleverstack.io](http://cleverstack.io)

### CleverStack Wiki

An online Wiki which can provide support for install, configurations and troubleshooting.

[http://wiki.cleverstack.io](http://wiki.cleverstack.io)

### Official CleverStack Backend Seed

[cleverstack-node-seed](https://github.com/clevertech/cleverstack-node-seed)

### Official CleverStack Frontend Seed

[cleverstack-angular-seed](https://github.com/clevertech/cleverstack-angular-seed)

## Running Tests

To run the test suite, first invoke the following command within the repo, installing the development dependencies:

    $ npm install

Then run the tests:

    $ make test

## Contributors

  https://github.com/CleverStack/cleverstack-cli/graphs/contributors

## License

(The MIT License)

Copyright (c) 2014 CleverTech http://www.clevertech.biz/contact-form/

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
