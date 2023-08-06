import User from '../dist/models/user.js'
import app from '../dist/app.js';
import supertest from 'supertest';
import mongoose from 'mongoose';
import config from '../dist/utils/config.js';
import axios from 'axios';
import { resolve } from 'node:path/posix';
const api = supertest(app);

const retrieveCodeFromEmail = async () => {
  let msgId;
  let msg;
  console.log('hay');
  try {
    const axiosResponse = await axios.delete(`https://mailsac.com/api/addresses/${email}/messages`, conf);
  } catch (error) {
    console.error('Error fetching messages:', error);
  }; 
  console.log('hoy');

  await new Promise((r) => setTimeout(r, 3000));
  try {
    const axiosResponse = await axios.get(`https://mailsac.com/api/addresses/${email}/messages/`, conf);
    msgId = axiosResponse.data[0]._id;
  } catch (error) {
    console.error('Error fetching messages:', error);
  };
  console.log('hey');

  try {
    const axiosResponse = await axios.get(`https://mailsac.com/api/text/${email}/${msgId}`, conf);
    msg = axiosResponse.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
  };
  const sixDigitNumber = msg.match(/\b\d{6}\b/)[0];
  return sixDigitNumber;
}

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
const wrongUser = {
  name: "Jeremy",
  pass: "Password123"
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

test('improperly formatted inputs are not allowed', async() => {
  const uncleanUsername = {
    username: "Joe!!<>",
    email: "joe@joemail.com",
    password: "Password123"
  };
  await api
    .post('/api/newUser')
    .send(uncleanUsername)
    .expect(400)

  const uncleanEmail = {
    username: "Joe",
    email: "joe1!!<>@@joemail.com",
    password: "Password123"
  };

  await api
    .post('/api/newUser')
    .send(uncleanEmail)
    .expect(400)

  const uncleanPassword = {
    username: "Joe",
    email: "joe@joemail.com",
    password: "password"
  };

  await api
    .post('/api/newUser')
    .send(uncleanPassword)
    .expect(400)
});

test('improperly formatted new user is rejected', async() => {
  await api
    .post('/api/newUser')
    .send(wrongUser)
    .expect(400)
});

test('the user can be verified', async() => {
  await api
    .get('/api/sample')
    .set({ Authorization: `bearer ${token}` })
    .expect(401);

  await api
    .post('/api/login/confirm')
    .set({ Authorization: `bearer ${token}` })
    .send({ code: '000000' })
    .expect(400);

  await api
    .post('/api/login')
    .send(newUser)
    .expect(401);

  const sixDigitNumber = await retrieveCodeFromEmail();

  await api
    .post('/api/login/confirm')
    .set({ Authorization: `bearer ${token}` })
    .send({ code: '000000' })
    .expect(401);

  await api
    .post('/api/login/confirm')
    .set({ Authorization: `bearer ${token}` })
    .send({ code: sixDigitNumber })
    .expect(200);
}, 10000);

test('the user can make a request', async() => {
  await api
  .get('/api/sample')
  .set({ Authorization: `bearer ${token}` })
  .expect(200)
  .expect('Content-Type', /application\/json/);
})

test('cross-origin requests are not allowed', async () => {
  const response = await api.get('/api/sample')
    .set({ Authorization: `bearer ${token}` })
    .set('Origin', 'http://example.com')
    .expect(403);
  console.log(response.headers, 'headers');
  expect(response.headers['access-control-allow-origin']).toBeUndefined();
});
let newToken;

test('improperly formatted logins are not allowed', async () => {
  await api
    .post('/api/login')
    .send(wrongUser)
    .expect(400);
});
test('the users auth token will expire and be refreshed', async() => {

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


}, 10000)

test('the users refresh token will expire', async() => {

  await new Promise((r) => setTimeout(r, 5000));
  const response = await api
    .get('/api/sample')
    .set({ Authorization: `bearer ${newToken}` })
    .expect(400)
  expect(response.body.error).toEqual('refresh token expired');

}, 10000)

test('the users refresh token can regenerate after login', async() => {

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

}, 10000)

test('the user can reset their password', async() => {
  const res = await api
    .post('/api/login')
    .send(newUser)
    .expect(200);
  const oldToken = res.body.token;
  const randomEmail = {
    username: "Joe",
    email: "hank@hankmail.com",
    password: "Password123"
  };
  await api
    .post('/api/login/resetPassword')
    .send(randomEmail)
    .expect(400);

  await api
    .post('/api/login/resetPassword')
    .send(newUser)
    .expect(200);
  console.log('made it');

  const code = await retrieveCodeFromEmail();
  console.log(code);
  newUser.password = "NewPassword123";
  const payload = {
    email,
    code,
    newPassword: newUser.password
  }
  await api
    .post('/api/login/resetPassword/confirm')
    .send(payload)
    .expect(200);
  await api
    .get('/api/sample')
    .set({ Authorization: `bearer ${oldToken}` })
    .expect(401)

  await api
    .post('/api/login')
    .send(newUser)
    .expect(200);

}, 10000)

afterAll(async () => {
  await mongoose.connection.close();
});
