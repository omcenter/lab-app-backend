const express = require('express');
const multer = require('multer');
const uploadToDrive = require('../googleDrive'); // Make sure this file exists
const fs = require('fs');
const path = require('path');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Uploads folder must exist

router.post('/upload-report', upload.fields([
  { name: 'report', maxCount: 1 },
  { name: 'invoice', maxCount: 1 }
]), async (req, res) => {
  try {
    const { mobile, testName } = req.body;
    const report = req.files?.report?.[0];
    const invoice = req.files?.invoice?.[0];

    if (!report || !invoice) {
      return res.status(400).send('Both report and invoice are required.');
    }

    // Upload to Google Drive
    const reportLink = await uploadToDrive(report.path, `Report-${mobile}-${testName}.pdf`);
    const invoiceLink = await uploadToDrive(invoice.path, `Invoice-${mobile}-${testName}.pdf`);

    // Clean up local files
    fs.unlinkSync(report.path);
    fs.unlinkSync(invoice.path);

    res.status(200).send(`✅ Uploaded successfully!\nReport: ${reportLink}\nInvoice: ${invoiceLink}`);
  } catch (err) {
    console.error('❌ Upload failed:', err);
    res.status(500).send('Upload failed.');
  }
});

module.exports = router;
