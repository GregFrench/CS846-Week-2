const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');
const { logger } = require('../logger');

const router = express.Router();

const MAX_POST_LENGTH = 280;
const MAX_REPLY_LENGTH = 280;

// Get feed (all posts chronologically)
router.get('/feed', (req, res) => {
  db.all(
    `SELECT p.id, p.user_id, p.content, p.created_at, u.username,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
            (SELECT COUNT(*) FROM replies WHERE post_id = p.id) as replies_count
     FROM posts p
     JOIN users u ON p.user_id = u.id
     ORDER BY p.created_at DESC
     LIMIT 50`,
    [],
    (err, posts) => {
      if (err) {
        logger.error('Failed to fetch feed', err.message);
        return res.status(500).json({ error: 'Failed to fetch feed' });
      }
      logger.debug(`Feed fetched: ${posts ? posts.length : 0} posts`);
      res.json(posts);
    }
  );
});

// Create a post
router.post('/', authenticateToken, (req, res) => {
  const { content } = req.body;

  if (!content || content.trim().length === 0) {
    logger.warn(`Empty post attempted by user ${req.user.id}`);
    return res.status(400).json({ error: 'Post content cannot be empty' });
  }

  if (content.length > MAX_POST_LENGTH) {
    logger.warn(`Post too long (${content.length} chars) by user ${req.user.id}`);
    return res.status(400).json({ error: `Post must be ${MAX_POST_LENGTH} characters or less` });
  }

  db.run(
    'INSERT INTO posts (user_id, content) VALUES (?, ?)',
    [req.user.id, content],
    function (err) {
      if (err) {
        logger.error(`Failed to create post for user ${req.user.id}`, err.message);
        return res.status(500).json({ error: 'Failed to create post' });
      }
      logger.info(`✓ Post created by user ${req.user.id} (ID: ${this.lastID})`);
      res.status(201).json({ id: this.lastID, user_id: req.user.id, content, created_at: new Date() });
    }
  );
});

// Get post with replies
router.get('/:postId', (req, res) => {
  db.get(
    `SELECT p.id, p.user_id, p.content, p.created_at, u.username,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.id = ?`,
    [req.params.postId],
    (err, post) => {
      if (err || !post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // Get replies
      db.all(
        `SELECT r.id, r.user_id, r.content, r.created_at, u.username
         FROM replies r
         JOIN users u ON r.user_id = u.id
         WHERE r.post_id = ?
         ORDER BY r.created_at ASC`,
        [req.params.postId],
        (err, replies) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to fetch replies' });
          }
          res.json({ ...post, replies });
        }
      );
    }
  );
});

// Like a post
router.post('/:postId/like', authenticateToken, (req, res) => {
  db.run(
    'INSERT INTO likes (post_id, user_id) VALUES (?, ?)',
    [req.params.postId, req.user.id],
    function (err) {
      if (err) {
        return res.status(400).json({ error: 'Already liked or invalid post' });
      }
      res.status(201).json({ message: 'Post liked' });
    }
  );
});

// Unlike a post
router.delete('/:postId/like', authenticateToken, (req, res) => {
  db.run(
    'DELETE FROM likes WHERE post_id = ? AND user_id = ?',
    [req.params.postId, req.user.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to unlike post' });
      }
      res.json({ message: 'Post unliked' });
    }
  );
});

// Reply to a post
router.post('/:postId/reply', authenticateToken, (req, res) => {
  const { content } = req.body;

  if (!content || content.trim().length === 0) {
    return res.status(400).json({ error: 'Reply content cannot be empty' });
  }

  if (content.length > MAX_REPLY_LENGTH) {
    return res.status(400).json({ error: `Reply must be ${MAX_REPLY_LENGTH} characters or less` });
  }

  db.run(
    'INSERT INTO replies (post_id, user_id, content) VALUES (?, ?, ?)',
    [req.params.postId, req.user.id, content],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create reply' });
      }
      res.status(201).json({
        id: this.lastID,
        post_id: req.params.postId,
        user_id: req.user.id,
        content,
        created_at: new Date()
      });
    }
  );
});

module.exports = router;
