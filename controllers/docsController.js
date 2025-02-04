// backend/controllers/docsController.js
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
// Upload document: assumes userId is passed in req.body (or through authentication)
exports.uploadDoc = async (req, res) => {
  const { userId } = req.body;
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: 'User not found' });

    user.docs.push({
      filename: req.file.filename,
      originalName: req.file.originalname,
    });
    await user.save();
    res.json({ message: 'Document uploaded successfully', docs: user.docs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Retrieve documents for a user
exports.getDocs = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).select('docs');
    if (!user) return res.status(400).json({ message: 'User not found' });
    res.json({ docs: user.docs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update a document’s metadata (e.g., rename)
// Update a document
exports.updateDoc = async (req, res) => {
    const { userId, docId } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
  
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(400).json({ message: "User not found" });
  
      // Find the document subdocument by its _id
      const doc = user.docs.id(docId);
      if (!doc) return res.status(400).json({ message: "Document not found" });
  
      // Delete the old file from the uploads folder
      const oldFilePath = path.join(__dirname, '..', 'uploads', doc.filename);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
  
      // Update the document fields with the new file information
      doc.filename = req.file.filename;
      doc.originalName = req.file.originalname;
      doc.uploadDate = Date.now();
  
      await user.save();
      res.json({ message: "Document updated successfully", doc });
    } catch (error) {
      console.error("Error updating document:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };
  
  // Delete a document
  exports.deleteDoc = async (req, res) => {
    const { userId, docId } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(400).json({ message: "User not found" });
  
      // Find the document subdocument by its _id
      const doc = user.docs.id(docId);
      if (!doc) return res.status(400).json({ message: "Document not found" });
  
      // Delete the file from the uploads folder
      const filePath = path.join(__dirname, '..', 'uploads', doc.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
  
      // Remove the document from the user's docs array
      user.docs.pull({ _id: docId });
      await user.save();
      res.json({ message: "Document deleted successfully" });
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };