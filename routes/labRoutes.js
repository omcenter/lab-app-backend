const express = require('express');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const moment = require('moment');
const router = express.Router();

// Path to counter file
const counterFile = path.join(__dirname, '../data/invoice_counter.json');

// Helper to get next invoice ID
function getNextInvoiceId() {
  const data = JSON.parse(fs.readFileSync(counterFile, 'utf-8'));
  data.current += 1;
  fs.writeFileSync(counterFile, JSON.stringify(data));
  return 'INV-' + data.current.toString().padStart(5, '0');
}

router.post('/submit', async (req, res) => {
  const { patientName, address, phone, lab, tests } = req.body;

  if (!tests || !Array.isArray(tests) || tests.length === 0) {
    return res.status(400).json({ message: 'No tests provided' });
  }

  const doc = new PDFDocument({ size: 'A4', margin: 40 });
  const chunks = [];

  doc.on('data', chunk => chunks.push(chunk));
  doc.on('end', () => {
    const pdfBuffer = Buffer.concat(chunks);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=receipt.pdf');
    res.send(pdfBuffer);
  });

  const invoiceId = getNextInvoiceId();
  const dateStr = moment().format('DD-MM-YYYY');
  const timeStr = moment().format('HH:mm');

  // Helper to draw a slip section (top or bottom)
  function drawSlip(yOffset, hideAmount = false) {
    doc.font('Helvetica-Bold').fontSize(16).text('OM Diagnostic Center', 0, yOffset, { align: 'center' });
    doc.font('Helvetica').fontSize(11).text(`Referred to: ${lab}`, 40, yOffset + 30);

    let y = yOffset + 50;
    doc.fontSize(10)
      .text(`Invoice No: ${invoiceId}`, 40, y)
      .text(`Date: ${dateStr} ${timeStr}`, 300, y);
    y += 15;
    doc.text(`Patient Name: ${patientName}`, 40, y)
      .text(`Phone: ${phone}`, 300, y);
    y += 15;
    doc.text(`Address: ${address}`, 40, y);

    y += 25;
    doc.font('Helvetica-Bold').text('Test Details:', 40, y);
    y += 15;

    doc.font('Helvetica');
    let total = 0;
    tests.forEach(({ name, price }, idx) => {
      doc.text(`${idx + 1}. ${name}`, 40, y);
      if (!hideAmount) {
        doc.text(`₹${price}`, 450, y);
      }
      y += 15;
      total += parseFloat(price);
    });

    if (!hideAmount) {
      y += 10;
      doc.font('Helvetica-Bold').text(`Total Amount: ₹${total.toFixed(2)}`, 400, y);
    }

    y += 30;
    doc.font('Helvetica').text('Doctor/Lab Signature:', 40, y);
    doc.text('__________________________', 40, y + 15);

    y += 40;
    if (!hideAmount) {
      doc.fontSize(9).fillColor('#666').text(
        'For suggestions or complaints, email omdiagnosticcenterdelhi@gmail.com or WhatsApp 8882447570',
        40,
        y,
        { align: 'center', width: 515 }
      ).fillColor('black');
    }
  }

  // Draw original (upper half with price)
  drawSlip(40, false);

  // Draw duplicate (lower half without price)
  drawSlip(430, true);

  doc.end();
});

module.exports = router;
