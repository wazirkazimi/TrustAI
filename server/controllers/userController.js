const supabase = require('../config/supabase');

// PUT /api/user/mode
exports.updateHealthMode = async (req, res) => {
  try {
    const { healthMode } = req.body;
    const validModes = ['default', 'weightLoss', 'diabetic', 'gym'];
    if (!validModes.includes(healthMode))
      return res.status(400).json({ message: 'Invalid health mode' });

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
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/user/veg
exports.updateVegPreference = async (req, res) => {
  try {
    const { vegFilter } = req.body;
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
    res.status(500).json({ message: err.message });
  }
};

// GET /api/user/bookmarks
exports.getBookmarks = async (req, res) => {
  try {
    const { data: bookmarks, error } = await supabase
      .from('bookmarks')
      .select('*, scans(*)')
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json(bookmarks.map(b => b.scans));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/user/bookmark/:scanId
exports.bookmarkScan = async (req, res) => {
  try {
    const scanId = req.params.scanId;

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
    res.status(500).json({ message: err.message });
  }
};
