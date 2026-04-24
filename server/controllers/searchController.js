const { searchProductsByName } = require('../services/openFoodFactsService');

// GET /api/search?q=name
exports.searchProducts = async (req, res) => {
  try {
    const { q, page = 1 } = req.query;
    if (!q || q.trim() === '')
      return res.status(400).json({ message: 'Search query is required' });

    const result = await searchProductsByName(q.trim(), Number(page));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/search/categories
exports.getCategories = (req, res) => {
  const categories = [
    { id: 'biscuits',   name: 'Biscuits',          icon: '🍪' },
    { id: 'drinks',     name: 'Cold Drinks',        icon: '🥤' },
    { id: 'snacks',     name: 'Snacks',             icon: '🍿' },
    { id: 'dairy',      name: 'Dairy',              icon: '🥛' },
    { id: 'chocolates', name: 'Chocolates',         icon: '🍫' },
    { id: 'breakfast',  name: 'Breakfast & Spreads',icon: '🥣' },
    { id: 'instant',    name: 'Instant Food',       icon: '🍜' },
    { id: 'health',     name: 'Health Foods',       icon: '🌿' },
  ];
  res.json(categories);
};
