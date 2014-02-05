define(['angular', '../module'], function (ng) {
  'use strict';

  ng.module('{{template_name}}.services')
  .service('{{Template}}Service', [
    '$http',
    function ($http) {

      return {

        example: function () {
          return $http.get('/example')
            .then(function(response){
              return response.data;
            });
        }

      };

    }

  ]);

});
