import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();


export const connectMariaDB = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.MARIADB_USER || "root",
  password: process.env.MARIADB_PASSWORD || "12345678",
  database: process.env.MARIADB_DATABASE || "your_database_name",
  port: parseInt(process.env.MDB_PORT || "3306"),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


