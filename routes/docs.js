
const express = require('express');
const router = express.Router();
const docsController = require('../controllers/docsController');
const multer = require('multer');


const storage = multer.memoryStorage();  
const upload = multer({ storage });


router.post('/upload', upload.single('document'), docsController.uploadDoc);

router.get('/get/:userId', docsController.getDocs);
router.get('/content/:userId/:docId', docsController.getDocContent);

router.put('/update', upload.single('document'), docsController.updateDoc);


router.delete('/delete', docsController.deleteDoc);

module.exports = router;
