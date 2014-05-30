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

exports.install = function( modulePath, params, fn ) {
  var additionalOptions = [];

  if ( typeof params === 'function' ) {
    fn = params;
    params = { cwd: modulePath };
  }

  if ( program.allowRoot ) {
    additionalOptions.push( '--allow-root' );
  }

  // Bower specific arguments
  var bowerArgs = [ 'cwd', 'directory' ].filter( function( option ) {
    return program.hasOwnProperty( option );
  });

  if ( bowerArgs.length ) {
    additionalOptions.push( '-F' ); // force
  }

  bowerArgs.forEach( function( option ) {
    additionalOptions.push( '--config.' + option + '=' + program[ option ] );
  });

  // Any additional paramters in which we want to allow within exec()
  [ 'env' ].filter( function( key ) {
    return program.hasOwnProperty( key );
  })
  .forEach( function( key ) {
    params[ key ] = program[ key ];
  });

  var proc = exec( ( 'bower install ' + additionalOptions.join( ' ' ) ).trim( ), params, fn );

  // Pipe the output of exec if verbose has been specified
  if ( program.verbose ) {
    proc.stdout.pipe( process.stdout );
    proc.stderr.pipe( process.stdout );
  }
}
