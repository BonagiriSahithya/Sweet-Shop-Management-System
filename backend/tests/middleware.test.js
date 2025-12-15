const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');
const User = require('../models/User');

let adminToken, userToken;

beforeEach(async () => {
  const adminRes = await request(app).post('/api/auth/signup')
    .send({ name: 'Admin', email: 'admin@test.com', password: 'admin123', role: 'admin' });
  adminToken = adminRes.body.token;

  const userRes = await request(app).post('/api/auth/signup')
    .send({ name: 'User', email: 'user@test.com', password: '123456' });
  userToken = userRes.body.token;
});

describe('Middleware – protect', () => {
  it('rejects request without token', async () => {
    const res = await request(app).get('/api/sweets');
    expect(res.statusCode).toBe(401);
  });

  it('rejects invalid token', async () => {
    const res = await request(app).get('/api/sweets')
      .set('Authorization', 'Bearer invalid');
    expect(res.statusCode).toBe(401);
  });

  it('rejects token for deleted user', async () => {
    const temp = await User.create({ name: 'Temp', email: 'temp@test.com', password: '123456' });
    const token = jwt.sign({ id: temp._id }, process.env.JWT_SECRET);
    await User.findByIdAndDelete(temp._id);

    const res = await request(app).get('/api/sweets')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(401);
  });
});

describe('Middleware – admin', () => {
  it('allows admin', async () => {
    const res = await request(app).post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'AdminSweet', category: 'Test', price: 10, quantity: 1 });
    expect(res.statusCode).toBe(201);
  });

  it('rejects non-admin', async () => {
    const res = await request(app).post('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'UserSweet', category: 'Test', price: 10, quantity: 1 });
    expect(res.statusCode).toBe(403);
  });
});

