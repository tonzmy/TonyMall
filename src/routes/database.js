var mysql = require('mysql');

function connectServer() {
    return mysql.createConnection({
        multipleStatements: true,
        host: 'localhost',
        user: 'root',
        password: '', //your password
        port: '3306', //your port number
        database: 'tonymall' //your database
    });
}

exports.connect = connectServer;