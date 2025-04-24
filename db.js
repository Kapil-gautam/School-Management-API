import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT, //added recentlly
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

pool.getConnection((err, connection) => {
    if (err) {
      console.error(' MySQL Connection Error:', err.message);
    } else {
      console.log(' MySQL Connected Successfully!');
      connection.release();
    }
  });
  

export default pool.promise();
