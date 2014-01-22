var path = require( 'path' );

// note: leave ./program.js out of this otherwise commander will blend sub programs together

module.exports.tags       = require( path.join( __dirname, 'tags'       ) );
module.exports.cache      = require( path.join( __dirname, 'cache'      ) );
module.exports.command    = require( path.join( __dirname, 'command'    ) );
module.exports.colors     = require( path.join( __dirname, 'colors'     ) );
module.exports.utils      = require( path.join( __dirname, 'utils'      ) );
module.exports.repos      = require( path.join( __dirname, 'repos'      ) );
module.exports.search     = require( path.join( __dirname, 'search'     ) );
module.exports.project    = require( path.join( __dirname, 'project'    ) );
module.exports.generator  = require( path.join( __dirname, 'generator'  ) );
