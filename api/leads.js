const { Pool } = require('pg');

// Connection pool (reused across invocations in the same lambda container)
let pool;
function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 5,
    });
  }
  return pool;
}

// Ensure schema exists (runs once per cold start)
let initialized = false;
async function ensureSchema() {
  if (initialized) return;
  const db = getPool();
  await db.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      source VARCHAR(50) NOT NULL,
      status VARCHAR(50) DEFAULT 'Interested',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  await db.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS email VARCHAR(255);`);
  await db.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes TEXT;`);
  initialized = true;
}

// Parse body for Vercel (already parsed as JSON by default)
function parseBody(req) {
  return typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
}

// Extract lead ID from URL path: /api/leads/123 -> "123"
function extractId(url) {
  const parts = url.split('/').filter(Boolean);
  // Pattern: api / leads / :id
  if (parts.length >= 3 && parts[0] === 'api' && parts[1] === 'leads') {
    return parts[2];
  }
  return null;
}

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await ensureSchema();
    const db = getPool();
    const id = extractId(req.url);

    // POST /api/leads — Create a new lead
    if (req.method === 'POST' && !id) {
      const { name, phone, source, email, notes } = parseBody(req);
      if (!name || !phone || !source) {
        return res.status(400).json({ error: 'Name, phone, and source are required.' });
      }
      const result = await db.query(
        'INSERT INTO leads (name, phone, source, email, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, phone, source, email || null, notes || '']
      );
      return res.status(201).json(result.rows[0]);
    }

    // GET /api/leads — List all leads
    if (req.method === 'GET' && !id) {
      const result = await db.query('SELECT * FROM leads ORDER BY created_at DESC');
      return res.status(200).json(result.rows);
    }

    // PUT /api/leads/:id — Update a lead
    if (req.method === 'PUT' && id) {
      const { name, phone, email, source, status, notes } = parseBody(req);
      const result = await db.query(
        `UPDATE leads 
         SET name = COALESCE($1, name),
             phone = COALESCE($2, phone),
             email = COALESCE($3, email),
             source = COALESCE($4, source),
             status = COALESCE($5, status),
             notes = COALESCE($6, notes)
         WHERE id = $7 RETURNING *`,
        [
          name !== undefined ? name : null,
          phone !== undefined ? phone : null,
          email !== undefined ? email : null,
          source !== undefined ? source : null,
          status !== undefined ? status : null,
          notes !== undefined ? notes : null,
          id
        ]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Lead not found.' });
      }
      return res.status(200).json(result.rows[0]);
    }

    // DELETE /api/leads/:id — Delete a lead
    if (req.method === 'DELETE' && id) {
      const result = await db.query('DELETE FROM leads WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Lead not found.' });
      }
      return res.status(200).json({ message: 'Lead deleted successfully.', deleted: result.rows[0] });
    }

    // Fallback: method/route not matched
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Serverless API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
