const axios = require('axios');
const { extractFSSAINumber } = require('./fssaiService');

/**
 * Extract text from image using Google Vision API
 * Falls back to empty string on failure
 */
async function extractTextFromImage(base64Image) {
  const apiKey = process.env.GOOGLE_VISION_API_KEY;

  if (!apiKey) {
    console.warn('GOOGLE_VISION_API_KEY not set — skipping OCR');
    return { rawText: '', fssaiNumber: '', nutritionRaw: {} };
  }

  try {
    const res = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        requests: [{
          image: { content: base64Image },
          features: [{ type: 'TEXT_DETECTION', maxResults: 1 }],
        }],
      },
      { timeout: 15000 }
    );

    const rawText = res.data.responses?.[0]?.fullTextAnnotation?.text || '';
    const fssaiNumber = extractFSSAINumber(rawText);
    const nutritionRaw = parseNutritionFromText(rawText);

    return { rawText, fssaiNumber, nutritionRaw };
  } catch (err) {
    console.error('Google Vision API error:', err.message);
    return { rawText: '', fssaiNumber: '', nutritionRaw: {} };
  }
}

/**
 * Parse nutrition values from raw OCR text using regex
 */
function parseNutritionFromText(text) {
  const nutrition = {};

  const patterns = {
    calories:     /(?:energy|calories?|kcal)[^\d]*(\d+(?:\.\d+)?)\s*(?:kcal|kj|cal)?/i,
    fat:          /(?:total\s+)?fat[^\d]*(\d+(?:\.\d+)?)\s*g/i,
    saturatedFat: /saturated\s+fat[^\d]*(\d+(?:\.\d+)?)\s*g/i,
    transFat:     /trans\s+fat[^\d]*(\d+(?:\.\d+)?)\s*g/i,
    sugar:        /(?:total\s+)?sugars?[^\d]*(\d+(?:\.\d+)?)\s*g/i,
    protein:      /protein[^\d]*(\d+(?:\.\d+)?)\s*g/i,
    fiber:        /(?:dietary\s+)?fi[b|bre]+r[^\d]*(\d+(?:\.\d+)?)\s*g/i,
    sodium:       /sodium[^\d]*(\d+(?:\.\d+)?)\s*mg/i,
  };

  for (const [key, regex] of Object.entries(patterns)) {
    const match = text.match(regex);
    if (match) nutrition[key] = parseFloat(match[1]);
  }

  return nutrition;
}

module.exports = { extractTextFromImage, parseNutritionFromText };
