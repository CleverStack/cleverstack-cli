/**
 * @file Instantiates and configures angular modules for your module.
 */
define([ 'angular' ], function(ng) {
  'use strict';

  ng.module('{{template_name}}.controllers', []);
  ng.module('{{template_name}}.providers', []);
  ng.module('{{template_name}}.services', []);
  ng.module('{{template_name}}.factories', []);
  ng.module('{{template_name}}.directives', []);

  var module = ng.module('{{template_name}}', [
    'cs_common',
    '{{template_name}}.models',
    '{{template_name}}.services',
    '{{template_name}}.factories',
    '{{template_name}}.controllers',
    '{{template_name}}.providers',
    '{{template_name}}.directives'
  ]);

  module.config(function($routeProvider, TemplateProvider) {

    // Register any routes you need for your module.
    $routeProvider
      .when(' /example', {
        templateUrl   : TemplateProvider.view('{{template_name}}', '{{template_name}}-view'),
        controller    : '{{Template}}Controller',
        public        : true
      });
  });

  return module;
});
