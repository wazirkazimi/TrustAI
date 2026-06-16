const axios = require('axios');

// Robust mock database of Indian and international products for offline demo use
const MOCK_PRODUCTS = [
  {
    barcode: '3017620422003',
    productName: 'Nutella Hazelnut Spread',
    brand: 'Ferrero',
    imageUrl: 'https://images.unsplash.com/photo-1553456558-aff63285bdd1?w=500',
    categories: 'Breakfast & Spreads, Cocoa Spreads',
    vegStatus: 'veg',
    nutritionData: {
      calories: 539,
      protein: 6.3,
      carbs: 57.5,
      fat: 30.9,
      saturatedFat: 10.6,
      transFat: 0.1,
      sugar: 56.3,
      sodium: 107
    },
    additives: ['E322'],
    processingLevel: 'Ultra-Processed'
  },
  {
    barcode: '8901058002316',
    productName: 'Maggi 2-Minute Masala Noodles',
    brand: 'Nestle',
    imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500',
    categories: 'Instant Noodles, Snacks',
    vegStatus: 'veg',
    nutritionData: {
      calories: 389,
      protein: 8,
      carbs: 59,
      fat: 14,
      saturatedFat: 6.5,
      transFat: 0.1,
      sugar: 2.2,
      sodium: 1100
    },
    additives: ['E621', 'E635', 'E508'],
    processingLevel: 'Ultra-Processed'
  },
  {
    barcode: '5449000000996',
    productName: 'Coca-Cola Classic',
    brand: 'Coca-Cola',
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500',
    categories: 'Cold Drinks, Sodas, Beverages',
    vegStatus: 'veg',
    nutritionData: {
      calories: 44,
      protein: 0,
      carbs: 10.9,
      fat: 0,
      saturatedFat: 0,
      transFat: 0,
      sugar: 10.6,
      sodium: 4
    },
    additives: ['E150d', 'E338'],
    processingLevel: 'Ultra-Processed'
  },
  {
    barcode: '8904063200057',
    productName: "Haldiram's Bhujia Sev",
    brand: "Haldiram's",
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500',
    categories: 'Snacks, Indian Savories',
    vegStatus: 'veg',
    nutritionData: {
      calories: 579,
      protein: 11,
      carbs: 41,
      fat: 41,
      saturatedFat: 12.5,
      transFat: 0.1,
      sugar: 0,
      sodium: 890
    },
    additives: ['E330'],
    processingLevel: 'Processed'
  },
  {
    barcode: '8901063013864',
    productName: 'Britannia Good Day Butter Cookies',
    brand: 'Britannia',
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500',
    categories: 'Biscuits, Cookies, Snacks',
    vegStatus: 'veg',
    nutritionData: {
      calories: 510,
      protein: 7,
      carbs: 64,
      fat: 25,
      saturatedFat: 11.2,
      transFat: 0.1,
      sugar: 22,
      sodium: 320
    },
    additives: ['E500', 'E503', 'E322', 'E471'],
    processingLevel: 'Ultra-Processed'
  },
  {
    barcode: '8901262010015',
    productName: 'Amul Gold Milk',
    brand: 'Amul',
    imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500',
    categories: 'Dairy, Milk',
    vegStatus: 'veg',
    nutritionData: {
      calories: 87,
      protein: 3.2,
      carbs: 4.7,
      fat: 6,
      saturatedFat: 3.8,
      transFat: 0.1,
      sugar: 0,
      sodium: 50
    },
    additives: [],
    processingLevel: 'Minimally Processed'
  },
  {
    barcode: '8901491101830',
    productName: "Lay's Classic Salted Chips",
    brand: "Lay's",
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500',
    categories: 'Snacks, Potato Chips',
    vegStatus: 'veg',
    nutritionData: {
      calories: 541,
      protein: 7,
      carbs: 53,
      fat: 33,
      saturatedFat: 11.8,
      transFat: 0.1,
      sugar: 1.5,
      sodium: 590
    },
    additives: [],
    processingLevel: 'Ultra-Processed'
  },
  {
    barcode: '7622201416972',
    productName: 'Cadbury Dairy Milk Chocolate',
    brand: 'Cadbury',
    imageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500',
    categories: 'Chocolates, Confectionery',
    vegStatus: 'veg',
    nutritionData: {
      calories: 534,
      protein: 7.3,
      carbs: 57,
      fat: 30,
      saturatedFat: 18.5,
      transFat: 0.2,
      sugar: 56,
      sodium: 80
    },
    additives: ['E322', 'E476'],
    processingLevel: 'Ultra-Processed'
  },
  {
    barcode: '8901030761271',
    productName: 'Kissan Tomato Ketchup',
    brand: 'Kissan',
    imageUrl: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd46f?w=500',
    categories: 'Breakfast & Spreads, Sauces',
    vegStatus: 'veg',
    nutritionData: {
      calories: 120,
      protein: 1.2,
      carbs: 28,
      fat: 0.1,
      saturatedFat: 0,
      transFat: 0,
      sugar: 26,
      sodium: 980
    },
    additives: ['E211', 'E260', 'E415'],
    processingLevel: 'Processed'
  }
];

/**
 * Fetch product from Open Food Facts by barcode
 * @param {string} barcode - Product barcode number
 */
async function getProductByBarcode(barcode) {
  try {
    const res = await axios.get(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
      { 
        headers: { 'User-Agent': 'TrustAI - NodeJs - 1.0.0 - contact@trustai.org' },
        timeout: 8000 
      }
    );

    if (res.data.status !== 1) {
      // If not found in live OFF, search mock database
      const found = MOCK_PRODUCTS.find(p => p.barcode === barcode);
      if (found) return found;
      return null;
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
    console.error('Open Food Facts barcode error (falling back to mock):', err.message);
    // Fallback on timeout/503/network error
    const found = MOCK_PRODUCTS.find(p => p.barcode === barcode);
    if (found) return found;

    return {
      barcode: barcode,
      productName: 'Mock Sourced Product (' + barcode + ')',
      brand: 'Sourced Brand',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500',
      categories: 'Sourced Foods',
      vegStatus: 'veg',
      nutritionData: {
        calories: 150,
        protein: 4,
        carbs: 20,
        fat: 5,
        saturatedFat: 1,
        transFat: 0,
        sugar: 5,
        sodium: 200
      },
      additives: [],
      processingLevel: 'Processed'
    };
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
        countries_tags_en: 'india',
        fields: 'code,product_name,product_name_en,brands,image_url,image_small_url,labels,ingredients_text,categories,additives_tags',
      },
      headers: { 'User-Agent': 'TrustAI - NodeJs - 1.0.0 - contact@trustai.org' },
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
    console.error('Open Food Facts search error (falling back to mock):', err.message);
    
    // Fallback to local search on 503/network error
    const lowerQuery = query.toLowerCase();
    const filtered = MOCK_PRODUCTS.filter(p => 
      p.productName.toLowerCase().includes(lowerQuery) || 
      p.brand.toLowerCase().includes(lowerQuery) || 
      p.categories.toLowerCase().includes(lowerQuery)
    );

    const finalProducts = filtered.length > 0 ? filtered : MOCK_PRODUCTS.slice(0, 4);

    return {
      products: finalProducts.map(p => ({
        barcode: p.barcode,
        productName: p.productName,
        brand: p.brand,
        imageUrl: p.imageUrl,
        categories: p.categories,
        vegStatus: p.vegStatus
      })),
      count: finalProducts.length
    };
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

