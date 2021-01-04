var mysql = require('mysql')



//pool connection for multiple users to acces resourse
const pool = mysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'geography'
});

var getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
        callback(err, connection);
    });
};

return module.exports = getConnection;

