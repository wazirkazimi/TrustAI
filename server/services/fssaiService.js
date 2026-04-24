const axios = require('axios');

/**
 * Verify FSSAI license via FOSCOS API
 * On failure, gracefully returns 'unverified'
 */
async function verifyFSSAI(licenseNo) {
  if (!licenseNo || licenseNo.trim() === '') return { status: 'unverified', details: null };

  try {
    const res = await axios.post(
      'https://foscos.fssai.gov.in/api/searchlicencedetail',
      { licenseNo: licenseNo.trim() },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.FSSAI_API_KEY || ''}`,
        },
        timeout: 6000,
      }
    );

    if (res.data && res.data.licenseStatus === 'Active') {
      return { status: 'valid', details: res.data };
    }

    return { status: 'invalid', details: res.data };
  } catch (err) {
    console.warn('FSSAI verification failed gracefully:', err.message);
    return { status: 'unverified', details: null };
  }
}

/**
 * Extract FSSAI license number from OCR text
 * FSSAI numbers are 14-digit strings
 */
function extractFSSAINumber(text) {
  const match = text.match(/\b\d{14}\b/);
  return match ? match[0] : '';
}

module.exports = { verifyFSSAI, extractFSSAINumber };
