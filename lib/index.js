var path = require( 'path' );

// note: leave ./program.js out of this otherwise commander will blend sub programs together

module.exports.tags       = require( path.resolve( path.join( __dirname, 'tags'       ) ) );
module.exports.cache      = require( path.resolve( path.join( __dirname, 'cache'      ) ) );
module.exports.command    = require( path.resolve( path.join( __dirname, 'command'    ) ) );
module.exports.colors     = require( path.resolve( path.join( __dirname, 'colors'     ) ) );
module.exports.utils      = require( path.resolve( path.join( __dirname, 'utils'      ) ) );
module.exports.repos      = require( path.resolve( path.join( __dirname, 'repos'      ) ) );
module.exports.project    = require( path.resolve( path.join( __dirname, 'project'    ) ) );
module.exports.generator  = require( path.resolve( path.join( __dirname, 'generator'  ) ) );
