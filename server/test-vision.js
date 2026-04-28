const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

async function testVision() {
  const apiKey = process.env.GOOGLE_VISION_API_KEY;
  console.log('Testing Vision API with key:', apiKey ? 'FOUND' : 'MISSING');
  
  if (!apiKey) {
    console.error('❌ GOOGLE_VISION_API_KEY is missing in .env');
    process.exit(1);
  }

  // Use a tiny transparent pixel as a mock image
  const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

  try {
    const res = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        requests: [{
          image: { content: base64Image },
          features: [{ type: 'TEXT_DETECTION', maxResults: 1 }],
        }],
      }
    );

    if (res.data.responses?.[0]?.error) {
      console.error('❌ Vision API returned an error:');
      console.error(JSON.stringify(res.data.responses[0].error, null, 2));
      process.exit(1);
    }

    console.log('✅ Vision API check successful! The key is valid and billing is enabled.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Vision API connection failed:');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
    process.exit(1);
  }
}

testVision();
