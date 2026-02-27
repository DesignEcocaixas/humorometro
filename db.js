//db.js
const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'localhost',
    user: 'humorometro',
    password: '23!Bestdavidx', // sua senha
    database: 'auto_avaliacao',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = db;