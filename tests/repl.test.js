var chai      = require( 'chai' )
  , expect    = chai.expect
  , spawn     = require('child_process').spawn
  , path      = require( 'path' )
  , fs        = require( 'fs' )
  , binPath   = path.join( __dirname, '..', 'bin' )
  , assetPath = path.join( __dirname, 'assets' );

chai.Assertion.includeStack = true;

describe( 'REPL', function ( ) {
  it( 'should be able to go into the REPL and execute some commands', function ( done ) {
    var stdout = ''
      , help   = false;

    var proc = spawn( path.join( binPath, 'clever-repl' ), [ ], { cwd: path.join( assetPath, 'my-new-project', 'backend' ) } );
    proc.stdout.on( 'data', function ( data ) {
      var str = data + '';
      stdout += str;
      if (str.match( /cleverstack::.*>/ ) !== null) {
        if (help === false) {
          help = true;
          proc.stdin.write( '.commands\n' );
        } else {
          proc.stdin.write( '.quit\n' );
        }
      }
    } );

    proc.on( 'exit', function ( code ) {
      expect( code ).to.equal( 0 );
      expect( stdout ).to.match( /\u001b\[38;5;172m\.commands\u001b\[39m   \u001b\[38;5;8mLists all of the REPL commands/ );
      expect( stdout ).to.match( /\u001b\[38;5;172m\.help\u001b\[39m       \u001b\[38;5;8mAlias for .commands/ );
      expect( stdout ).to.match( /\u001b\[38;5;172m\.h\u001b\[39m          \u001b\[38;5;8mAlias for .commands/ );
      expect( stdout ).to.match( /\u001b\[38;5;172m\.modules\u001b\[39m    \u001b\[38;5;8mList all of the modules within this project/ );
      expect( stdout ).to.match( /\u001b\[38;5;172m\.models\u001b\[39m     \u001b\[38;5;8mLists all models/ );
      expect( stdout ).to.match( /\u001b\[38;5;172m\.exit\u001b\[39m       \u001b\[38;5;8mExits the CleverStack REPL/ );
      expect( stdout ).to.match( /\u001b\[38;5;172m\.quit\u001b\[39m       \u001b\[38;5;8mAlias for .exit/ );
      expect( stdout ).to.match( /\u001b\[38;5;172m\.q\u001b\[39m          \u001b\[38;5;8mAlias for .exit/ );
      expect( stdout ).to.match( /\u001b\[38;5;172m\.history\u001b\[39m    \u001b\[38;5;8mShow command history/ );
      done( );
    } );
  } );
} );
