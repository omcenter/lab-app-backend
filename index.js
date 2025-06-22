const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();

// ✅ MongoDB connection
const MONGO_URI = "mongodb+srv://omdiagnosticcenterdelhi:<your_password>@labapp.6gei66t.mongodb.net/labApp?retryWrites=true&w=majority&appName=labApp";
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route Imports
const doctorRoutes = require('./routes/doctorRoutes');
const agentRoutes = require('./routes/agentRoutes');
const labRoutes = require('./routes/labRoutes');
const testRoutes = require('./routes/testRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const reportRoutes = require('./routes/reportRoutes'); // ✅ New route
const data = require('./data');

// Route Setup
app.use('/api/doctor', doctorRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/lab', labRoutes);
app.use('/api/tests', testRoutes);
app.use('/api', uploadRoutes);
app.use('/api/reports', reportRoutes); // ✅ Now live

// Dropdown Data APIs
app.get('/api/doctors', (req, res) => res.json(data.doctors));
app.get('/api/agents', (req, res) => res.json(data.agents));
app.get('/api/tests', (req, res) => res.json(data.tests));

// Root Route
app.get('/', (req, res) => {
  res.send('✅ Om Diagnostic Center API is running!');
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
