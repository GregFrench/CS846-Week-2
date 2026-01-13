const request = require('supertest');
const express = require('express');
const authRoutes = require('../src/routes/auth');

// Setup Express app with proper middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  describe('POST /api/auth/register', () => {
    it('should return error on duplicate username', async () => {
      // First registration
      const res1 = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser123',
          email: 'test123@example.com',
          password: 'password123',
          bio: 'Test bio'
        });

      // Second registration with same username should fail
      const res2 = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser123',
          email: 'test456@example.com',
          password: 'password123',
          bio: 'Test bio'
        });

      expect(res2.status).toBe(400);
      expect(res2.body).toHaveProperty('error');
    });

    it('should reject registration with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject registration with missing password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should reject login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent_user_12345',
          password: 'password'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject login with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject login with missing username', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });
});
