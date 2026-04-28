const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, age, goal, gradingSystem, isVegan } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser)
      return res.status(400).json({ message: 'Email already registered' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert([
        { 
          name, 
          email: email.toLowerCase(), 
          password: hashedPassword,
          age: parseInt(age) || null,
          goal: goal || 'Balanced',
          grading_system: gradingSystem || 'FoodTrust (AI)',
          veg_filter: isVegan === 'Yes'
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      healthMode: user.health_mode,
      vegFilter: user.veg_filter,
      token: generateToken(user.id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user)
      return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      healthMode: user.health_mode,
      vegFilter: user.veg_filter,
      token: generateToken(user.id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, health_mode, veg_filter')
      .eq('id', req.user.id)
      .single();

    if (error || !user) return res.status(404).json({ message: 'User not found' });

    // Get bookmark count
    const { count: bookmarksCount } = await supabase
      .from('bookmarks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id);
    
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      healthMode: user.health_mode,
      vegFilter: user.veg_filter,
      bookmarksCount: bookmarksCount || 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
