var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'ApiUser12345',      
    password: 'ApiUser54321!',
    database: 'cabinreservations'
});

module.exports = connection;
