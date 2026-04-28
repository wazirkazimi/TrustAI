const axios = require('axios');

/**
 * Fetch product from Open Food Facts by barcode
 * @param {string} barcode - Product barcode number
 */
async function getProductByBarcode(barcode) {
  try {
    const res = await axios.get(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
      { timeout: 8000 }
    );

    if (res.data.status !== 1) {
      return null; // Product not found
    }

    const p = res.data.product;
    const n = p.nutriments || {};

    return {
      productName: p.product_name || p.product_name_en || 'Unknown Product',
      brand: p.brands || '',
      imageUrl: p.image_url || '',
      categories: p.categories || '',
      vegStatus: detectVegStatus(p),
      nutritionData: {
        calories: n['energy-kcal_100g'] || n['energy_100g'] / 4.18 || 0,
        sugar: n['sugars_100g'] || 0,
        fat: n['fat_100g'] || 0,
        saturatedFat: n['saturated-fat_100g'] || 0,
        transFat: n['trans-fat_100g'] || 0,
        protein: n['proteins_100g'] || 0,
        fiber: n['fiber_100g'] || 0,
        sodium: n['sodium_100g'] ? n['sodium_100g'] * 1000 : 0, // convert g to mg
      },
      additives: p.additives_tags || [],
      processingLevel: detectProcessingLevel(p),
    };
  } catch (err) {
    console.error('Open Food Facts barcode error:', err.message);
    return null;
  }
}

/**
 * Search products by name (India-focused)
 */
async function searchProductsByName(query, page = 1) {
  try {
    const res = await axios.get('https://world.openfoodfacts.org/cgi/search.pl', {
      params: {
        search_terms: query,
        search_simple: 1,
        action: 'process',
        json: 1,
        page_size: 20,
        page,
        fields: 'code,product_name,product_name_en,brands,image_url,image_small_url,labels,ingredients_text,categories,additives_tags',
      },
      timeout: 10000,
    });

    const products = (res.data.products || [])
      .filter(p => p.product_name || p.product_name_en)
      .map(p => ({
        barcode: p.code,
        productName: p.product_name || p.product_name_en || 'Unknown Product',
        brand: p.brands || '',
        imageUrl: p.image_small_url || p.image_url || '',
        categories: p.categories || '',
        vegStatus: detectVegStatus(p),
      }));

    return { products, count: res.data.count || 0 };
  } catch (err) {
    console.error('Open Food Facts search error:', err.message);
    return { products: [], count: 0 };
  }
}

function detectVegStatus(product) {
  const labels = (product.labels || '').toLowerCase();
  const categories = (product.categories || '').toLowerCase();
  const ingredients = (product.ingredients_text || '').toLowerCase();

  const nonVegKeywords = ['meat', 'chicken', 'beef', 'pork', 'fish', 'egg', 'gelatin', 'mutton', 'lamb'];
  const vegKeywords = ['vegetarian', 'vegan', 'veg '];

  if (vegKeywords.some(k => labels.includes(k))) return 'veg';
  if (nonVegKeywords.some(k => ingredients.includes(k) || categories.includes(k))) return 'nonVeg';
  return 'unknown';
}

function detectProcessingLevel(product) {
  const pnns = (product.pnns_groups_1 || '').toLowerCase();
  const categories = (product.categories || '').toLowerCase();

  const ultraProcessedWords = ['instant noodles', 'chips', 'carbonated', 'candy', 'soda', 'biscuit'];
  const processedWords = ['bread', 'cheese', 'canned', 'preserved'];

  if (ultraProcessedWords.some(w => pnns.includes(w) || categories.includes(w))) return 'Ultra-Processed';
  if (processedWords.some(w => pnns.includes(w) || categories.includes(w))) return 'Processed';
  return 'Minimally Processed';
}

module.exports = { getProductByBarcode, searchProductsByName };
