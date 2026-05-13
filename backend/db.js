const { Pool } = require('pg');

console.log("Спроба підключення до бази...");

const pool = new Pool({
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'adminpassword',
    host: process.env.DB_HOST || '127.0.0.1', // Якщо є ENV, бере його, інакше - локалхост
    port: process.env.DB_PORT || 5433,        // Якщо є ENV, бере його, інакше - 5433
    database: process.env.DB_NAME || 'watches_db',
});

module.exports = pool;