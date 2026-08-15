const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Constants
const ACCESS_CODE = "THS2026";
const TELEGRAM_LINK = "https://t.me/+yDXeTcUr6k1jYzlk";
const MAX_ATTEMPTS = 3;

// In-memory store for attempt tracking (use Redis in production)
const attemptTracker = {};

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Validate access code
app.post('/api/validate', (req, res) => {
  const { code, sessionId } = req.body;
  
  if (!sessionId) {
    return res.status(400).json({ success: false, error: 'No session ID' });
  }

  // Check attempts
  if (!attemptTracker[sessionId]) {
    attemptTracker[sessionId] = { attempts: 0, locked: false };
  }

  const session = attemptTracker[sessionId];

  // Check if already locked out
  if (session.locked) {
    return res.status(403).json({ 
      success: false, 
      error: 'Account locked. Too many attempts.',
      locked: true
    });
  }

  // Validate code
  if (code === ACCESS_CODE) {
    return res.json({ 
      success: true, 
      redirect: TELEGRAM_LINK,
      message: 'Access granted! Redirecting to Telegram...'
    });
  } else {
    // Increment attempts
    session.attempts += 1;
    const remaining = MAX_ATTEMPTS - session.attempts;

    if (session.attempts >= MAX_ATTEMPTS) {
      session.locked = true;
      return res.status(401).json({ 
        success: false, 
        error: 'Incorrect code. Account locked.',
        locked: true,
        attempts: session.attempts
      });
    }

    return res.status(401).json({ 
      success: false, 
      error: `Incorrect access code. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`,
      attempts: session.attempts,
      remaining: remaining
    });
  }
});

// Get session attempts
app.get('/api/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const session = attemptTracker[sessionId] || { attempts: 0, locked: false };
  
  res.json({
    attempts: session.attempts,
    remaining: MAX_ATTEMPTS - session.attempts,
    locked: session.locked
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'online' });
});

app.listen(PORT, () => {
  console.log(`🔐 THS Private Access Server running on port ${PORT}`);
  console.log(`📱 Access code: ${ACCESS_CODE}`);
  console.log(`🔗 Telegram link: ${TELEGRAM_LINK}`);
});
