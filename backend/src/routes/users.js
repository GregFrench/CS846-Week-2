const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const MAX_POST_LENGTH = 280;

// Get user profile
router.get('/:userId', (req, res) => {
  db.get('SELECT id, username, bio, created_at FROM users WHERE id = ?', [req.params.userId], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's posts
    db.all(
      'SELECT id, content, created_at FROM posts WHERE user_id = ? ORDER BY created_at DESC',
      [req.params.userId],
      (err, posts) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to fetch posts' });
        }
        res.json({ user, posts });
      }
    );
  });
});

// Update user profile
router.put('/:userId', authenticateToken, (req, res) => {
  if (req.user.id != req.params.userId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const { bio } = req.body;
  db.run('UPDATE users SET bio = ? WHERE id = ?', [bio || '', req.params.userId], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to update profile' });
    }
    res.json({ message: 'Profile updated' });
  });
});

module.exports = router;
