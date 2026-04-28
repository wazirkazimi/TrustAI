const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, health_mode, veg_filter')
      .eq('id', decoded.id)
      .single();

    if (error || !user) {
      console.error('AuthMiddleware: User not found or DB error:', error);
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Rename fields to match frontend expectations if necessary
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      healthMode: user.health_mode,
      vegFilter: user.veg_filter
    };
    
    next();
  } catch (err) {
    console.error('AuthMiddleware: JWT Error:', err.message);
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};

const optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { data: user } = await supabase
        .from('users')
        .select('id, name, email, health_mode, veg_filter')
        .eq('id', decoded.id)
        .single();
      
      if (user) {
        req.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          healthMode: user.health_mode,
          vegFilter: user.veg_filter
        };
      }
    } catch (_) {}
  }
  next();
};

module.exports = { protect, optionalAuth };
