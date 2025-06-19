const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const app = express(); // ✅ App initialized first

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const doctorRoutes = require('./routes/doctorRoutes');
const agentRoutes = require('./routes/agentRoutes');
const labRoutes = require('./routes/labRoutes');
const data = require('./data'); // ✅ Load dropdown data
const testRoutes = require('./routes/testRoutes'); // Add for tests

// API Routes
app.use('/api/doctor', doctorRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/lab', labRoutes);
app.use('/api/tests', testRoutes);

// Dropdown data routes
app.get('/api/doctors', (req, res) => {
  res.json(data.doctors);
});

app.get('/api/agents', (req, res) => {
  res.json(data.agents);
});

app.get('/api/tests', (req, res) => {
  res.json(data.tests);
});

// Default route
app.get('/', (req, res) => {
  res.send('Diagnostic Center API running!');
});

// Server listen
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
