var async = require( 'async' )
  , debug = require( 'debug' )( '{{Template}}Task' );

module.exports = require( 'classes' ).Task.extend(
{
    init: function( callback ) {
        debug( 'Starting...' );

        async.parallel([
            this.proxy( 'doSomething' ),
            this.proxy( 'doSomethingElse')
        ],
        function(err, results ){
            debug( 'Finished.' );
            callback( err, results );
        });
    },

    doSomething: function( callback ) {
        callback( null );
    },

    doSomethingElse: function( callback ) {
        callback( null );
    }
});