import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from '../router/auth.route.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

// Mock dependencies
jest.mock('../models/user.model.js');
jest.mock('../libs/generateToken.js', () => ({
  generateToken: jest.fn((id, res) => {
    res.cookie('token', 'mock-jwt-token');
  })
}));

// Create test app
const app = express();
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET || 'test-secret'));
app.use('/api/auth', authRoutes);

describe('Auth Routes Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============ SIGNUP TESTS ============
  describe('POST /api/auth/signup', () => {
    
    it('should successfully register a new user', async () => {
      const newUser = {
        _id: '507f1f77bcf86cd799439011',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedpassword123',
        role: 'user',
        save: jest.fn().mockResolvedValue(null)
      };

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(newUser);

      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          role: 'user'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe('John Doe');
      expect(response.body.email).toBe('john@example.com');
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'John Doe',
          email: 'invalid-email',
          password: 'password123',
          role: 'user'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid email format');
    });

    it('should return 400 if email already exists', async () => {
      const existingUser = {
        email: 'john@example.com',
        name: 'Existing User'
      };

      User.findOne.mockResolvedValue(existingUser);

      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          role: 'user'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('already taken');
    });

    it('should return 400 for password less than 6 characters', async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: '12345',
          role: 'user'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('at least 6 characters');
    });
  });

  // ============ LOGIN TESTS ============
  describe('POST /api/auth/login', () => {
    
    it('should successfully login with correct credentials', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = {
        _id: '507f1f77bcf86cd799439011',
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'user'
      };

      User.findOne.mockResolvedValue(user);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.email).toBe('john@example.com');
    });

    it('should return 404 if user not found', async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('User not found');
    });

    it('should return 400 for incorrect password', async () => {
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      const user = {
        _id: '507f1f77bcf86cd799439011',
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'user'
      };

      User.findOne.mockResolvedValue(user);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid credentials');
    });
  });

  // ============ LOGOUT TESTS ============
  describe('POST /api/auth/logout', () => {
    
    it('should successfully logout user', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('Logged out successfully');
    });
  });
});
