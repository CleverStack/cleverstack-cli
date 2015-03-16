define([ 'angular', '../module' ], function(ng) {
  'use strict';

  ng
  .module('{{template_name}}.factories')
  .factory('{{Template}}Factory', function() {
      return {
          sayHello: function(text){
              return "{{Template}} Factory says \"Hello " + text + "\"";
          }
      };
  });

});
