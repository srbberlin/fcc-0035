/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var { newIssue, changeIssue, deleteIssue, getAllIssues } = require('../logic/issues');

module.exports = function (app) {

//  app.route('/api/issues/project')
  app.route('/api/issues/:project')
//  app.route('/api/issues/')
  
    .get(function (req, res){
      //console.log('==============================================================================')
      //console.log('GET: ', req.body, req.query);
      getAllIssues(req.params.project, Object.assign(req.query, req.body), data => res.json(data))
    })

    .post(function (req, res){
      //console.log('==============================================================================')
      //console.log('POST:\n', req.body);
      newIssue(req.params.project, req.body, data => {
        //console.log(typeof data, data)
        if (typeof data === 'string')
          res.send(data)
        else
          res.json(data)
      })
    })
    
    .put(function (req, res){
      //console.log('==============================================================================')
      //console.log('PUT:\n', req.body);
      changeIssue(req.params.project, req.body, data => {
        //console.log(typeof data, data)
        if (typeof data === 'string')
          res.send(data)
        else
          res.json(data)
      })
    })
    
    .delete(function (req, res){
      //console.log('==============================================================================')
      //console.log('DELETE:\n', req.body);
      deleteIssue(req.params.project, req.body, data => res.send(data));
    });

};
