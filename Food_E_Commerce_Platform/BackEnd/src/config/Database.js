const mysql = require('mysql2/promise');
require('dotenv').config()
const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: 3306,
    connectTimeout: 50000
});

module.exports = pool;
