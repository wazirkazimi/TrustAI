const express = require('express');
const router = express.Router();
const { scanImage, scanBarcode, getScanHistory, getScanById } = require('../controllers/scanController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.post('/image',   optionalAuth, upload.single('image'), scanImage);
router.post('/barcode', optionalAuth, scanBarcode);
router.get('/history',  protect, getScanHistory);
router.get('/:id',      getScanById);

module.exports = router;
