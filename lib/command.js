var spawn = require( 'win-fork' )
  , path  = require( 'path' )
  , fs    = require( 'fs' );

module.exports = function ( _path_, program, cmd, args ) {
  if (arguments.length < 4) {
    args    = cmd;
    cmd     = program;
    program = require( path.join( __dirname, 'program' ) );
  }

  if (arguments.length < 2) {
    cmd = 'clever';
  }

  if (!cmd) {
    program.help();
  }

  // executable name
  var bin = 'clever-' + cmd;
  if (cmd === "clever") {
    bin = 'clever';
  }

  // local or resolve to absolute executable path
  var local = path.join( _path_, bin );

  if (fs.existsSync( local )) {
    bin = local;
  } else {
    bin = process.env.PATH.split(':').reduce( function (binary, p) {
      p = path.resolve( p, bin );
      return fs.existsSync( p ) && fs.statSync( p ).isFile() ? p : binary;
    }, bin );
  }

  // if the bin doesn't exist within the cleverstack binary
  // try finding it within the project/module folder...
  if (!fs.existsSync( bin )) {
    bin = path.resolve( path.join( process.cwd(), 'bin', cmd ) );

    // if bin/cmd doesn't exist, then try clever- prefix
    if (!fs.existsSync( bin )) {
      bin = path.resolve( path.join( process.cwd(), 'bin', 'clever-' + cmd ) );
    }
  }

  // display help if bin does not exist
  if (!fs.existsSync( bin )) {
    console.error( '\n  %s command does not exist', bin );
    program.help( );
    process.exit( 0 );
  }

  // spawn
  var proc = spawn( bin, args, { stdio: [process.stdin, process.stdout, process.stderr]} );

  proc.on( 'close', function ( code ) {
    process.exit( code );
  } );
}
