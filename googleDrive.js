const fs = require('fs');
const { google } = require('googleapis');
const path = require('path');

// Load service account credentials
const KEYFILEPATH = path.join(__dirname, 'credentials.json'); // <-- make sure this file exists
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

// Authenticate with Google Drive
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const driveService = google.drive({ version: 'v3', auth });

// Upload file function
async function uploadToDrive(filePath, fileName) {
  const fileMetadata = {
    name: fileName,
    parents: ['YOUR_FOLDER_ID'], // ⬅️ Replace with your actual Google Drive folder ID
  };

  const media = {
    mimeType: 'application/pdf',
    body: fs.createReadStream(filePath),
  };

  try {
    const response = await driveService.files.create({
      resource: fileMetadata,
      media,
      fields: 'id, webViewLink, webContentLink',
    });

    const { webViewLink } = response.data;
    return webViewLink;
  } catch (err) {
    console.error('❌ Google Drive upload failed:', err.message);
    throw err;
  }
}

module.exports = uploadToDrive;
