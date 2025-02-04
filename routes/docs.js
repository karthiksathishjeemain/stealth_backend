// backend/routes/docs.js
const express = require('express');
const router = express.Router();
const docsController = require('../controllers/docsController');
const multer = require('multer');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure the "uploads" folder exists
  },
  filename: function (req, file, cb) {
    // Prepend Date.now() to filename to make it unique
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Existing document upload endpoint (if any)
router.post('/upload', upload.single('document'), docsController.uploadDoc);

// Endpoint to retrieve documents
router.get('/get/:userId', docsController.getDocs);

// New: Update document endpoint using FormData
router.put('/update', upload.single('document'), docsController.updateDoc);

// New: Delete document endpoint using JSON payload
router.delete('/delete', docsController.deleteDoc);

module.exports = router;
