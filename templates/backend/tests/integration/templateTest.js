var expect  = require ('chai').expect
  , request = require ('supertest')
  , path    = require('path')
  , app     = require (path.resolve(__dirname + '/../../../../') + '/index.js');

describe ('/{{_template_}}', function () {
  describe ('POST /{{_template_}}', function () {
    it ('should return valid status', function (done) {
      request (app)
        .post ('/{{_template_}}')
        .expect ('Content-Type', /json/)
        .expect (200)
        .end (function (err, res) {
          if (err) {
            return done (err);
          }
          expect (res.body).to.eql ({
            status: 'Created record!'
          });
          done ();
        });
    });
  });

  describe ('GET /{{_template_}}', function () {
    it ('should return valid status', function (done) {
      request (app)
        .get ('/{{_template_}}')
        .expect ('Content-Type', /json/)
        .expect (200)
        .end (function (err, res) {
          if (err) {
            return done (err);
          }
          expect (res.body).to.eql ({
            status: 'Sending you the list of examples.'
          });
          done ();
        });
    });
  });

  describe ('GET /{{_template_}}/:id', function () {
    it ('should return valid status', function (done) {
      request (app)
        .get ('/{{_template_}}/123')
        .expect ('Content-Type', /json/)
        .expect (200)
        .end (function (err, res) {
          if (err) {
            return done (err);
          }
          expect (res.body).to.eql ({
            status: 'sending you record with id of 123'
          });
          done ();
        });
    });
  });

  describe ('PUT /{{_template_}}/:id', function () {
    it ('should return valid status', function (done) {
      request (app)
        .put ('/{{_template_}}/123')
        .expect ('Content-Type', /json/)
        .expect (200)
        .end (function (err, res) {
          if (err) {
            return done (err);
          }
          expect (res.body).to.eql ({
            status: 'updated record with id 123'
          });
          done ();
        });
    });
  });

  describe ('DELETE /{{_template_}}/:id', function () {
    it ('should return valid status', function (done) {
      request (app)
        .del ('/{{_template_}}/123')
        .expect ('Content-Type', /json/)
        .expect (200)
        .end (function (err, res) {
          if (err) {
            return done (err);
          }
          expect (res.body).to.eql ({
            status: 'deleted record with id 123'
          });
          done ();
        });
    });
  });
});
