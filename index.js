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
const testRoutes = require('./routes/testRoutes'); // ✅ Test route

// API Routes
app.use('/api/doctor', doctorRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/lab', labRoutes);
app.use('/api/tests', testRoutes);

// Dropdown Data Routes
app.get('/api/doctors', (req, res) => {
  res.json(data.doctors);
});

app.get('/api/agents', (req, res) => {
  res.json(data.agents);
});

app.get('/api/tests', (req, res) => {
  res.json(data.tests);
});

app.get('/api/reports/:mobile', (req, res) => {
  const { mobile } = req.params;

  // Dummy reports for now — later fetch from DB or uploads
  const reports = [
    {
      mobile: '8888888888',
      testName: 'Blood Test',
      date: '2025-06-15',
      reportUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      invoiceUrl: 'https://www.orimi.com/pdf-test.pdf'
    },
    {
      mobile: '8888888888',
      testName: 'X-Ray',
      date: '2025-06-10',
      reportUrl: 'https://www.africau.edu/images/default/sample.pdf',
      invoiceUrl: 'https://www.orimi.com/pdf-test.pdf'
    }
  ];

  // Filter by mobile number
  const patientReports = reports.filter(r => r.mobile === mobile);

  res.json(patientReports);
});

// ✅ SUGGESTION FORM ROUTE
app.post('/submit-suggestion', (req, res) => {
  const { name, phone, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS  // App password
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'omdiagnosticcenterdelhi@gmail.com',
    subject: 'New Suggestion from Website',
    text: `Name: ${name || 'N/A'}\nPhone: ${phone || 'N/A'}\n\nSuggestion:\n${message}`
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('❌ Suggestion email failed:', err);
      return res.status(500).send('Failed to send suggestion');
    }
    res.send('✅ Suggestion submitted successfully');
  });
});

// Default route
app.get('/', (req, res) => {
  res.send('Diagnostic Center API running!');
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
