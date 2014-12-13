var repl        = require( 'repl' )
  , tab         = require( 'tab' )
  , fs          = require( 'fs' )
  , _           = require( 'lodash' )
  , path        = require( 'path' )
  , util        = require( 'util' )
  , lib         = require( process.env.libDir )
  , env         = require( path.join( __dirname, 'boot' ) ).env
  , moduleLdr   = env.moduleLoader;

lib.utils.success( 'Welcome to CleverStack ' + lib.colors.darkGray( ' using seed version ' + env.packageJson.version ) );
lib.utils.success( 'Type .commands or .help for a list of commands' );

// thanks to: https://github.com/jashkenas/coffee-script/blob/master/lib/coffee-script/repl.js#L97
var addHistory = function( repl, filename, maxSize ) {
    var buffer, fd, lastLine, readFd, size, stat;

    lastLine = null;

    try {
        stat    = fs.statSync( filename );
        size    = Math.min( maxSize, stat.size );
        readFd  = fs.openSync( filename, 'r' );
        buffer  = new Buffer( size );
        fs.readSync( readFd, buffer, 0, size, stat.size - size );
        repl.rli.history = buffer.toString().split( '\n' ).reverse();
        if ( stat.size > maxSize ) {
            repl.rli.history.pop();
        }
        if ( repl.rli.history[ 0 ] === '' ) {
            repl.rli.history.shift();
        }
        repl.rli.historyIndex = -1;
        lastLine = repl.rli.history[ 0 ];
    } catch ( _error ) {}

    fd = fs.openSync( filename, 'a' );

    repl.rli.addListener( 'line', function( code ) {
        if ( code && code.length && code !== '.history' && lastLine !== code ) {
            fs.write( fd, "" + code + "\n" );
            lastLine = code;
            return;
        }
    });

    repl.rli.on( 'exit', function() {
        return fs.close( fd );
    });

    repl.commands = {
        '.commands': {
            help: 'Lists all of the REPL commands',
            action: function() {
                var cmds = [];

                Object.keys( this.commands ).forEach( function( cmd ) {
                    cmds.push( [ lib.colors.orange( cmd ), lib.colors.darkGray( this.commands[ cmd ].help ) ] );
                }.bind( this ) );

                tab.emitTable({
                    columns: [
                        {
                            label: 'cmd',
                            width: 27
                        },
                        {
                            label: 'description'
                        }
                    ],
                    omitHeader: true,
                    rows: cmds
                });

                return repl.displayPrompt();
            }
        },
        '.help': {
            help: 'Alias for .commands',
            action: function() {
                this.commands[ '.commands' ].action.call( this );
            }
        },
        '.h': {
            help: 'Alias for .commands',
            action: function() {
                this.commands[ '.commands' ].action.call( this );
            }
        },
        '.modules': {
            help: 'List all of the modules within this project',
            action: function() {
                env.moduleLoader.modules.forEach( function( mod ) {
                    console.log( mod.name );
                });
                return repl.displayPrompt();
            }
        },
        '.models': {
            help: 'Lists all models',
            action: function( ) {
                Object.keys( models ).forEach( function( model ) {
                    console.log( model );
                });
                return repl.displayPrompt();
            }
        },
        '.services': {
            help: 'Lists all services',
            action: function( ) {
                Object.keys( services ).forEach( function( service ) {
                    console.log( service );
                });
                return repl.displayPrompt();
            }
        },
        '.exit': {
            help: 'Exits the CleverStack REPL',
            action: function() {
                process.exit( 0 );
            }
        },
        '.quit': {
            help: 'Alias for .exit',
            action: function() {
                this.commands['.exit'].action( );
            }
        },
        '.q': {
            help: 'Alias for .exit',
            action: function() {
                this.commands['.exit'].action( );
            }
        },
        '.history': {
            help: 'Show command history',
            action: function() {
                repl.outputStream.write( "" + ( repl.rli.history.slice( 0 ).reverse( ).join( '\n' ) ) + "\n" );
                return repl.displayPrompt();
            }
        }
    };

    return repl.commands;
}

var local = repl.start({
    prompt: "cleverstack::" + process.env.NODE_ENV +  "> ",
    useGlobal: true,
    ignoreUndefined: true
});

addHistory( local, process.env.HOME ? path.join( process.env.HOME, '.cleverstack_history' ) : void 0, 10240 );

// ormFuncs are the DAOFactory functions that we want to make public...
var ormFuncs = [ 'all', 'find', 'create', 'update', 'describe', 'findAll', 'findOrCreate', 'findAndCountAll', 'findAllJoin', 'findOrInitialize', 'findOrBuild', 'bulkCreate', 'destroy', 'aggregate', 'build', 'count', 'min', 'max' ]
  , models = {}
  , services = {};

moduleLdr.on( 'modulesLoaded', function() {
    var _models = require( 'models' );

    Object.keys( _models ).forEach( function( key ) {
        var modelName       = key + 'Model';

        models[ modelName ] = _models[ key ] || {};

        ormFuncs.forEach( function( fn ) {
            // Wrap each public function in order to omit the need for then()/catch()...
            models[ modelName ][ fn ] = _.wrap( models[ modelName ][ fn ], function( func ) {
                var args = Array.prototype.slice.call( arguments, 1 );
                func.apply( models[ modelName ], args )
                .then( function( res ) {
                    console.log( util.inspect( res, { depth: 4, colors: true } ) );
                    local.displayPrompt();
                })
                .catch( function( err ) {
                    console.error( lib.colors.red( err ) );
                    local.displayPrompt();
                });
            });
        });
    });

    // Load all of the models into REPL's context...
    Object.keys( models ).forEach( function( model ) {
        local.context[ model ] = models[ model ];
    });

    local.context.models = models;

    services = require( 'services' );

    Object.keys( services ).forEach( function( serviceName ) {
        var serviceFuncs = Object.keys( services[ serviceName ] );

        serviceFuncs.forEach( function( fn ) {
            services[ serviceName ][ fn ] = _.wrap( services[ serviceName ][ fn ], function( func ) {
                var args = Array.prototype.slice.call( arguments, 1 );
                func.apply( services[ serviceName ], args )
                .then( function( res ) {
                    console.log( util.inspect( res, { depth: 4, colors: true } ) );
                    local.displayPrompt();
                })
                .catch( function( err ) {
                    console.error( lib.colors.red( err ) );
                    local.displayPrompt();
                });
            });
        });
    });

    // Load all of the models into REPL's context...
    Object.keys( services ).forEach( function( service ) {
        local.context[ service ] = services[ service ];
    });

    local.context.services = services;
});

local.on( 'exit', function() {
    process.exit( 0 );
});