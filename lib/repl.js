var path  = require( 'path' )
  , repl  = require( 'repl' )
  , util  = require( 'util' )
  , tab   = require( 'tab' )
  , fs    = require( 'fs' )
  , _     = require( 'lodash' )
  , lib   = require( process.env.libDir )
  , env   = require( path.join( __dirname, 'boot' ) ).env;

lib.utils.success( 'Welcome to CleverStack ' + lib.colors.darkGray( ' using seed version ' + env.packageJson.version ) );
lib.utils.success( 'Type .commands or .help for a list of commands' );

// thanks to: https://github.com/jashkenas/coffee-script/blob/master/lib/coffee-script/repl.js#L97
var addHistory = function( repl, filename, maxSize ) {
  var buffer, fd, lastLine, readFd, size, stat;

  lastLine = null;

  try {
    stat = fs.statSync( filename );
    size = Math.min( maxSize, stat.size );
    readFd = fs.openSync( filename, 'r' );
    buffer = new Buffer( size );
    fs.readSync( readFd, buffer, 0, size, stat.size - size );
    repl.rli.history = buffer.toString( ).split( '\n' ).reverse( );
    if (stat.size > maxSize) {
      repl.rli.history.pop( );
    }
    if (repl.rli.history[0] === '') {
      repl.rli.history.shift( );
    }
    repl.rli.historyIndex = -1;
    lastLine = repl.rli.history[0];
  } catch ( _error ) {}

  fd = fs.openSync( filename, 'a' );

  repl.rli.addListener( 'line', function ( code ) {
    if (code && code.length && code !== '.history' && lastLine !== code) {
      fs.write( fd, "" + code + "\n" );
      return lastLine = code;
    }
  } );

  repl.rli.on( 'exit', function( ) {
    return fs.close( fd );
  } );

  return repl.commands = {
    '.commands': {
      help: 'Lists all of the REPL commands',
      action: function() {
        var cmds = [];

        Object.keys( this.commands ).forEach( function ( cmd ) {
          cmds.push( [ lib.colors.orange( cmd ), lib.colors.darkGray( this.commands[cmd].help ) ] );
        }.bind( this ) );

        tab.emitTable( {
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
        } );

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
        env.moduleLoader.modules.forEach( function ( mod ) {
          console.log( mod.name );
        } );
        return repl.displayPrompt( );
      }
    },
    '.models': {
      help: 'Lists all models',
      action: function( ) {
        Object.keys( models ).forEach( function ( model ) {
          console.log( model );
        } );
        return repl.displayPrompt( );
      }
    },
    '.exit': {
      help: 'Exits the CleverStack REPL',
      action: function( ) {
        process.exit( 0 );
      }
    },
    '.quit': {
      help: 'Alias for .exit',
      action: function( ) {
        this.commands['.exit'].action( );
      }
    },
    '.q': {
      help: 'Alias for .exit',
      action: function( ) {
        this.commands['.exit'].action( );
      }
    },
    '.history': {
      help: 'Show command history',
      action: function( ) {
        repl.outputStream.write( "" + ( repl.rli.history.slice( 0 ).reverse( ).join( '\n' ) ) + "\n" );
        return repl.displayPrompt( );
      }
    }
  }
}

var local = repl.start( {
  prompt: "cleverstack::" + process.env.NODE_ENV +  "> ",
  useGlobal: true,
  ignoreUndefined: true
} );

addHistory( local, process.env.HOME ? path.join( process.env.HOME, '.cleverstack_history' ) : void 0, 10240 );

// ormFuncs are the DAOFactory functions that we want to make public...
var ormFuncs = [ 'all', 'find', 'create', 'update', 'describe', 'findAll', 'findOrCreate', 'findAndCountAll', 'findAllJoin', 'findOrInitialize', 'findOrBuild', 'bulkCreate', 'destroy', 'aggregate', 'build', 'count', 'min', 'max' ];
var models = { };

env.moduleLoader.modules.forEach( function ( module ) {
  Object.keys( module.models.orm ).forEach( function ( orm ) {
    models[orm] = models[orm] || {};

    ormFuncs.forEach( function ( fn ) {
      // Wrap each public function in order to omit the need for success()/error()...
      models[orm][fn] = _.wrap( module.models.orm[orm][fn], function ( func ) {
        var args = Array.prototype.slice.call( arguments, 1 );
        func.apply( module.models.orm[orm], args ).success( function ( res ) {
          console.log( util.inspect( res, null, null, true ) );
          local.displayPrompt( );
        } )
        .error( function ( err ) {
          console.error( lib.colors.red( err ) );
        } );
      } );
    } );
  } );
} );

// Load all of the models into REPL's context...
Object.keys( models ).forEach( function ( model ) {
  local.context[model] = models[model];
} );

local.context.models = models;

local.on( 'exit', function( ) {
  process.exit( 0 );
} );
