define( ['angular', '../module' ], function( ng ) {
  'use strict';

  ng
  .module( '{{template_name}}.services' )
  .service( '{{Template}}Service', function( {{Template}}Model ) {

    var {{Template}}Service = {

      model   : {{Template}}Model,

      data    : null,

      list    : function( findOptions ) {
        return this.model.list( findOptions ).$promise.then( function( data ) {
          {{Template}}Service.data = data;
          return {{Template}}Service.data;
        });
      },

      get     : function( findOptions ) {
        return this.model.get( findOptions ).$promise;
      },

      create  : function( data ) {
        return this.model.create( data ).$promise;
      }

    };

    return {{Template}}Service;

  });

});