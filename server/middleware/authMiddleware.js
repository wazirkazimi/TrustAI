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
    
    // Mock fallback if using dummy Supabase URL or if we are offline
    const isMockUrl = process.env.SUPABASE_URL && process.env.SUPABASE_URL.includes('placeholder-supabase-url');

    if (isMockUrl) {
      req.user = {
        id: decoded.id,
        name: 'Demo User',
        email: 'demo@example.com',
        healthMode: 'default',
        vegFilter: false
      };
      return next();
    }

    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('id, name, email, health_mode, veg_filter')
        .eq('id', decoded.id)
        .single();

      if (error || !user) {
        // If it is a network/fetch connection issue, fall back to mock user
        if (error && (error.message?.includes('fetch failed') || error.code === 'ENOTFOUND' || error.message?.includes('getaddrinfo'))) {
          console.warn('⚠️ Supabase connection failed in AuthMiddleware, falling back to mock user:', error.message);
          req.user = {
            id: decoded.id,
            name: 'Demo User',
            email: 'demo@example.com',
            healthMode: 'default',
            vegFilter: false
          };
          return next();
        }
        console.error('AuthMiddleware: User not found or DB error:', error);
        return res.status(401).json({ message: 'User not found' });
      }
      
      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        healthMode: user.health_mode,
        vegFilter: user.veg_filter
      };
      
      next();
    } catch (dbErr) {
      if (dbErr.message?.includes('fetch failed') || dbErr.code === 'ENOTFOUND' || dbErr.message?.includes('getaddrinfo')) {
        console.warn('⚠️ Supabase fetch error in AuthMiddleware, falling back to mock user:', dbErr.message);
        req.user = {
          id: decoded.id,
          name: 'Demo User',
          email: 'demo@example.com',
          healthMode: 'default',
          vegFilter: false
        };
        return next();
      }
      throw dbErr;
    }
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
      
      const isMockUrl = process.env.SUPABASE_URL && process.env.SUPABASE_URL.includes('placeholder-supabase-url');

      if (isMockUrl) {
        req.user = {
          id: decoded.id,
          name: 'Demo User',
          email: 'demo@example.com',
          healthMode: 'default',
          vegFilter: false
        };
        return next();
      }

      try {
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
      } catch (dbErr) {
        if (dbErr.message?.includes('fetch failed') || dbErr.code === 'ENOTFOUND' || dbErr.message?.includes('getaddrinfo')) {
          req.user = {
            id: decoded.id,
            name: 'Demo User',
            email: 'demo@example.com',
            healthMode: 'default',
            vegFilter: false
          };
        }
      }
    } catch (_) {}
  }
  next();
};

module.exports = { protect, optionalAuth };

