require('dotenv').config();
let dbChoice =
  process.env.NODE_ENV === 'test'
    ? process.env.RDS_DB_TEST
    : process.env.RDS_DB;
const mysql2 = require('mysql2');
const pool = mysql2.createPool({
  host: process.env.RDS_HOST,
  user: process.env.RDS_USER,
  password: process.env.RDS_PWD,
  database: dbChoice,
  waitForConnections: true,
  connectionLimit: 10,
});
const db = pool.promise();
module.exports = db;
