var Class = require( 'uberclass' )
  , async = require( 'async' )
  , debug = require( 'debug' )( '{{Template}}Task' );

var {{Template}}Task = module.exports = Class.extend(
{
    init: function( callback ) {
    	debug( 'Starting...' );

        async.parallel([
            this.proxy( 'doSomething' ),
            this.proxy( 'doSomethingElse')
        ],
        function(err, results){
            debug( 'Finished.' );
            callback( err );
        });
    },

    doSomething: function( callback ) {
        callback( null );
    },

    doSomethingElse: function( callback ) {
        callback( null );
    }
});