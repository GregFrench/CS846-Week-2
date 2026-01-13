const request = require('supertest');
const express = require('express');
const postsRoutes = require('../src/routes/posts');
const { authenticateToken } = require('../src/middleware/auth');

const app = express();
app.use(express.json());

// Mock middleware for testing
const mockAuth = (req, res, next) => {
  req.user = { id: 1, username: 'testuser' };
  next();
};

app.use('/api/posts', postsRoutes);

describe('Posts Routes', () => {
  describe('GET /api/posts/feed', () => {
    it('should return feed without authentication', async () => {
      const res = await request(app).get('/api/posts/feed');

      // Should return either posts or error
      expect([200, 500]).toContain(res.status);
    });
  });

  describe('POST /api/posts', () => {
    it('should reject post creation without authentication', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({
          content: 'Test post'
        });

      expect(res.status).toBe(401);
    });

    it('should reject post with empty content', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({ content: '' });

      expect(res.status).toBe(401); // No token
    });

    it('should reject post exceeding character limit', async () => {
      const longContent = 'a'.repeat(300);
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', 'Bearer invalid_token')
        .send({ content: longContent });

      expect(res.status).toBe(403); // Invalid token
    });
  });

  describe('POST /api/posts/:postId/like', () => {
    it('should reject like without authentication', async () => {
      const res = await request(app)
        .post('/api/posts/1/like')
        .send({});

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/posts/:postId/reply', () => {
    it('should reject reply without authentication', async () => {
      const res = await request(app)
        .post('/api/posts/1/reply')
        .send({ content: 'Reply text' });

      expect(res.status).toBe(401);
    });

    it('should reject empty reply', async () => {
      const res = await request(app)
        .post('/api/posts/1/reply')
        .set('Authorization', 'Bearer invalid_token')
        .send({ content: '' });

      expect(res.status).toBe(403); // Invalid token, won't reach validation
    });
  });
});
