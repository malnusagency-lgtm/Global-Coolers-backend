const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ==========================================
// MOCK DATABASE (In-Memory Arrays)
// ==========================================
let mockUser = {
  id: 'usr_123',
  name: 'Muthoni N.',
  role: 'resident',
  ecoPoints: 1250,
  co2Saved: 120, // kg
  address: 'Kilimani, Nairobi',
};

let mockPickups = [
  {
    id: 'p_101',
    date: 'Today, 2:00 PM',
    status: 'scheduled',
    wasteType: 'Mixed Household',
    address: 'Kilimani, Nairobi',
  },
  {
    id: 'p_102',
    date: 'Yesterday, 9:45 AM',
    status: 'completed',
    wasteType: 'Plastic Recycling',
    address: 'Kilimani, Nairobi',
  }
];

const mockRewards = [
  {
    id: 'r_1',
    title: 'Free Bus Ride',
    cost: 500,
    icon: 'directions_bus',
    color: '0xFF4CAF50',
    partner: 'NTSA',
  },
  {
    id: 'r_2',
    title: 'Supermarket Voucher',
    cost: 1000,
    icon: 'shopping_cart',
    color: '0xFF2196F3',
    partner: 'Naivas',
  },
  {
    id: 'r_3',
    title: 'Tree Planting Kit',
    cost: 300,
    icon: 'park',
    color: '0xFF8BC34A',
    partner: 'GreenBelt',
  }
];

// ==========================================
// API ROUTES
// ==========================================

// Global Logger
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Authentication Routes
app.post('/api/auth/login', (req, res) => {
  // Accept anything and return the mock user
  res.status(200).json({
    success: true,
    token: 'fake-jwt-token-7x89y98z',
    user: mockUser
  });
});

app.get('/api/auth/profile', (req, res) => {
  res.status(200).json({
    success: true,
    user: mockUser
  });
});

// Pickups Routes
app.get('/api/pickups', (req, res) => {
  res.status(200).json({
    success: true,
    pickups: mockPickups
  });
});

app.post('/api/pickups/schedule', (req, res) => {
  const { date, wasteType, address } = req.body;
  
  const newPickup = {
    id: `p_${Date.now()}`,
    date: date || 'Pending',
    status: 'scheduled',
    wasteType: wasteType || 'General Waste',
    address: address || mockUser.address,
  };
  
  mockPickups.unshift(newPickup); // Add to the top of the queue
  
  res.status(201).json({
    success: true,
    message: 'Pickup scheduled successfully',
    pickup: newPickup
  });
});

// Rewards Routes
app.get('/api/rewards', (req, res) => {
  res.status(200).json({
    success: true,
    rewards: mockRewards
  });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=========================================`);
  console.log(`ðŸŒ¿ Express Backend API Running`);
  console.log(`ðŸ“Œ Localhost: http://127.0.0.1:${PORT}`);
  console.log(`ðŸ“Œ Android Emulator: http://10.0.2.2:${PORT}`);
  console.log(`=========================================`);
});
