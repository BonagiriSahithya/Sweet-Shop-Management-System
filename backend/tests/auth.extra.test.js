const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('Auth Controller – Remaining Branches', () => {

  it('fails signup with missing fields', async () => {
    const res = await request(app).post('/api/auth/signup').send({});
    expect(res.statusCode).toBe(400);
  });

  it('prevents second admin creation', async () => {
    await request(app).post('/api/auth/signup')
      .send({ name: 'Admin', email: 'admin1@test.com', password: '123', role: 'admin' });

    const res = await request(app).post('/api/auth/signup')
      .send({ name: 'Admin2', email: 'admin2@test.com', password: '123', role: 'admin' });

    expect(res.statusCode).toBe(400);
  });

  it('prevents duplicate user', async () => {
    await request(app).post('/api/auth/signup')
      .send({ name: 'User', email: 'dup@test.com', password: '123' });

    const res = await request(app).post('/api/auth/signup')
      .send({ name: 'User', email: 'dup@test.com', password: '123' });

    expect(res.statusCode).toBe(400);
  });

  it('login fails with missing fields', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.statusCode).toBe(400);
  });

  it('login fails with wrong password', async () => {
    await request(app).post('/api/auth/signup')
      .send({ name: 'User', email: 'wrong@test.com', password: '123456' });

    const res = await request(app).post('/api/auth/login')
      .send({ email: 'wrong@test.com', password: 'wrong' });

    expect(res.statusCode).toBe(401);
  });
});
