const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'postgres'
});

// Initialize database & run migrations
const initDB = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        source VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'Interested',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    await pool.query(createTableQuery);
    console.log('Leads table initialized/exists.');

    // Add email column if not exists
    await pool.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS email VARCHAR(255);`);
    // Add notes column if not exists
    await pool.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes TEXT;`);
    console.log('Database migrations applied successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

initDB();

module.exports = {
  query: (text, params) => pool.query(text, params),
};
