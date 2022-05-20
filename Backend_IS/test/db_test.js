require('dotenv').config();
const mysql2 = require('mysql2');
const pool = mysql2.createPool({
  host: process.env.RDS_HOST,
  user: process.env.RDS_USER,
  password: process.env.RDS_PWD,
  database: process.env.RDS_DB_TEST,
  waitForConnections: true,
  connectionLimit: 10,
});
const db_test = pool.promise();
module.exports = { db_test };
