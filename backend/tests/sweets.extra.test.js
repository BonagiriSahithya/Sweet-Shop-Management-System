const request = require('supertest');
const app = require('../server');
const Sweet = require('../models/Sweet');

let adminToken, userToken;

beforeEach(async () => {
  adminToken = (await request(app).post('/api/auth/signup')
    .send({ name: 'Admin', email: 'adminx@test.com', password: '123', role: 'admin' })).body.token;

  userToken = (await request(app).post('/api/auth/signup')
    .send({ name: 'User', email: 'userx@test.com', password: '123' })).body.token;
});

describe('Sweet Controller – Remaining Branches', () => {

  it('addSweet missing fields', async () => {
    const res = await request(app).post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`).send({});
    expect(res.statusCode).toBe(400);
  });

  it('update forbidden for non-owner', async () => {
    const sweet = await request(app).post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'A', category: 'C', price: 1, quantity: 1 });

    const res = await request(app).put(`/api/sweets/${sweet.body._id}`)
      .set('Authorization', `Bearer ${userToken}`).send({ price: 2 });

    expect(res.statusCode).toBe(403);
  });

  it('delete forbidden for non-owner', async () => {
    const sweet = await request(app).post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'B', category: 'C', price: 1, quantity: 1 });

    const res = await request(app).delete(`/api/sweets/${sweet.body._id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  it('restock sweet not found', async () => {
    const res = await request(app).put('/api/sweets/restock/507f1f77bcf86cd799439011')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(404);
  });

  it('restock with quantity 0', async () => {
    const sweet = await request(app).post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'C', category: 'C', price: 1, quantity: 1 });

    const res = await request(app).put(`/api/sweets/restock/${sweet.body._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 0 });

    expect(res.statusCode).toBe(400);
  });

  it('search minPrice only', async () => {
    const res = await request(app).get('/api/sweets/search')
      .set('Authorization', `Bearer ${adminToken}`)
      .query({ minPrice: 5 });

    expect(res.statusCode).toBe(200);
  });

  it('search maxPrice only', async () => {
    const res = await request(app).get('/api/sweets/search')
      .set('Authorization', `Bearer ${adminToken}`)
      .query({ maxPrice: 10 });

    expect(res.statusCode).toBe(200);
  });

  it('purchase DB error branch', async () => {
    jest.spyOn(Sweet, 'findById').mockImplementation(() => {
      throw new Error('DB error');
    });

    const res = await request(app).put('/api/sweets/purchase/507f1f77bcf86cd799439011')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(500);
  });
});
