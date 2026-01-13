const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { SECRET_KEY } = require('../middleware/auth');
const { logger } = require('../logger');

const router = express.Router();

// Register
router.post('/register', (req, res) => {
  const { username, email, password, bio } = req.body;

  if (!username || !email || !password) {
    logger.warn(`Registration attempt with missing fields: ${username || 'no-username'}`);
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    'INSERT INTO users (username, email, password, bio) VALUES (?, ?, ?, ?)',
    [username, email, hashedPassword, bio || ''],
    function (err) {
      if (err) {
        logger.warn(`Registration failed for username: ${username} - User already exists`);
        return res.status(400).json({ error: 'User already exists' });
      }
      logger.info(`✓ User registered: ${username}`);
      const token = jwt.sign({ id: this.lastID, username }, SECRET_KEY, { expiresIn: '7d' });
      res.status(201).json({ token, user: { id: this.lastID, username, email } });
    }
  );
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    logger.warn('Login attempt with missing fields');
    return res.status(400).json({ error: 'Missing username or password' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user) {
      logger.warn(`Login failed for username: ${username} - User not found`);
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      logger.warn(`Login failed for username: ${username} - Invalid password`);
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    logger.info(`✓ User logged in: ${username}`);
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, bio: user.bio } });
  });
});

module.exports = router;
