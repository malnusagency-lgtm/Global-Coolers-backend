const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Logger
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// ==========================================
// API ROUTES
// ==========================================

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Authentication / Profile
app.get('/api/auth/profile/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM profiles WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// Pickups Routes
app.get('/api/pickups/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM pickups WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.status(200).json({ success: true, pickups: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

app.post('/api/pickups/schedule', async (req, res) => {
  const { userId, date, wasteType, address, photoUrl } = req.body;
  
  if (!userId || !wasteType) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO pickups (user_id, date, waste_type, address, status, photo_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, date, wasteType, address, 'scheduled', photoUrl]
    );
    res.status(201).json({ success: true, pickup: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// Rewards Routes
app.get('/api/rewards', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rewards');
    res.status(200).json({ success: true, rewards: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=========================================`);
  console.log(`🌿 Global Coolers API Running on port ${PORT}`);
  console.log(`=========================================`);
});
