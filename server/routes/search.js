const express = require('express');
const router = express.Router();
const { searchProducts, getCategories } = require('../controllers/searchController');

router.get('/', searchProducts);
router.get('/categories', getCategories);

module.exports = router;
