const supabase = require('../config/supabase');

const isNetworkError = (err) => {
  return err && (
    err.message?.includes('fetch failed') || 
    err.code === 'ENOTFOUND' || 
    err.message?.includes('getaddrinfo') || 
    err.message?.includes('connection')
  );
};

// In-memory store for reports
const mockReports = [];

// POST /api/report
exports.createReport = async (req, res) => {
  try {
    const { productName, fssaiNumber, note } = req.body;
    if (!productName) return res.status(400).json({ message: 'Product name is required' });

    const isMock = (process.env.SUPABASE_URL && process.env.SUPABASE_URL.includes('placeholder-supabase-url'));

    if (isMock) {
      const mockReport = {
        id: require('crypto').randomUUID(),
        reported_by: req.user?.id || 'mock-uuid-1234',
        product_name: productName,
        fssai_number: fssaiNumber || '',
        note: note || '',
        created_at: new Date().toISOString()
      };
      mockReports.push(mockReport);
      return res.status(201).json({ message: 'Report submitted successfully', report: mockReport });
    }

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
    if (isNetworkError(err)) {
      console.warn('⚠️ Supabase createReport connection error, saving to mock store');
      const mockReport = {
        id: require('crypto').randomUUID(),
        reported_by: req.user?.id || 'mock-uuid-1234',
        product_name: req.body.productName,
        fssai_number: req.body.fssaiNumber || '',
        note: req.body.note || '',
        created_at: new Date().toISOString()
      };
      mockReports.push(mockReport);
      return res.status(201).json({ message: 'Report submitted successfully', report: mockReport });
    }
    res.status(500).json({ message: err.message });
  }
};

// GET /api/report (admin only implementation)
exports.getAllReports = async (req, res) => {
  try {
    const isMock = (process.env.SUPABASE_URL && process.env.SUPABASE_URL.includes('placeholder-supabase-url'));

    if (isMock) {
      return res.json(mockReports);
    }

    const { data: reports, error } = await supabase
      .from('reports')
      .select('*, users(name, email)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(reports);
  } catch (err) {
    if (isNetworkError(err)) {
      console.warn('⚠️ Supabase getAllReports connection error, returning mock store reports');
      return res.json(mockReports);
    }
    res.status(500).json({ message: err.message });
  }
};

