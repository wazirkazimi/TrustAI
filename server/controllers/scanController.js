const supabase = require('../config/supabase');
const { extractTextFromImage } = require('../services/ocrService');
const { verifyFSSAI } = require('../services/fssaiService');
const { getProductByBarcode } = require('../services/openFoodFactsService');
const { computeAllGrades } = require('../services/gradingService');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST /api/scan/image
exports.scanImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

    const healthMode = req.user?.healthMode || req.body.healthMode || 'default';
    const base64Image = req.file.buffer.toString('base64');

    // 1. Run OCR
    const { fssaiNumber, nutritionRaw } = await extractTextFromImage(base64Image);

    // 2. Verify FSSAI
    const { status: fssaiStatus } = await verifyFSSAI(fssaiNumber);

    // 3. Compute grades
    const scores = computeAllGrades(nutritionRaw, healthMode);

    // 4. Upload image to Cloudinary
    let imageUrl = '';
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      const dataUri = `data:${req.file.mimetype};base64,${base64Image}`;
      const upload = await cloudinary.uploader.upload(dataUri, { folder: 'foodtrust' });
      imageUrl = upload.secure_url;
    }

    // 5. Save scan to Supabase
    const { data: scan, error } = await supabase
      .from('scans')
      .insert([{
        user_id: req.user?.id || null,
        image_url: imageUrl,
        fssai_number: fssaiNumber,
        fssai_status: fssaiStatus,
        nutrition_data: nutritionRaw,
        scores: scores,
        health_mode: healthMode
      }])
      .select()
      .single();

    if (error) throw error;
    res.json({ scan });
  } catch (err) {
    console.error('Image scan error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// POST /api/scan/barcode
exports.scanBarcode = async (req, res) => {
  try {
    const { barcode } = req.body;
    if (!barcode) return res.status(400).json({ message: 'Barcode is required' });

    const healthMode = req.user?.healthMode || req.body.healthMode || 'default';

    // 1. Fetch from Open Food Facts
    const product = await getProductByBarcode(barcode);
    if (!product) return res.status(404).json({ message: 'Product not found in database' });

    // 2. Verify FSSAI
    const { status: fssaiStatus } = await verifyFSSAI('');

    // 3. Compute grades
    const scores = computeAllGrades(product.nutritionData, healthMode);

    // 4. Save scan to Supabase
    const { data: scan, error } = await supabase
      .from('scans')
      .insert([{
        user_id: req.user?.id || null,
        product_name: product.productName,
        image_url: product.imageUrl,
        barcode_number: barcode,
        fssai_status: fssaiStatus,
        veg_status: product.vegStatus,
        nutrition_data: product.nutritionData,
        additives: product.additives,
        processing_level: product.processingLevel,
        scores: scores,
        health_mode: healthMode
      }])
      .select()
      .single();

    if (error) throw error;
    res.json({ scan });
  } catch (err) {
    console.error('Barcode scan error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/scan/history
exports.getScanHistory = async (req, res) => {
  try {
    const { data: scans, error } = await supabase
      .from('scans')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    res.json(scans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/scan/:id
exports.getScanById = async (req, res) => {
  try {
    const { data: scan, error } = await supabase
      .from('scans')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !scan) return res.status(404).json({ message: 'Scan not found' });
    res.json(scan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
