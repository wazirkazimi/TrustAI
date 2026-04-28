const supabase = require('../config/supabase');

// POST /api/report
exports.createReport = async (req, res) => {
  try {
    const { productName, fssaiNumber, note } = req.body;
    if (!productName) return res.status(400).json({ message: 'Product name is required' });

    const { data: report, error } = await supabase
      .from('reports')
      .insert([{
        reported_by: req.user?.id || null,
        product_name: productName,
        fssai_number: fssaiNumber || '',
        note: note || '',
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ message: 'Report submitted successfully', report });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/report (admin only implementation)
exports.getAllReports = async (req, res) => {
  try {
    const { data: reports, error } = await supabase
      .from('reports')
      .select('*, users(name, email)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
