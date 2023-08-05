import User from '../dist/models/user.js'
import app from '../dist/app.js';
import supertest from 'supertest';
import mongoose from 'mongoose';
import config from '../dist/utils/config.js';
import axios from 'axios';
import { resolve } from 'node:path/posix';
const api = supertest(app);

const email = 'eding888_1632w@mailsac.com';

const conf = {
  headers:{
   'Mailsac-Key': config.MAILSAC_KEY
  }
};
//
await User.deleteMany({})
const newUser = {
  username: "Jeremy",
  email,
  password: "Password123"
};
let token;
test('a user can be created', async() => {
  const res = await api
    .post('/api/newUser')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  token = res.body.token;
  console.log(token);
});

test('the user can be verified', async() => {
  await api
    .get('/api/sample')
    .set({ Authorization: `bearer ${token}` })
    .expect(401);

  await api
    .post('/api/login')
    .send(newUser)
    .expect(401);

  let msgId;
  let msg;
  try {
    const axiosResponse = await axios.delete(`https://mailsac.com/api/addresses/${email}/messages`, conf);
  } catch (error) {
    console.error('Error fetching messages:', error);
  };

  await new Promise((r) => setTimeout(r, 3000));
  try {
    const axiosResponse = await axios.get(`https://mailsac.com/api/addresses/${email}/messages/`, conf);
    msgId = axiosResponse.data[0]._id;
  } catch (error) {
    console.error('Error fetching messages:', error);
  };


  try {
    const axiosResponse = await axios.get(`https://mailsac.com/api/text/${email}/${msgId}`, conf);
    msg = axiosResponse.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
  };
  const sixDigitNumber = msg.match(/\b\d{6}\b/)[0];

  await api
    .post('/api/login/confirm')
    .set({ Authorization: `bearer ${token}` })
    .send({ code: sixDigitNumber })
    .expect(200);
}, 10000);

test('the user can make a request', async() => {
  try {
    await api
    .get('/api/sample')
    .set({ Authorization: `bearer ${token}` })
    .expect(200)
    .expect('Content-Type', /application\/json/);
  } catch (error) {
    console.log('error', error);
  }
  await api
  .get('/api/sample')
  .set({ Authorization: `bearer ${token}` })
  .expect(200)
  .expect('Content-Type', /application\/json/);
})
let newToken;
test('the users auth token will expire and be refreshed', async() => {
  try {
    await new Promise((r) => setTimeout(r, 5500));
    const newTokenResponse = await api
      .get('/api/sample')
      .set({ Authorization: `bearer ${token}` })
      .expect(200)
      .expect('Content-Type', /application\/json/);
    newToken = newTokenResponse.headers.authorization;
    expect(token).not.toEqual(newToken);

    await api
      .get('/api/sample')
      .set({ Authorization: `bearer ${newToken}` })
      .expect(200)
      .expect('Content-Type', /application\/json/);
  } catch (error) {
    console.log('error', error);
  }

}, 10000)

test('the users refresh token will expire', async() => {
  try {
    await new Promise((r) => setTimeout(r, 5000));
    const response = await api
      .get('/api/sample')
      .set({ Authorization: `bearer ${newToken}` })
      .expect(400)
    expect(response.body.error).toEqual('refresh token expired');
  } catch (error) {
    console.log('error', error);
  }
}, 10000)

test('the users refresh token can regenerate after login', async() => {
  try {
    const res = await api
    .post('/api/login')
    .send(newUser)
    .expect(200);
    const refreshedToken = res.body.token;
    await api
      .get('/api/sample')
      .set({ Authorization: `bearer ${refreshedToken}` })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    await new Promise((r) => setTimeout(r, 5500));
    const newTokenResponse = await api
      .get('/api/sample')
      .set({ Authorization: `bearer ${refreshedToken}` })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const newToken = newTokenResponse.headers.authorization;
    expect(token).not.toEqual(newToken);

    await api
      .get('/api/sample')
      .set({ Authorization: `bearer ${newToken}` })
      .expect(200)
      .expect('Content-Type', /application\/json/);
  } catch (error) {
    console.log('error', error);
  }
}, 10000)


afterAll(async () => {
  await mongoose.connection.close();
});
