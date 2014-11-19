define( [ 'angular', '../module' ], function( ng ) {
  'use strict';

  ng
  .module( '{{template_name}}.controllers' )
  .controller( '{{Template}}Controller', function( $scope ) {

    $scope.something = 'Example Module';

  });

});