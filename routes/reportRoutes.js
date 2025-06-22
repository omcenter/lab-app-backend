const express = require('express');
const router = express.Router();

const sampleReports = [
  {
    mobile: "8860203032",
    patientName: "Rahul Sharma",
    testName: "Blood Test",
    date: "2025-06-21",
    reportUrl: "https://drive.google.com/uc?id=1A2B3C4D5E6F7G8H9I0J&export=download" // ✅ Only this remains
  }
];

router.get('/:mobile', (req, res) => {
  const mobile = req.params.mobile;
  const results = sampleReports.filter(r => r.mobile === mobile);
  res.json(results);
});

module.exports = router;
