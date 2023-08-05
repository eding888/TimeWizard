import User from '../dist/models/user.js'
import app from '../dist/app.js';
import supertest from 'supertest';
import mongoose from 'mongoose';
import config from '../dist/utils/config.js';
import axios from 'axios';
const api = supertest(app);

const email = 'eding888_1632w@mailsac.com';

const conf = {
  headers:{
   'Mailsac-Key': config.MAILSAC_KEY
  }
};
//
beforeEach(async () => {
  await User.deleteMany({})
});


const testMsg = 'a user can be created, can try to make a request that fails due to not being verified, can log in and confirm their email, make the same request and have it go through due to being verified and have the auth and refresh tokens expire properly.'

test(testMsg, async () => {
  const newUser = {
    username: "Jeremy",
    email,
    password: "Password123"
  };
  const response = await api
    .post('/api/newUser')
    .set({ Authorization: `bearer ${config.ADMIN_KEY}` })
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const token = response.body.token;

  await api
    .get('/api/sample')
    .set({ Authorization: `bearer ${token}` })
    .expect(401);

  await api
    .post('/api/login')
    .set({ Authorization: `bearer ${token}` })
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

  await api
    .get('/api/sample')
    .set({ Authorization: `bearer ${token}` })
    .expect(200)
    .expect('Content-Type', /application\/json/);
  await new Promise((r) => setTimeout(r, 11000));
  const newTokenResponse = await api
    .get('/api/sample')
    .set({ Authorization: `bearer ${token}` })
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const newToken = newTokenResponse.headers.authorization;
  console.log(newToken);
  expect(token).not.toEqual(newToken);

  await api
    .get('/api/sample')
    .set({ Authorization: `bearer ${newToken}` })
    .expect(200)
    .expect('Content-Type', /application\/json/);
}, 40000);

afterAll(async () => {
  await mongoose.connection.close();
});
