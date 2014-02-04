// Bootstrap the testing environmen
var testEnv = require ( 'utils' ).testEnv();

var expect = require ( 'chai' ).expect
  , Service;

describe ( 'controllers.{{Template}}Controller', function () {
    var ctrl;

    beforeEach ( function ( done ) {
        testEnv ( function ( {{Template}}Controller, {{Template}}Service ) {
            var req = {
                params: { action: 'fakeAction'},
                method: 'GET',
                query: {}
            };
            var res = {
                json: function () {}
            };
            var next = function () {};
            ctrl = new {{Template}}Controller ( req, res, next );

            Service = {{Template}}Service;
            Service.create({
                name: '{{Template}} 1'
            })
            .then(function ( examples ) {
                done();
            })
            .fail(done);
        } );
    } );


    describe ( '.postAction()', function () {
        it ( 'should call .send() with valid status', function ( done ) {
            ctrl.send = function ( data ) {
                Service.findAll()
                    .then(function ( examples ) {
                        examples.should.have.length( 2 );
                        examples[ 1 ].name.should.equal( '{{Template}} 2' );
                        done();
                    })
                    .fail(done);
            };
            ctrl.req.body = {
                name: '{{Template}} 2'
            };
            ctrl.postAction();
        } );
    } );

    describe ( '.listAction()', function () {
        it ( 'should call .send() with valid status', function ( done ) {
            ctrl.send = function ( data ) {
                data.should.have.length( 1 );
                data[ 0 ].name.should.equal( '{{Template}} 1' );
                done();
            };
            ctrl.listAction();
        } );
    } );

    describe ( '.getAction()', function () {
        it ( 'should call .send() with valid status', function ( done ) {
            ctrl.req.params.id = 1;
            ctrl.send = function ( data ) {
                data.id.should.equal( 1 );
                data.name.should.equal( '{{Template}} 1' );
                done();
            };
            ctrl.getAction();
        } );
    } );

    describe ( '.putAction()', function () {
        it ( 'should call .send() with valid status', function ( done ) {
            ctrl.req.params.id = 1;
            ctrl.send = function ( data ) {
                data.id.should.equal( 1 );
                data.name.should.equal( '{{Template}} Updated' );
                done();
            };
            ctrl.req.body = {
                name: '{{Template}} Updated'
            };
            ctrl.putAction();
        } );
    } );

    describe ( '.deleteAction()', function () {
        it ( 'should call .send() with valid status', function ( done ) {
            ctrl.req.params.id = 1;
            ctrl.send = function ( data ) {
                expect( data ).to.eql ( undefined );
                done();
            };
            ctrl.deleteAction();
        } );
    } );

    describe ( '.customAction()', function () {
        it ( 'should call .send() with valid arguments', function ( done ) {
            ctrl.send = function ( data ) {
                expect( data ).to.eql ( {
                    message: 'Hello from customAction inside {{Template}}Controller'
                } );

                done ();
            };
            ctrl.customAction();
        } );
    } );
});