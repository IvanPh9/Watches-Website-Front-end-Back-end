const { Pool } = require('pg');

console.log("Спроба підключення до бази...");

const pool = new Pool({
    user: 'admin',
    password: 'adminpassword',
    host: '127.0.0.1',
    port: 5433,
    database: 'watches_db',
});

module.exports = pool;