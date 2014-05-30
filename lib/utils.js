var path   = require( 'path' )
  , colors = require( path.resolve( path.join( __dirname, 'colors' ) ) );

/**
 * Prints an error message and ends
 * the process if passthrough is not true
 *
 * @param  {String} msg
 * @param  {Boolean=} passthrough
 * @api public
 */

exports.fail = exports.error = function ( msg, passthrough ) {
  console.log( colors.red( msg ) );

  if (passthrough !== true) {
    process.exit( 0 );
  }
}

/**
 * Prints a successful message
 *
 * @param  {String} msg
 * @api public
 */

exports.success = function ( msg ) {
  console.log( colors.green( msg ) );
}

/**
 * Prints an informative message
 *
 * @param  {String} msg
 * @api public
 */

exports.info = function ( msg ) {
  console.log( colors.blue( msg ) );
}

/**
 * Prints a warning message / additional informative message
 *
 * @param  {String} msg
 * @api public
 */

exports.warn = function ( msg ) {
  console.log( colors.orange( msg ) );
}

exports.installing = function( name ) {
  if ( undefined !== GLOBAL.installing ) {
    installing.text = name;
  }
}

exports.running = function( task ) {
  if ( undefined !== GLOBAL.running ) {
    running.text = task;
  }
}

exports.progress = function() {
  if ( undefined !== GLOBAL.progress ) {
    progress.inc();
  }
}
