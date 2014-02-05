/**
 * @file Instantiates and configures angular modules for your module.
 */
define(['angular'], function (ng) {
  'use strict';

  ng.module('{{template_name}}.controllers', []);
  ng.module('{{template_name}}.providers', []);
  ng.module('{{template_name}}.services', []);
  ng.module('{{template_name}}.factories', []);

  var module = ng.module('{{template_name}}', [
    'cs_common',
    '{{template_name}}.controllers',
    '{{template_name}}.providers',
    '{{template_name}}.services',
    '{{template_name}}.factories'
  ]);

  module.config([
    '$routeProvider',
    'CSTemplateProvider',
    function ($routeProvider, CSTemplate) {

      // Set the subfolder of your module that contains all your view templates.
      CSTemplate.setPath('/modules/{{template_name}}/views');

      // Register any routes you need for your module.
      $routeProvider
        .when('/example', {
          templateUrl: CSTemplate.view('{{Template}}-view'),
          controller: '{{Template}}ExampleController',
          public: true
        });
    }

  ]);

  return module;
});
