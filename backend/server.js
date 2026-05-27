const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Add a new lead
app.post('/api/leads', async (req, res) => {
  const { name, phone, source, email, notes } = req.body;
  if (!name || !phone || !source) {
    return res.status(400).json({ error: 'Name, phone, and source are required.' });
  }
  
  try {
    const result = await db.query(
      'INSERT INTO leads (name, phone, source, email, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, phone, source, email || null, notes || '']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting lead:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all leads
app.get('/api/leads', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM leads ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching leads:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a lead (fully or partially)
app.put('/api/leads/:id', async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, source, status, notes } = req.body;
  
  try {
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
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating lead:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete lead
app.delete('/api/leads/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await db.query('DELETE FROM leads WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lead not found.' });
    }
    
    res.json({ message: 'Lead deleted successfully.', deleted: result.rows[0] });
  } catch (err) {
    console.error('Error deleting lead:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static assets in production
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Fallback for Single Page Application (SPA) routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
