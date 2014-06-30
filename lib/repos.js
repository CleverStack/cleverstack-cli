var path    = require( 'path' )
  , colors  = require( path.join( __dirname, 'colors' ) )
  , utils   = GLOBAL.lib.utils;

/**
 * Displays a package returned from NPM or Bower in a sane/same manner
 * and colorifies some text
 *
 * @param  {Object} repo
 * @api public
 */

module.exports.display = function( repo ) {
    var title = [ repo.name ];
    if ( repo.version !== undefined ) {
        title.push( colors.darkGray( '@ ' + repo.version ) );
    }

    if ( repo.type === undefined || repo.type === "backend" ) {
        utils.warn( title.join( ' ' ) );
    } else {
        console.log( colors.sky( title.join( ' ' ) ) );
    }

    if ( repo.url !== null || repo.homepage !== null ) {
        console.log( colors.gray( repo.url || repo.homepage ) );
    }

    if ( repo.description !== undefined && repo.description.trim( ) !== "" ) {
        console.log( colors.lightGray( repo.description ) );
    }

    console.log( '' );
}