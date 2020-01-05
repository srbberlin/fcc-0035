const MongoClient = require('mongodb');
const ObjectId    = require('mongodb').ObjectID;
let   db;

const events      = require('events');
const event       = new events.EventEmitter();
let   retries     = 0;
const delay       = 300;

function connect () {
  MongoClient.connect(
    process.env.URL,
    { 
      useUnifiedTopology: true, 
      useNewUrlParser: true 
    },
    function (e, d) {
      if(!e){
        db = d.db(process.env.DB);
        //console.log("Database connection established. ");
        event.emit('conn');
      } else {
        if(retries < 4){
          //console.log('Retrying to connect db ', retries++, e);
          setTimeout(connect, delay);
        } else {
          //console.log('Unable to connect db');
        }
      }
  });
}

connect();

function act (name, fn) { 
  if(db !== null) {
    fn(db.collection(name));
  } else {
    event.on('conn', function () {
      fn(db.collection(name));
    });
  }
};

exports.restart = function () {
  retries = 0;
  connect();
}

exports.getObjectID = function () { 
  const res = new ObjectId();
  return { hex: res.toHexString(), int: res.getTimestamp() };
}

exports.create = function (name, o, f) {
  //console.log('create: ', name, o);
  act (name, function (collection) {
    collection.insertOne(o, function (err, res) {
      if (err) {
        f('no object created');
        throw err;
      }
      //console.log(res.ops[0]);
      f(res.ops[0]);
    });
  });
}

exports.updateOne = function (name, filter, o, f) {
  //console.log('update: '+ name, filter, o);
  act (name, function (collection) {
    collection.updateOne(filter, o, function (err, res) {
      if (err) {
        f(res);
        throw err;
      }
      //console.log(res);
      f(res);
    });
  })
}


exports.getOne = function (name, id, f) {
  //console.log('getOne: '+ name, id);
  act (name, function (collection) {
    collection.findOne({_id: id}, function (err, res) {
      if (err) {
        f('error getting object');
        throw err;
      }
      //console.log(res);
      f(res)
    });
  })
}


exports.getAll = function (name, filter, f) {
  //console.log('getAll: '+ name, o);
  act (name, function (collection) {
    collection.find(filter).toArray(function (err, res) {
      if (err) {
        f('error getting objects');
        throw err;
      }
      //console.log(res);
      f(res)
    });
  })
}

exports.deleteOne = function (name, filter, f) {
  //console.log('deleteOne: '+ name, filter);
  act (name, function (collection) {
    collection.deleteOne(filter, function (err, res) {
      if (err) throw err;
      //console.log(res);
      f(res)
    });
  })
}
