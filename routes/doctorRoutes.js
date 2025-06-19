const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/submit', async (req, res) => {
  const { doctor, patientName, gender, age, tests, notes } = req.body;

  // Debug: Log full body to confirm structure
  console.log('Received doctor submission:', req.body);

  // Handle tests safely
  const testList = Array.isArray(tests) ? tests.join(', ') : (tests || 'N/A');

  const htmlContent = `
    <h2>Doctor Submission</h2>
    <p><strong>Doctor:</strong> ${doctor}</p>
    <p><strong>Patient Name:</strong> ${patientName}</p>
    <p><strong>Gender:</strong> ${gender}</p>
    <p><strong>Age/DOB:</strong> ${age}</p>
    <p><strong>Test(s):</strong> ${testList}</p>
    <p><strong>Notes:</strong> ${notes || 'N/A'}</p>
  `;

  // Email setup
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: 'omdiagnosticcenterdelhi@gmail.com',
    subject: 'New Doctor Submission',
    html: htmlContent
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Submission successful!' });
  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).json({ message: 'Error sending email' });
  }
});

module.exports = router;
