define([ 'angular', '../module' ], function(ng) {
  'use strict';

  ng
  .module('{{template_name}}.directives')
  .directive('{{Template}}Directive', function() {

    var link = function($scope, $element, $attrs, ctrl) {
      console.log('Example Directive');
    };

    return {
      require   : 'ngModel',
      link      : link
    };

  });

});
