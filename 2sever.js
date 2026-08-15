const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MAX_ATTEMPTS = 3;

// Temporary memory storage.
// This may reset between Vercel function invocations.
const attemptTracker = new Map();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Validate access code
app.post('/api/validate', (req, res) => {
  const ACCESS_CODE = process.env.ACCESS_CODE;
  const TELEGRAM_LINK = process.env.TELEGRAM_LINK;

  if (!ACCESS_CODE || !TELEGRAM_LINK) {
    console.error('Required environment variables are missing.');

    return res.status(500).json({
      success: false,
      error: 'Server configuration error.'
    });
  }

  const { code, sessionId } = req.body || {};

  if (!sessionId) {
    return res.status(400).json({
      success: false,
      error: 'No session ID'
    });
  }

  if (!attemptTracker.has(sessionId)) {
    attemptTracker.set(sessionId, {
      attempts: 0,
      locked: false
    });
  }

  const session = attemptTracker.get(sessionId);

  if (session.locked) {
    return res.status(403).json({
      success: false,
      error: 'Access locked. Too many attempts.',
      locked: true
    });
  }

  if (code === ACCESS_CODE) {
    attemptTracker.delete(sessionId);

    return res.json({
      success: true,
      redirect: TELEGRAM_LINK,
      message: 'Access granted! Redirecting to Telegram...'
    });
  }

  session.attempts += 1;
  const remaining = MAX_ATTEMPTS - session.attempts;

  if (session.attempts >= MAX_ATTEMPTS) {
    session.locked = true;

    return res.status(401).json({
      success: false,
      error: 'Incorrect code. Access locked.',
      locked: true,
      attempts: session.attempts
    });
  }

  return res.status(401).json({
    success: false,
    error: `Incorrect access code. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`,
    attempts: session.attempts,
    remaining
  });
});

// Get attempt information
app.get('/api/session/:sessionId', (req, res) => {
  const session = attemptTracker.get(req.params.sessionId) || {
    attempts: 0,
    locked: false
  };

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

// Only start a normal server when running locally
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`THS server running on port ${PORT}`);
  });
}

// Export the application for Vercel
module.exports = app;
