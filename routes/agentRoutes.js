const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Serial number generator
let serialCounter = 1;

router.post('/submit', async (req, res) => {
  const data = req.body;

  // Generate unique serial number with prefix
  const serial = `OM${serialCounter.toString().padStart(5, '0')}`;
  serialCounter++;

  // Auto date & time
  const dateTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: process.env.MAIL_USER,
    subject: 'Lab Agent Submission - Diagnostic Center',
    html: `
      <h2>Lab Agent Submission</h2>
      <p><b>Agent:</b> ${data.agent}</p>
      <p><b>Serial Number:</b> ${serial}</p>
      <p><b>Date & Time:</b> ${dateTime}</p>
      <p><b>Patient Address:</b> ${data.address}</p>
      <p><b>Phone:</b> ${data.phone}</p>
      <p><b>Test:</b> ${data.test}</p>
      <p><b>Price:</b> ₹${data.price}</p>
      <p><b>Payment Mode:</b> ${data.paymentMode}</p>
      <p><b>Notes:</b> ${data.notes}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Agent submission sent!', serial, dateTime });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send mail' });
  }
});

module.exports = router;
