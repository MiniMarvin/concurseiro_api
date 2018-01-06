const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost';

// Database Name
// const dbName = 'myproject';
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
        for(var i = 0; i < result.length; i++){
          removeDocuments(db, result[i], (dt) => console.log("remotion: " + dt))
        }
    });
});

const findDocuments = function(db, restriction, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Find some documents
  collection.find(restriction).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs);
    callback(docs);
  });
};

const removeDocuments = function(db, delete_pattern, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  collection.deleteMany(delete_pattern, function(err, result) {
    assert.equal(err, null);
    console.log("Removed the document from pattern:");
    console.log(delete_pattern);
    callback(result);
  });    
}