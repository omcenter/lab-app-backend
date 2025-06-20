const express = require('express');
const multer = require('multer');
const uploadToDrive = require('../googleDrive'); // Make sure this is correctly configured
const fs = require('fs');
const path = require('path');

const router = express.Router();

// ✅ Make sure 'uploads/' directory exists
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

    // 🔍 Log uploaded files to check multer is working
    console.log("📥 Uploaded report path:", report?.path);
    console.log("📥 Uploaded invoice path:", invoice?.path);

    if (!report || !invoice) {
      return res.status(400).send('❌ Both report and invoice are required.');
    }

    // ✅ Upload to Google Drive
    const reportLink = await uploadToDrive(report.path, `Report-${mobile}-${testName}.pdf`);
    const invoiceLink = await uploadToDrive(invoice.path, `Invoice-${mobile}-${testName}.pdf`);

    // ✅ Delete temp files after upload
    fs.unlinkSync(report.path);
    fs.unlinkSync(invoice.path);

    // ✅ Respond with links
    res.status(200).send(`✅ Uploaded successfully!\nReport: ${reportLink}\nInvoice: ${invoiceLink}`);
  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).send('❌ Upload failed.');
  }
});

module.exports = router;
