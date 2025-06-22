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
];const express = require('express');
const router = express.Router();
const axios = require('axios');
const Papa = require('papaparse'); // You'll need to install this too

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRNVt3Mbily9Tz5g7UNm687nYYxZ4QHcr0Q2E5tZw_5N1VRjGHhe91MZ48ueZ33u2RnxT5QTkeQyXWf/pub?output=csv";

router.get('/:mobile', async (req, res) => {
  const mobile = req.params.mobile;

  try {
    const response = await axios.get(SHEET_CSV_URL);
    const csv = response.data;

    Papa.parse(csv, {
      header: true,
      complete: (results) => {
        const data = results.data;
        const matches = data.filter(row => row["Phone number"]?.trim() === mobile.trim());

        const formatted = matches.map(row => ({
          mobile: row["Phone number"],
          patientName: row["Patient Name"],
          testName: row["Test Name"],
          date: row["Test Date"],
          reportUrl: row["Direct Download Link"]
        }));

        res.json(formatted);
      },
      error: (err) => {
        console.error("Parsing error:", err);
        res.status(500).send("Failed to parse sheet.");
      }
    });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).send("Failed to load data from sheet.");
  }
});

module.exports = router;


router.get('/:mobile', (req, res) => {
  const mobile = req.params.mobile;
  const results = sampleReports.filter(r => r.mobile === mobile);
  res.json(results);
});

module.exports = router;
