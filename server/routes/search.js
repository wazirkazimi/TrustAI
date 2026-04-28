const express = require('express');
const router = express.Router();
const { searchProductsByName, getProductByBarcode } = require('../services/openFoodFactsService');

// GET /api/search?q=maggi&page=1
router.get('/', async (req, res) => {
  try {
    const { q = '', page = 1 } = req.query;
    if (!q || q.trim().length < 2) return res.json({ products: [], count: 0 });
    const data = await searchProductsByName(q.trim(), parseInt(page));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
});

// GET /api/search/product/:barcode
router.get('/product/:barcode', async (req, res) => {
  try {
    const data = await getProductByBarcode(req.params.barcode);
    if (!data) return res.status(404).json({ message: 'Product not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Lookup failed', error: err.message });
  }
});

module.exports = router;
