const request = require('supertest');
const app = require('../server');

let adminToken;

beforeEach(async () => {
  const res = await request(app).post('/api/auth/signup')
    .send({ name: 'Admin', email: 'admin@test.com', password: 'admin123', role: 'admin' });
  adminToken = res.body.token;
});

describe('Sweet API', () => {

  it('admin can add sweet', async () => {
    const res = await request(app).post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Ladoo', category: 'Indian', price: 20, quantity: 10 });
    expect(res.statusCode).toBe(201);
  });

  it('user cannot add sweet', async () => {
    const user = await request(app).post('/api/auth/signup')
      .send({ name: 'User', email: 'user@test.com', password: '123456' });

    const res = await request(app).post('/api/sweets')
      .set('Authorization', `Bearer ${user.body.token}`)
      .send({ name: 'Barfi', category: 'Indian', price: 10, quantity: 5 });
    expect(res.statusCode).toBe(403);
  });

  it('admin can update, delete, restock sweet', async () => {
    const sweet = await request(app).post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Peda', category: 'Indian', price: 10, quantity: 5 });

    const resUpdate = await request(app).put(`/api/sweets/${sweet.body._id}`)
      .set('Authorization', `Bearer ${adminToken}`).send({ price: 15 });
    expect(resUpdate.statusCode).toBe(200);

    const resRestock = await request(app).put(`/api/sweets/restock/${sweet.body._id}`)
      .set('Authorization', `Bearer ${adminToken}`).send({ quantity: 5 });
    expect(resRestock.body.sweet.quantity).toBe(10);

    const resDelete = await request(app).delete(`/api/sweets/${sweet.body._id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(resDelete.statusCode).toBe(200);
  });

  it('user can purchase sweet', async () => {
    const sweet = await request(app).post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Rasgulla', category: 'Indian', price: 10, quantity: 2 });

    const user = await request(app).post('/api/auth/signup')
      .send({ name: 'Buyer', email: 'buyer@test.com', password: '123456' });

    const res = await request(app).put(`/api/sweets/purchase/${sweet.body._id}`)
      .set('Authorization', `Bearer ${user.body.token}`);
    expect(res.body.sweet.quantity).toBe(1);
  });

  it('blocks purchase when out of stock', async () => {
    const sweet = await request(app).post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Soan Papdi', category: 'Indian', price: 10, quantity: 0 });

    const user = await request(app).post('/api/auth/signup')
      .send({ name: 'Buyer2', email: 'buyer2@test.com', password: '123456' });

    const res = await request(app).put(`/api/sweets/purchase/${sweet.body._id}`)
      .set('Authorization', `Bearer ${user.body.token}`);
    expect(res.statusCode).toBe(400);
  });

  it('search sweets works', async () => {
    await request(app).post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Jalebi', category: 'Indian', price: 10, quantity: 5 });

    const res = await request(app).get('/api/sweets/search')
      .set('Authorization', `Bearer ${adminToken}`).query({ name: 'jalebi' });
    expect(res.body.length).toBe(1);
  });

  it('update/delete sweet by another user is forbidden', async () => {
    const sweet = await request(app).post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test', category: 'C', price: 10, quantity: 1 });

    const user = await request(app).post('/api/auth/signup')
      .send({ name: 'User', email: 'user2@test.com', password: '123456' });

    const resUpdate = await request(app).put(`/api/sweets/${sweet.body._id}`)
      .set('Authorization', `Bearer ${user.body.token}`).send({ price: 20 });
    expect(resUpdate.statusCode).toBe(403);

    const resDelete = await request(app).delete(`/api/sweets/${sweet.body._id}`)
      .set('Authorization', `Bearer ${user.body.token}`);
    expect(resDelete.statusCode).toBe(403);
  });

  it('handles DB error gracefully', async () => {
    jest.spyOn(require('../models/Sweet'), 'find').mockImplementation(() => { throw new Error('DB error'); });
    const res = await request(app).get('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(500);
  });

  it('restock with invalid quantity fails', async () => {
    const sweet = await request(app).post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Kaju Katli', category: 'Indian', price: 25, quantity: 5 });

    const res = await request(app).put(`/api/sweets/restock/${sweet.body._id}`)
      .set('Authorization', `Bearer ${adminToken}`).send({ quantity: -5 });
    expect(res.statusCode).toBe(400);
  });

  it('update/delete non-existing sweet returns 404', async () => {
    const resUpdate = await request(app).put('/api/sweets/507f1f77bcf86cd799439011')
      .set('Authorization', `Bearer ${adminToken}`).send({ price: 50 });
    expect(resUpdate.statusCode).toBe(404);

    const resDelete = await request(app).delete('/api/sweets/507f1f77bcf86cd799439011')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(resDelete.statusCode).toBe(404);
  });

  it('purchase non-existing sweet returns 404', async () => {
    const user = await request(app).post('/api/auth/signup')
      .send({ name: 'Buyer', email: 'buyer@test.com', password: '123456' });

    const res = await request(app).put('/api/sweets/purchase/507f1f77bcf86cd799439011')
      .set('Authorization', `Bearer ${user.body.token}`);
    expect(res.statusCode).toBe(404);
  });
});

