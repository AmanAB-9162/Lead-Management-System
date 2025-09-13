const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const leadRoutes = require('./routes/leads');

// Connect to database
connectDB();

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});

// Middleware
app.use(limiter);
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Simple test page
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Lead Management API</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
          .endpoint { background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 5px; }
          .protected { color: #ff6b6b; }
          .public { color: #51cf66; }
          .test-section { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0; }
          code { background: #f8f9fa; padding: 2px 5px; border-radius: 3px; }
        </style>
      </head>
      <body>
        <h1>🎉 Lead Management System API is Live!</h1>
        <p>Backend is running successfully on Render</p>
        
        <h2>Available Endpoints:</h2>
        
        <div class="endpoint">
          <strong class="protected">🔒 GET /api/auth/me</strong> - Get current user (Protected)
        </div>
        
        <div class="endpoint">
          <strong class="protected">🔒 GET /api/leads</strong> - Get all leads (Protected)
        </div>
        
        <div class="endpoint">
          <strong class="public">🔓 POST /api/auth/login</strong> - Login user (Public)
        </div>
        
        <div class="endpoint">
          <strong class="public">🔓 POST /api/auth/register</strong> - Register user (Public)
        </div>
        
        <div class="endpoint">
          <strong class="public">🔓 GET /api/health</strong> - <a href="/api/health">Health Check</a> (Public)
        </div>
        
        <div class="endpoint">
          <strong class="public">🔓 GET /api/test</strong> - <a href="/api/test">Test Endpoint</a> (Public)
        </div>
        
        <div class="test-section">
          <h3>🧪 How to Test Protected Endpoints:</h3>
          <p><strong>Note:</strong> Protected endpoints (🔒) require authentication token.</p>
          
          <h4>Method 1: Use Frontend Application</h4>
          <p>1. Start frontend: <code>cd frontend && npm run dev</code></p>
          <p>2. Login with: <code>test@example.com</code> / <code>password123</code></p>
          
          <h4>Method 2: Test with API Client</h4>
          <p>1. First login: <code>POST /api/auth/login</code> with credentials</p>
          <p>2. Use returned token: <code>Authorization: Bearer YOUR_TOKEN</code></p>
          
          <h4>Method 3: Test Public Endpoint</h4>
          <p>Click on <a href="/api/health">Health Check</a> to verify API is working</p>
        </div>
        
        <p><strong>Status:</strong> ✅ Online</p>
        <p><em>Protected endpoints will return 401 Unauthorized when accessed directly - this is expected behavior!</em></p>
      </body>
    </html>
  `);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Lead Management System API is running',
    timestamp: new Date().toISOString()
  });
});

// Public test endpoint - no authentication required
app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is working! This is a public endpoint.',
    data: {
      server: 'Lead Management System',
      status: 'Online',
      timestamp: new Date().toISOString(),
      endpoints: {
        public: ['/api/auth/login', '/api/auth/register', '/api/health', '/api/test'],
        protected: ['/api/auth/me', '/api/leads']
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
