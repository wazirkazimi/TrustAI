const express = require('express');
const router = express.Router();
const { createReport, getAllReports } = require('../controllers/reportController');
const { optionalAuth, protect } = require('../middleware/authMiddleware');

router.post('/', optionalAuth, createReport);
router.get('/',  protect, getAllReports);   // admin view

module.exports = router;
