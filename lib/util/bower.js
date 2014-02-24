var exec = require( 'child_process' ).exec;

/**
 * Runs bower install
 *
 * @param  {String}   modulePath Path to the directory in which bower.json resides
 * @param  {Object}   options    Object given to us from commander
 * @param  {Callback} fn         Callback function
 * @return {Function}            Returns fn
 * @public
 */

exports.install = function ( modulePath, options, fn ) {
  var additionalOptions = [ ]
    , params = { cwd: modulePath };

  if (typeof options === "function") {
    fn = options;
    options = { };
  }

  if (typeof options === "object" && options.hasOwnProperty( 'allowRoot' ) && options.allowRoot) {
    additionalOptions.push( '--allow-root' );
  }

  // Bower specific arguments
  var bowerArgs = [ 'cwd', 'directory' ].filter( function ( option ) {
    return options.hasOwnProperty( option );
  } );

  if (bowerArgs.length) {
    additionalOptions.push( '-F' ); // force
  }

  bowerArgs.forEach( function ( option ) {
    additionalOptions.push( '--config.' + option + '=' + options[ option ] );
  } );

  // Any additional paramters in which we want to allow within exec()
  [ 'env' ].filter( function ( key ) {
    return options.hasOwnProperty( key );
  } )
  .forEach( function ( key ) {
    params[ key ] = options[ key ];
  } );

  exec( ( 'bower install ' + additionalOptions.join( ' ' ) ).trim( ), params, fn );
}
