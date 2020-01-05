const { restart, getObjectID, create, updateOne, getOne, getAll, deleteOne } = require('./db');

function newIssue (dbName, o, f) {
  
  if (
    o.issue_title && o.issue_title.length > 0 && 
    o.issue_text && o.issue_text.length > 0 &&
    o.created_by && o.created_by.length > 0 
  ) {
    let oid = getObjectID();

    if (typeof o.open === 'string')
      o.open = o.open === 'true' 

    create(dbName, Object.assign({
      _id: oid.hex,
      created_on: oid.int,
      updated_on: oid.int,
      created_by: '',
      issue_title: '',
      issue_text: '',
      status_text: '',
      assigned_to: '',
      open: true
    }, o), data => {
      f(data)
    });
  }
  else {
    f('missing inputs');
  }
}

function changeIssue (dbName, body, f) {
  let filter = {};
  let delta = {};
  let ele;

  if (body) {
    for (ele in body) {
      let v = body[ele];

      if (v) {
        if (ele === '_id') {
          filter[ele] = body[ele];
        }
        else if (ele === 'open') {
          delta[ele] = v === 'true'
        } else {
          delta[ele] = body[ele];
        }
      }
    }

    if (filter._id) {
      delta.updated_on = new Date()
      updateOne(dbName, filter, { $set: delta }, data => {
        f((data.modifiedCount === 1 ? 'successfully updated' : 'could not update ' + filter._id));
      });
    }
    else {
      f('no updated field sent');
    }
  }
  else {
    f('no updated field sent');
  }
}

function getAllIssues (dbName, filter, f) {
  if (typeof filter.open === 'string')
    filter.open = filter.open === 'true' 

  getAll(dbName, filter, data => {
    f(data)
  });
}

function deleteIssue (dbName, filter, f) {
  if (filter && filter._id) {
    deleteOne(dbName, filter, data => {
      f((data.deletedCount ? 'deleted ' : 'could not delete ') + filter._id)
    });
  }
  else {
    f('_id error')
  }
}

exports.newIssue = newIssue
exports.changeIssue = changeIssue;
exports.getAllIssues = getAllIssues;
exports.deleteIssue = deleteIssue;