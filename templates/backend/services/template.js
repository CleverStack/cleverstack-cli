var Q = require('q')
  , BaseService = require( 'services' ).BaseService
  , {{Template}}Service;

{{Template}}Service = BaseService.extend({

});

module.exports = function( sequelize, ORM{{Template}}Model ) {
    if ( !{{Template}}Service.instance ) {
        {{Template}}Service.instance = new {{Template}}Service( sequelize );
        {{Template}}Service.Model = ORM{{Template}}Model;
    }

    return {{Template}}Service.instance;
};