const User = require('../models/User');

describe('User Model – password not modified', () => {
  it('does not rehash password if unchanged', async () => {
    const user = await User.create({
      name: 'Test',
      email: 'hash@test.com',
      password: '123456'
    });

    const originalHash = user.password;
    user.name = 'Updated';
    await user.save();

    expect(user.password).toBe(originalHash);
  });
});
