const Scan = require('../models/Scan');
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

    // Convert buffer to base64 for Vision API
    const base64Image = req.file.buffer.toString('base64');

    // 1. Run OCR
    const { fssaiNumber, nutritionRaw } = await extractTextFromImage(base64Image);

    // 2. Verify FSSAI
    const { status: fssaiStatus } = await verifyFSSAI(fssaiNumber);

    // 3. Compute grades
    const scores = computeAllGrades(nutritionRaw, healthMode);

    // 4. Upload image to Cloudinary (optional — skip if not configured)
    let imageUrl = '';
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      const dataUri = `data:${req.file.mimetype};base64,${base64Image}`;
      const upload = await cloudinary.uploader.upload(dataUri, { folder: 'foodtrust' });
      imageUrl = upload.secure_url;
    }

    // 5. Save scan to DB
    const scan = await Scan.create({
      userId: req.user?._id || null,
      imageUrl,
      fssaiNumber,
      fssaiStatus,
      nutritionData: nutritionRaw,
      scores,
      healthMode,
    });

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

    // 2. Verify FSSAI (if available in product data — often unavailable for OFF)
    const { status: fssaiStatus } = await verifyFSSAI('');

    // 3. Compute grades
    const scores = computeAllGrades(product.nutritionData, healthMode);

    // 4. Save scan
    const scan = await Scan.create({
      userId: req.user?._id || null,
      productName: product.productName,
      imageUrl: product.imageUrl,
      barcodeNumber: barcode,
      fssaiStatus,
      vegStatus: product.vegStatus,
      nutritionData: product.nutritionData,
      additives: product.additives,
      processingLevel: product.processingLevel,
      scores,
      healthMode,
    });

    res.json({ scan });
  } catch (err) {
    console.error('Barcode scan error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/scan/history
exports.getScanHistory = async (req, res) => {
  try {
    const scans = await Scan.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(scans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/scan/:id
exports.getScanById = async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.id);
    if (!scan) return res.status(404).json({ message: 'Scan not found' });
    res.json(scan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
