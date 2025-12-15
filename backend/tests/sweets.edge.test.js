const request = require('supertest');
const app = require('../server');

let adminToken;

beforeEach(async () => {
  const res = await request(app).post('/api/auth/signup')
    .send({ name: 'Admin', email: 'admin@test.com', password: 'admin123', role: 'admin' });
  adminToken = res.body.token;
});

describe('Sweet API – Edge Cases', () => {

  it('returns 404 when updating non-existing sweet', async () => {
    const res = await request(app).put('/api/sweets/507f1f77bcf86cd799439011')
      .set('Authorization', `Bearer ${adminToken}`).send({ price: 50 });
    expect(res.statusCode).toBe(404);
  });

  it('returns 404 when deleting non-existing sweet', async () => {
    const res = await request(app).delete('/api/sweets/507f1f77bcf86cd799439011')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404);
  });

  it('returns 400 when restocking with invalid quantity', async () => {
    const sweet = await request(app).post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Kaju Katli', category: 'Indian', price: 25, quantity: 5 });

    const res = await request(app).put(`/api/sweets/restock/${sweet.body._id}`)
      .set('Authorization', `Bearer ${adminToken}`).send({ quantity: -5 });
    expect(res.statusCode).toBe(400);
  });

  it('returns 404 when purchasing non-existing sweet', async () => {
    const user = await request(app).post('/api/auth/signup')
      .send({ name: 'Buyer', email: 'buyer@test.com', password: '123456' });

    const res = await request(app).put('/api/sweets/purchase/507f1f77bcf86cd799439011')
      .set('Authorization', `Bearer ${user.body.token}`);
    expect(res.statusCode).toBe(404);
  });
});
