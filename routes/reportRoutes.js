const express = require('express');
const router = express.Router();

// 🔁 Dummy data for now – replace with Google Sheets/MongoDB logic later
const sampleReports = [
  {
    mobile: "8860203032",
    patientName: "Rahul Sharma",
    testName: "Blood Test",
    date: "2025-06-21",
    reportUrl: "https://drive.google.com/uc?id=REPORT_FILE_ID&export=download",
    invoiceUrl: "https://drive.google.com/uc?id=INVOICE_FILE_ID&export=download"
  }
];

router.get('/:mobile', (req, res) => {
  const mobile = req.params.mobile;
  const results = sampleReports.filter(r => r.mobile === mobile);
  res.json(results);
});

module.exports = router;
