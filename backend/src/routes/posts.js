const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');
const { logger } = require('../logger');

const router = express.Router();

const MAX_POST_LENGTH = 280;
const MAX_REPLY_LENGTH = 280;

// Convert SQLite datetime string to ISO format
// SQLite stores UTC datetime in format "2026-01-13 18:29:18"
// We need to append Z to indicate UTC
function toISOString(sqliteDatetime) {
  if (!sqliteDatetime) return new Date().toISOString();
  // SQLite format: "2026-01-13 18:29:18" -> ISO: "2026-01-13T18:29:18.000Z"
  if (typeof sqliteDatetime === 'string' && !sqliteDatetime.includes('T')) {
    // Replace space with T and append .000Z for UTC
    return sqliteDatetime.replace(' ', 'T') + '.000Z';
  }
  return sqliteDatetime;
}

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
      // Convert all timestamps to ISO format
      const formattedPosts = posts.map(post => ({
        ...post,
        created_at: toISOString(post.created_at)
      }));
      logger.debug(`Feed fetched: ${posts ? posts.length : 0} posts`);
      res.json(formattedPosts);
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
      
      // Fetch the username to include in response
      db.get(
        'SELECT username FROM users WHERE id = ?',
        [req.user.id],
        (err, user) => {
          if (err || !user) {
            return res.status(500).json({ error: 'Failed to fetch user' });
          }
          res.status(201).json({
            id: this.lastID,
            user_id: req.user.id,
            username: user.username,
            content,
            created_at: new Date(),
            likes_count: 0,
            replies_count: 0
          });
        }
      );
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
          // Convert all timestamps to ISO format
          const formattedPost = {
            ...post,
            created_at: toISOString(post.created_at)
          };
          const formattedReplies = replies.map(reply => ({
            ...reply,
            created_at: toISOString(reply.created_at)
          }));
          res.json({ ...formattedPost, replies: formattedReplies });
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
      
      // Fetch the username to include in response
      db.get(
        'SELECT username FROM users WHERE id = ?',
        [req.user.id],
        (err, user) => {
          if (err || !user) {
            return res.status(500).json({ error: 'Failed to fetch user' });
          }
          res.status(201).json({
            id: this.lastID,
            post_id: req.params.postId,
            user_id: req.user.id,
            username: user.username,
            content,
            created_at: new Date()
          });
        }
      );
    }
  );
});

module.exports = router;
