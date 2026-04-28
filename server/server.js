const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

// ─── Middleware ─────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Rate limiting — stricter on scan endpoints to prevent abuse
const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
const scanLimiter   = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, message: { message: 'Too many scan requests, please try again later.' } });

app.use(globalLimiter);
app.use('/api/scan', scanLimiter);

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth',   require('./routes/auth'));
app.use('/api/scan',   require('./routes/scan'));
app.use('/api/search', require('./routes/search'));
app.use('/api/report', require('./routes/report'));
app.use('/api/user',   require('./routes/user'));

// Health check
// Health check with Supabase verification
app.get('/api/health', async (req, res) => {
  try {
    const supabase = require('./config/supabase');
    const { error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    
    if (error) throw error;
    
    res.json({ 
      status: 'ok', 
      database: 'connected',
      timestamp: new Date().toISOString() 
    });
  } catch (err) {
    res.status(503).json({ 
      status: 'error', 
      database: 'disconnected',
      message: err.message,
      timestamp: new Date().toISOString() 
    });
  }
});

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log('🚀 Connected to Supabase via Service Client');
});
