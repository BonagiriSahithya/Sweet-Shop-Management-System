const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Auth API', () => {
  it('should register a user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'User One', email: 'user@test.com', password: 'password123' });

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.role).toBe('user');
  });

  it('handles signup DB error', async () => {
    jest.spyOn(User, 'findOne').mockImplementation(() => {
      throw new Error('DB error');
    });

    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'X', email: 'x@test.com', password: '123' });

    expect(res.statusCode).toBe(500);
  });

  it('handles login DB error', async () => {
    jest.spyOn(User, 'findOne').mockImplementation(() => {
      throw new Error('DB error');
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'x@test.com', password: '123' });

    expect(res.statusCode).toBe(500);
  });

  it('should login user', async () => {
    await request(app).post('/api/auth/signup')
      .send({ name: 'User Two', email: 'login@test.com', password: 'password123' });

    const res = await request(app).post('/api/auth/login')
      .send({ email: 'login@test.com', password: 'password123' });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  // remaining tests unchanged
});
