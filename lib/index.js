var path    = require( 'path' )
  , libs    = module.exports = {}
  , loaded  = {};
        
// note: leave ./program.js out of this otherwise commander will blend sub programs together
var availableLibs = [
    'command', 'colors', 'repos', 'utils', 'search', 'install', 'project', 'packages', 'generator',
    [ 'util', path.join( 'util', 'index' ) ],
    [ 'pkg', path.join( '..', 'package.json' ) ]
];

// Only require the lib if we haven't already done so
if ( GLOBAL.lib === undefined ) {
    availableLibs.forEach( function( libName ) {
        var libPath = libName;

        // availableLibs = [ [ name, path ], ... ]
        if ( libName instanceof Array ) {
            libPath = libName[ 1 ];
            libName = libName[ 0 ];
        }
        Object.defineProperty( libs, libName, {
            get: function() {
                if ( !loaded[ libName ] ) {
                    loaded[ libName ] = require( path.join( __dirname, libPath ) );
                }
                return loaded[ libName ];
            },
            enumerable: true
        });
    });
}