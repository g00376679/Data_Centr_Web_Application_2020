const MongoClient = require("mongodb").MongoClient;

// Connection URL
const url = "mongodb://localhost:27017/headsOfStateDB";

// Use connect method to connect to the server

var getConnection = function (callback) {
  MongoClient.connect(url, function (err, client) {
    return callback(err, client);
  });
};

return (module.exports = getConnection);
