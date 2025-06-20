const express = require('express');
const multer = require('multer');
const uploadToDrive = require('../googleDrive'); // Make sure this is correctly configured
const fs = require('fs');
const path = require('path');

const router = express.Router();

// ✅ Ensure 'uploads/' folder exists
const upload = multer({
  dest: path.join(__dirname, '../uploads/')
});

router.post('/upload-report', upload.fields([
  { name: 'report', maxCount: 1 },
  { name: 'invoice', maxCount: 1 }
]), async (req, res) => {
  try {
    const { mobile, testName } = req.body;
    const report = req.files?.report?.[0];
    const invoice = req.files?.invoice?.[0];

    // 🔍 Log uploaded files
    console.log("📥 Uploaded report path:", report?.path);
    console.log("📥 Uploaded invoice path:", invoice?.path);

    if (!report || !invoice) {
      return res.status(400).json({ error: '❌ Both report and invoice are required.' });
    }

    // ✅ Upload to Google Drive
    const reportLink = await uploadToDrive(report.path, `Report-${mobile}-${testName}.pdf`);
    const invoiceLink = await uploadToDrive(invoice.path, `Invoice-${mobile}-${testName}.pdf`);

    // ✅ Clean up uploaded files
    fs.unlinkSync(report.path);
    fs.unlinkSync(invoice.path);

    // ✅ Send JSON response
    res.status(200).json({
      message: '✅ Uploaded successfully!',
      reportLink,
      invoiceLink
    });
  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ error: '❌ Upload failed.', details: err.message });
  }
});

module.exports = router;
