// db.js
const { Pool } = require('pg'); // a connection to a PostgreSQL database using the pg (node-postgres) library in Node.js
//The Pool class is a client pool, which manages multiple connections to a PostgreSQL database for you
require('dotenv').config();

const pool = new Pool({ ////creates an instance of the Pool class and passes an object with the necessary configuration options to connect to the PostgreSQL database.
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
});

module.exports = pool;
