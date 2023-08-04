import User from '../dist/models/user.js'
import app from '../dist/app';
import supertest from 'supertest';
import mongoose from 'mongoose';
import config from '../dist/utils/config';

const api = supertest(app);

beforeEach(async () =>
  await User.deleteMany({}));

test('a user can be created and can make an authenticated request', async () => {
  const newUser = {
    username: "Jeremy",
    email: "jlin@student.unc.edu",
    password: "Password123"
  };
  const response = await api
    .post('/api/users')
    .set({ Authorization: `bearer ${config.ADMIN_KEY}` })
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  const token = response.body.token;
  await api
    .get('/api/test')
    .set({ Authorization: `bearer ${token}` })
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

afterAll(async () => {
  await mongoose.connection.close();
});
