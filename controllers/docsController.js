// backend/controllers/docsController.js
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const bucketName = process.env.S3_BUCKET;

// Upload document: assumes userId is passed in req.body (or through authentication)
exports.uploadDoc = async (req, res) => {
  const { userId } = req.body;
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: 'User not found' });
    
    // Create S3 upload parameters
    const fileKey = Date.now() + '-' + req.file.originalname;
    const params = {
      Bucket: bucketName,
      Key: fileKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read'
    };

    // Upload to S3
    s3.upload(params, async (err, data) => {
      if (err) {
        console.error("S3 Upload Error:", err);
        return res.status(500).json({ message: 'Error uploading file', error: err });
      }
      // Save document info in the user's docs array (store the file URL and key)
      user.docs.push({
                        // S3 key for future reference (update/delete)
        url: data.Location,          // S3 URL to access the file
        originalName: req.file.originalname,
      });
      // console.log(data.Location)
      await user.save();
      res.json({ message: 'Document uploaded successfully', docs: user.docs });
    });
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
  
    // Delete the old file from S3 using its key
    const deleteParams = {
      Bucket: bucketName,
      Key: doc.originalName,
    };
    await s3.deleteObject(deleteParams).promise();
  
    // Upload the new file to S3
    const newFileKey = Date.now() + '-' + req.file.originalname;
    const uploadParams = {
      Bucket: bucketName,
      Key: newFileKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read'
    };
  
    s3.upload(uploadParams, async (err, data) => {
      if (err) {
        console.error("S3 Update Upload Error:", err);
        return res.status(500).json({ message: 'Error updating file', error: err });
      }
  
      // Update document info with new file details
      doc.key = newFileKey;
      doc.url = data.Location;
      doc.originalName = req.file.originalname;
      doc.uploadDate = Date.now();
  
      await user.save();
      res.json({ message: "Document updated successfully", doc });
    });
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
    
      // Delete the file from S3 using its key
      const deleteParams = {
        Bucket: bucketName,
        Key: doc.originalName,
      };
      await s3.deleteObject(deleteParams).promise();
    
      // Remove the document from the user's docs array
      user.docs.pull({ _id: docId });
      await user.save();
      res.json({ message: "Document deleted successfully" });
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };
  