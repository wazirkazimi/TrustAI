const User = require('../models/User');
const Scan = require('../models/Scan');

// PUT /api/user/mode
exports.updateHealthMode = async (req, res) => {
  try {
    const { healthMode } = req.body;
    const validModes = ['default', 'weightLoss', 'diabetic', 'gym'];
    if (!validModes.includes(healthMode))
      return res.status(400).json({ message: 'Invalid health mode' });

    const user = await User.findByIdAndUpdate(
      req.user._id, { healthMode }, { new: true, select: '-password' }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/user/veg
exports.updateVegPreference = async (req, res) => {
  try {
    const { vegFilter } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id, { vegFilter: Boolean(vegFilter) }, { new: true, select: '-password' }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/user/bookmarks
exports.getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('bookmarks');
    res.json(user.bookmarks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/user/bookmark/:scanId
exports.bookmarkScan = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const scanId = req.params.scanId;

    const idx = user.bookmarks.indexOf(scanId);
    if (idx > -1) {
      user.bookmarks.splice(idx, 1); // un-bookmark
    } else {
      user.bookmarks.push(scanId);   // bookmark
    }

    await user.save();
    res.json({ bookmarks: user.bookmarks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
