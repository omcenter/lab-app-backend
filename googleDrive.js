const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// ✅ Google Drive Setup
const KEYFILEPATH = path.join(__dirname, 'credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

if (!fs.existsSync(KEYFILEPATH)) {
  console.error('❌ Missing credentials.json. Upload it to backend directory.');
  process.exit(1); // Stop server if credentials missing
}

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

let driveService;

(async () => {
  const authClient = await auth.getClient();
  driveService = google.drive({ version: 'v3', auth: authClient });
})();

// ✅ Upload Function
async function uploadToDrive(filePath, fileName) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`❌ File not found: ${filePath}`);
  }

  const fileMetadata = {
    name: fileName,
    parents: ['1yBEddjiTwAPXTw5KdnYKWm7zK6_HldjU'], // ✅ Your actual folder ID
  };

  const media = {
    mimeType: 'application/pdf',
    body: fs.createReadStream(filePath),
  };

  try {
    const response = await driveService.files.create({
      resource: fileMetadata,
      media,
      fields: 'id, webViewLink',
    });

    const fileId = response.data.id;

    // ✅ Make file public
    await driveService.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    const publicLink = `https://drive.google.com/file/d/${fileId}/view`;
    return publicLink;
  } catch (err) {
    console.error('❌ Google Drive upload failed:', err.message);
    throw err;
  }
}

module.exports = uploadToDrive;
