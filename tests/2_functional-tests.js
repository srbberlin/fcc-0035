/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
  let _lid;
  
  suite('POST /api/issues/{project} => object with issue data', function() {

    test('Every field filled in', function(done) {
     chai.request(server)
      .post('/api/issues/test')
      .send({
        issue_title: 'Title',
        issue_text: 'text',
        created_by: 'Functional Test - Every field filled in',
        assigned_to: 'Chai and Mocha',
        status_text: 'In QA'
      })
      .end(function(err, res){
       
        assert.equal(res.status, 200);
       
        assert.property(res.body, '_id', 'There should be a "_id"');
        assert.property(res.body, 'created_on', 'There should be a "created_on"');
        assert.property(res.body, 'updated_on', 'There should be a "updated_on"');
        assert.property(res.body, 'created_by', 'There should be a "created_by"');
        assert.property(res.body, 'issue_title', 'There should be a "issue_title"');
        assert.property(res.body, 'issue_text', 'There should be a "issue_text"');
        assert.property(res.body, 'status_text', 'There should be a "status_text"');
        assert.property(res.body, 'assigned_to', 'There should be a "assigned_to"');
        assert.property(res.body, 'open', 'There should be a "open"');
        
        assert.isString(res.body._id);
        assert.isString(res.body.created_on);
        assert.isString(res.body.updated_on);
        assert.isString(res.body.created_by);
        assert.isString(res.body.issue_title);
        assert.isString(res.body.issue_text);
        assert.isString(res.body.status_text);
        assert.isString(res.body.assigned_to);
        assert.isTrue(res.body.open);
        
        _lid = res.body._id;
         
        done();
      });
    });

    test('Required fields filled in', function(done) {
     chai.request(server)
      .post('/api/issues/test')
      .send({
        issue_title: 'Title',
        issue_text: 'text',
        created_by: 'Functional Test - Required fields filled in',
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
       
        assert.property(res.body, '_id', 'There should be a "_id"');
        assert.property(res.body, 'created_on', 'There should be a "created_on"');
        assert.property(res.body, 'updated_on', 'There should be a "updated_on"');
        assert.property(res.body, 'created_by', 'There should be a "created_by"');
        assert.property(res.body, 'issue_title', 'There should be a "issue_title"');
        assert.property(res.body, 'issue_text', 'There should be a "issue_text"');
        assert.property(res.body, 'status_text', 'There should be a "status_text"');
        assert.property(res.body, 'assigned_to', 'There should be a "assigned_to"');
        assert.property(res.body, 'open', 'There should be a "open"');

        assert.isString(res.body._id);
        assert.isString(res.body.created_on);
        assert.isString(res.body.updated_on);
        assert.isString(res.body.created_by);
        assert.isString(res.body.issue_title);
        assert.isString(res.body.issue_text);
        assert.isString(res.body.status_text);
        assert.isString(res.body.assigned_to);
        assert.isTrue(res.body.open);
        
        done();
      });
    });

    test('Missing required fields', function(done) {
     chai.request(server)
      .post('/api/issues/test')
      .send({})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.text, 'missing inputs');
        done();
      });
    });
  });

  suite('PUT /api/issues/{project} => text', function() {

    test('No body', function(done) {
      chai.request(server)
        .put('/api/issues/test')
        .send("")
        .end(function(err, res){
          assert.equal(res.status, 200, 'should be 200');
          assert.equal(res.text, 'no updated field sent', 'There should be no updated field sent');
          done();
        });
    });

    test('One field to update', function(done) {
      chai.request(server)
      .put('/api/issues/test')
      .send({
        _id : _lid,
        issue_title: 'Title is changed !'
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.text, 'successfully updated');
        done();
      });
    });

    test('Multiple fields to update', function(done) {
      chai.request(server)
        .put('/api/issues/test')
        .send({
          _id : _lid,
          issue_title: 'Title is changed !',
          issue_text: 'Text is changed !'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'successfully updated');
          done();
        });
    });

  });

  suite('GET /api/issues/{project} => Array of objects with issue data', function() {

    test('No filter', function(done) {
      chai.request(server)
      .get('/api/issues/test')
      .query({})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.property(res.body[0], 'issue_title');
        assert.property(res.body[0], 'issue_text');
        assert.property(res.body[0], 'created_on');
        assert.property(res.body[0], 'updated_on');
        assert.property(res.body[0], 'created_by');
        assert.property(res.body[0], 'assigned_to');
        assert.property(res.body[0], 'open');
        assert.property(res.body[0], 'status_text');
        assert.property(res.body[0], '_id');
        done();
      });
    });

    test('One filter', function(done) {
      chai.request(server)
      .get('/api/issues/test')
      .query({ _id: _lid })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.property(res.body[0], 'issue_title');
        assert.property(res.body[0], 'issue_text');
        assert.property(res.body[0], 'created_on');
        assert.property(res.body[0], 'updated_on');
        assert.property(res.body[0], 'created_by');
        assert.property(res.body[0], 'assigned_to');
        assert.property(res.body[0], 'open');
        assert.property(res.body[0], 'status_text');
        assert.property(res.body[0], '_id');
        done();
      });
    });

    test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
      chai.request(server)
      .get('/api/issues/test')
      .query({
        _id: _lid,
        open: true
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.property(res.body[0], 'issue_title');
        assert.property(res.body[0], 'issue_text');
        assert.property(res.body[0], 'created_on');
        assert.property(res.body[0], 'updated_on');
        assert.property(res.body[0], 'created_by');
        assert.property(res.body[0], 'assigned_to');
        assert.property(res.body[0], 'open');
        assert.property(res.body[0], 'status_text');
        assert.property(res.body[0], '_id');
        done();
      });
    });

  });

  suite('DELETE /api/issues/{project} => text', function() {

    test('No _id', function(done) {
     chai.request(server)
      .delete('/api/issues/test')
      .send({})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.text, '_id error');
        done();
      });
    });

    test('Valid _id', function(done) {
     chai.request(server)
      .delete('/api/issues/test')
      .send({ _id: _lid})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.text, 'deleted ' + _lid);
        done();
      });
    });
  });
});
