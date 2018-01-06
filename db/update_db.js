'use strict';

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost';

// Database Name
const dbName = 'Base_Concurseiro';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    
    const db = client.db(dbName);
    
    // var restriction = {a: {$in: [1, 2]}};
    var restriction = {};
    
    findDocuments(db, restriction, 
    (result) => {
        
        console.log("result is: ");
        console.log(result);
        for(let i = 0; i < result.length; i++) {
          updateDocuments(db, {'_id': result[i]._id}, {'ativo': 0}, (dt) => {});
        }

    });
});

const updateDocuments = function(db, update_pattern, new_value, callback) {
  const collection = db.collection('documents');
  collection.updateOne(
    update_pattern, 
    {$set: new_value}
  ).then(function(result) {
    callback(result);
  });
}

const findDocuments = function(db, restriction, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Find some documents
  collection.find(restriction).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}