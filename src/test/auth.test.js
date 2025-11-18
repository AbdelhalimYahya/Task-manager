import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Set JWT_SECRET before importing anything
process.env.JWT_SECRET = 'test-secret-key';

let mongoServer;

// Start MongoDB Memory Server before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// Disconnect after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear collections after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

// Import after mongoose setup
import authRoutes from '../router/auth.route.js';
import User from '../models/user.model.js';

// Create test app
const app = express();
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET || 'test-secret'));
app.use('/api/auth', authRoutes);

describe('Auth Routes Tests with Real Database', () => {
  
  // ============ SIGNUP TESTS ============
  describe('POST /api/auth/signup', () => {
    
    it('should successfully register a new user', async () => {
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
      expect(response.body.role).toBe('user');
      
      // Verify user was saved to database
      const savedUser = await User.findOne({ email: 'john@example.com' });
      expect(savedUser).toBeDefined();
      expect(savedUser.name).toBe('John Doe');
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
      // First, create a user
      await User.create({
        name: 'Existing User',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'user'
      });

      // Try to create user with same email
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
      // Create a test user
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'user'
      });

      // Login with correct credentials
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.email).toBe('john@example.com');
      expect(response.body.name).toBe('John Doe');
      expect(response.body.role).toBe('user');
    });

    it('should return 404 if user not found', async () => {
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
      // Create a test user
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'user'
      });

      // Try to login with wrong password
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
