define([ 'angular', '../module' ], function(ng) {
  'use strict';

  ng
  .module('{{template_name}}.models')
  .factory('{{Template}}Model', function(ResourceFactory) {
    var defaultParams = {
      id: '@id'
    };

    return ResourceFactory('/{{template_name}}', defaultParams, {});
  });

});
