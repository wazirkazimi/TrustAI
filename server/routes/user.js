const express = require('express');
const router = express.Router();
const { updateHealthMode, updateVegPreference, getBookmarks, bookmarkScan } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.put('/mode',              protect, updateHealthMode);
router.put('/veg',               protect, updateVegPreference);
router.get('/bookmarks',         protect, getBookmarks);
router.post('/bookmark/:scanId', protect, bookmarkScan);

module.exports = router;
