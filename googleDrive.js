const fs = require('fs');
const { google } = require('googleapis');

const KEYFILEPATH = './drive-key.json';
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const driveService = google.drive({ version: 'v3', auth });

async function uploadToDrive(file, folderId) {
  const fileMetadata = {
    name: file.originalname,
    parents: [folderId],
  };

  const media = {
    mimeType: file.mimetype,
    body: fs.createReadStream(file.path),
  };

  const response = await driveService.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id',
  });

  fs.unlinkSync(file.path); // delete after upload
  return response.data.id;
}

module.exports = uploadToDrive;
