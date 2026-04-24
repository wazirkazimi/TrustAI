const Report = require('../models/Report');

// POST /api/report
exports.createReport = async (req, res) => {
  try {
    const { productName, fssaiNumber, note } = req.body;
    if (!productName) return res.status(400).json({ message: 'Product name is required' });

    const report = await Report.create({
      reportedBy: req.user?._id || null,
      productName,
      fssaiNumber: fssaiNumber || '',
      note: note || '',
    });

    res.status(201).json({ message: 'Report submitted successfully', report });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/report (admin only — basic implementation)
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
