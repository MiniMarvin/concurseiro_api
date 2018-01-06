const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost';

// Database Name
const dbName = 'myproject';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    
    const db = client.db(dbName);
    
    // var restriction = {a: {$in: [1, 2]}};
    var restriction = {a: 1};
    
    findDocuments(db, restriction, 
    (result) => {
        
        console.log("result is: ");
        console.log(result);
        
        if(result.length === 0) {
        insertDocuments(db, [restriction], 
            () => {
                console.log("Inserted elements: " + restriction)
                findDocuments(db, {}, () => client.close());
            }
        );
        }
        else{
            console.log("None element Inserted");
            findDocuments(db, {}, () => client.close());
        }

    });
});

const insertDocuments = function(db, insert_collection, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Insert some documents
  collection.insertMany(insert_collection, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted documents into the collection:");
    console.log(insert_collection);
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

