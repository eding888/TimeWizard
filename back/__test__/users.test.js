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
  console.log('mailin');
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
let cookieHeader;
let csrf;
describe('Backend tests', () => {
  test('a user can be created', async() => {
    const res = await api
      .post('/api/newUser')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    cookieHeader = res.headers['set-cookie'][0];
  });

  test('improperly formatted inputs are not allowed', async() => {
    const uncleanUsername = {
      username: "Joe!!<>",
      email: "joe@joemail.com",
      password: "Password123"
    };
    await api
      .post('/api/newUser')
      .set('Cookie', cookieHeader)
      .send(uncleanUsername)
      .expect(400)

    const uncleanEmail = {
      username: "Joe",
      email: "joe1!!<>@@joemail.com",
      password: "Password123"
    };

    await api
      .post('/api/newUser')
      .set('Cookie', cookieHeader)
      .send(uncleanEmail)
      .expect(400)

    const uncleanPassword = {
      username: "Joe",
      email: "joe@joemail.com",
      password: "password"
    };

    await api
      .post('/api/newUser')
      .set('Cookie', cookieHeader)
      .send(uncleanPassword)
      .expect(400)
  });

  test('improperly formatted new user is rejected', async() => {
    await api
      .post('/api/newUser')
      .set('Cookie', cookieHeader)
      .send(wrongUser)
      .expect(400)
  });

  test('the user can be verified', async() => {
    await api
      .get('/api/sample')
      .set('Cookie', cookieHeader)
      .expect(403);

    await api
      .post('/api/login/confirm')
      .set('Cookie', cookieHeader)
      .send({ code: '000000', username: 'Jeremy' })
      .expect(400);

    await api
      .post('/api/login')
      .set('Cookie', cookieHeader)
      .send(newUser)
      .expect(401);

    const sixDigitNumber = await retrieveCodeFromEmail();

    await api
      .post('/api/login/confirm')
      .set('Cookie', cookieHeader)
      .send({ code: '000000', username: 'Jeremy' })
      .expect(401);

    const res = await api
      .post('/api/login/confirm')
      .set('Cookie', cookieHeader)
      .send({ code: sixDigitNumber, username: 'Jeremy' })
      .expect(200);
    
    csrf = res.body.csrf;
  }, 10000);

  test('the user can make a request', async() => {
    await api
    .get('/api/sample')
    .set('Cookie', cookieHeader)
    .set('x-csrf-token', csrf)
    .expect(200)
    .expect('Content-Type', /application\/json/);
  })

  test('cross-origin requests are not allowed', async () => {
    const response = await api.get('/api/sample')
      .set({ Authorization: `bearer ${token}` })
      .set('Origin', 'http://example.com')
      .expect(403);
    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });
  let newToken;

  test('improperly formatted logins are not allowed', async () => {
    await api
      .post('/api/login')
      .set('Cookie', cookieHeader)
      .set('x-csrf-token', csrf)
      .send(wrongUser)
      .expect(400);
  });
  test('the users auth token will expire and be refreshed', async() => {
    const res = await api
    .post('/api/login')
    .set('Cookie', cookieHeader)
    .set('x-csrf-token', csrf)
    .send(newUser)
    .expect(200);
    cookieHeader = res.headers['set-cookie'][0];
    await new Promise((r) => setTimeout(r, 6500));
    const newTokenResponse = await api
      .get('/api/sample')
      .set('Cookie', cookieHeader)
      .set('x-csrf-token', csrf)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    cookieHeader = newTokenResponse.headers['set-cookie'][0];

    await api
      .get('/api/sample')
      .set('Cookie', cookieHeader)
      .set('x-csrf-token', csrf)
      .expect(200)
      .expect('Content-Type', /application\/json/);


  }, 10000)

  test('the users refresh token will expire', async() => {
    await new Promise((r) => setTimeout(r, 6500));
    const response = await api
      .get('/api/sample')
      .set('Cookie', cookieHeader)
      .set('x-csrf-token', csrf)
      .expect(400)
    expect(response.body.error).toEqual('refresh token expired');

  }, 10000)

  test('the users refresh token can regenerate after login', async() => {
    await new Promise((r) => setTimeout(r, 5500));
    await api
      .get('/api/sample')
      .set('Cookie', cookieHeader)
      .set('x-csrf-token', csrf)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    await api
      .post('/api/login')
      .set('Cookie', cookieHeader)
      .set('x-csrf-token', csrf)
      .send(newUser)
      .expect(200);
 
    const newTokenResponse = await api
      .get('/api/sample')
      .set('Cookie', cookieHeader)
      .set('x-csrf-token', csrf)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    console.log(newTokenResponse.headers)

    cookieHeader = newTokenResponse.headers['set-cookie'][0];

    await api
      .get('/api/sample')
      .set('Cookie', cookieHeader)
      .set('x-csrf-token', csrf)
      .expect(200)
      .expect('Content-Type', /application\/json/);

  }, 10000)

  test('the user can reset their password when properly done and have a limited amount of attempts', async() => {
    const res = await api
      .post('/api/login')
      .set('Cookie', cookieHeader)
      .set('x-csrf-token', csrf)
      .send(newUser)
      .expect(200);
    cookieHeader = res.headers['set-cookie'][0];
    const randomEmail = {
      username: "Joe",
      email: "hank@hankmail.com",
      password: "Password123"
    };
    await api
      .post('/api/login/resetPassword')
      .set('Cookie', cookieHeader)
      .set('x-csrf-token', csrf)
      .send(randomEmail)
      .expect(404);

    await api
      .post('/api/login/resetPassword')
      .set('Cookie', cookieHeader)
      .set('x-csrf-token', csrf)
      .send(newUser)
      .expect(200);

    const code = await retrieveCodeFromEmail();
    newUser.password = "NewPassword123";
    const payload = {
      email,
      code,
      newPassword: newUser.password
    }
    await api
      .post('/api/login/resetPassword/confirm')
      .set('Cookie', cookieHeader)
      .set('x-csrf-token', csrf)
      .send(payload)
      .expect(200);
    await api
      .get('/api/sample')
      .set('Cookie', cookieHeader)
      .set('x-csrf-token', csrf)
      .expect(401)

    await api
      .post('/api/login')
      .set('Cookie', cookieHeader)
      .set('x-csrf-token', csrf)
      .send(newUser)
      .expect(200);

    await api
      .post('/api/login/resetPassword')
      .set('Cookie', cookieHeader)
      .set('x-csrf-token', csrf)
      .send(newUser)
      .expect(200);

    const crappyPayload = {
      email,
      code: '0000000',
      newPassword: newUser.password
    }
    for(let i = 0; i < 6; i++){
      await api
      .post('/api/login/resetPassword/confirm')
      .set('Cookie', cookieHeader)
      .set('x-csrf-token', csrf)
      .send(crappyPayload)
    }

    await api
      .post('/api/login/resetPassword/confirm')
      .set('Cookie', cookieHeader)
      .set('x-csrf-token', csrf)
      .send(payload)
      .expect(400);

    await api
      .post('/api/login/resetPassword/')
      .set('Cookie', cookieHeader)
      .set('x-csrf-token', csrf)
      .send(payload)
      .expect(400);

  }, 10000)
})

afterAll(async () => {
  await mongoose.connection.close();
});
