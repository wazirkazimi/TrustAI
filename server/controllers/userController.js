const supabase = require('../config/supabase');

const isNetworkError = (err) => {
  return err && (
    err.message?.includes('fetch failed') || 
    err.code === 'ENOTFOUND' || 
    err.message?.includes('getaddrinfo') || 
    err.message?.includes('connection')
  );
};

// PUT /api/user/mode
exports.updateHealthMode = async (req, res) => {
  try {
    const { healthMode } = req.body;
    const validModes = ['default', 'weightLoss', 'diabetic', 'gym'];
    if (!validModes.includes(healthMode))
      return res.status(400).json({ message: 'Invalid health mode' });

    if (process.env.SUPABASE_URL && process.env.SUPABASE_URL.includes('placeholder-supabase-url')) {
      return res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        healthMode: healthMode,
        vegFilter: req.user.vegFilter
      });
    }

    const { data: user, error } = await supabase
      .from('users')
      .update({ health_mode: healthMode })
      .eq('id', req.user.id)
      .select('id, name, email, health_mode, veg_filter')
      .single();

    if (error) throw error;
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      healthMode: user.health_mode,
      vegFilter: user.veg_filter
    });
  } catch (err) {
    if (isNetworkError(err)) {
      console.warn('⚠️ Supabase updateHealthMode connection error, returning mock response');
      return res.json({
        id: req.user?.id || 'mock-uuid-1234',
        name: req.user?.name || 'Demo User',
        email: req.user?.email || 'demo@example.com',
        healthMode: req.body.healthMode,
        vegFilter: req.user?.vegFilter || false
      });
    }
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/user/veg
exports.updateVegPreference = async (req, res) => {
  try {
    const { vegFilter } = req.body;

    if (process.env.SUPABASE_URL && process.env.SUPABASE_URL.includes('placeholder-supabase-url')) {
      return res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        healthMode: req.user.healthMode,
        vegFilter: Boolean(vegFilter)
      });
    }

    const { data: user, error } = await supabase
      .from('users')
      .update({ veg_filter: Boolean(vegFilter) })
      .eq('id', req.user.id)
      .select('id, name, email, health_mode, veg_filter')
      .single();

    if (error) throw error;
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      healthMode: user.health_mode,
      vegFilter: user.veg_filter
    });
  } catch (err) {
    if (isNetworkError(err)) {
      console.warn('⚠️ Supabase updateVegPreference connection error, returning mock response');
      return res.json({
        id: req.user?.id || 'mock-uuid-1234',
        name: req.user?.name || 'Demo User',
        email: req.user?.email || 'demo@example.com',
        healthMode: req.user?.healthMode || 'default',
        vegFilter: Boolean(vegFilter)
      });
    }
    res.status(500).json({ message: err.message });
  }
};

// GET /api/user/bookmarks
exports.getBookmarks = async (req, res) => {
  try {
    if (process.env.SUPABASE_URL && process.env.SUPABASE_URL.includes('placeholder-supabase-url')) {
      return res.json([]);
    }

    const { data: bookmarks, error } = await supabase
      .from('bookmarks')
      .select('*, scans(*)')
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json(bookmarks.map(b => b.scans));
  } catch (err) {
    if (isNetworkError(err)) {
      console.warn('⚠️ Supabase getBookmarks connection error, returning empty bookmarks');
      return res.json([]);
    }
    res.status(500).json({ message: err.message });
  }
};

// POST /api/user/bookmark/:scanId
exports.bookmarkScan = async (req, res) => {
  try {
    const scanId = req.params.scanId;

    if (process.env.SUPABASE_URL && process.env.SUPABASE_URL.includes('placeholder-supabase-url')) {
      return res.json({ message: 'Bookmarked' });
    }

    // Check if already bookmarked
    const { data: existing } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('scan_id', scanId)
      .single();

    if (existing) {
      await supabase
        .from('bookmarks')
        .delete()
        .eq('id', existing.id);
      res.json({ message: 'Un-bookmarked' });
    } else {
      await supabase
        .from('bookmarks')
        .insert([{ user_id: req.user.id, scan_id: scanId }]);
      res.json({ message: 'Bookmarked' });
    }
  } catch (err) {
    if (isNetworkError(err)) {
      console.warn('⚠️ Supabase bookmarkScan connection error, returning success message');
      return res.json({ message: 'Bookmarked (offline fallback)' });
    }
    res.status(500).json({ message: err.message });
  }
};

