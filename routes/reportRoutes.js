const express = require('express');
const router = express.Router();
const axios = require('axios');
const Papa = require('papaparse');

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRNVt3Mbily9Tz5g7UNm687nYYxZ4QHcr0Q2E5tZw_5N1VRjGHhe91MZ48ueZ33u2RnxT5QTkeQyXWf/pub?output=csv";

router.get('/:mobile', async (req, res) => {
  const mobile = req.params.mobile.trim();

  try {
    const response = await axios.get(SHEET_CSV_URL);
    const csv = response.data;

    Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data;

        const matched = data.filter(row =>
          row["Phone number"]?.trim() === mobile
        );

        const reports = matched.map(row => ({
          mobile: row["Phone number"],
          patientName: row["Patient Name"],
          testName: row["Test Name"],
          date: row["Test Date"],
          reportUrl: row["Direct Download Link"]
        }));

        res.json(reports);
      },
      error: (err) => {
        console.error("❌ CSV parse error:", err);
        res.status(500).send("Failed to parse sheet.");
      }
    });
  } catch (err) {
    console.error("❌ Sheet fetch error:", err);
    res.status(500).send("Failed to fetch sheet data.");
  }
});

module.exports = router;
