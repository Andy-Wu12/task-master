import request from 'supertest';

import app from '../app';

import { mongoConnect, mongoDisconnect } from '../services/mongo';
import { createAndSaveRandomUsers } from '../util/testing';
import Users from '../schemas/users/users.mongo';

describe('User API', () => {
  const numUsers = 5;
  const contentType = 'application/graphql';

  const testDBName = 'taskTracker_test';

  beforeAll(async () => {
    await mongoConnect(process.env.MONGO_TEST_URI!, testDBName);
    await Users.deleteMany({});
    await createAndSaveRandomUsers(numUsers);
  });

  afterAll(async () => {
    // Only needed for local test execution since CI uses containerized environment.
    await Users.deleteMany({});
    await mongoDisconnect();
  });

  describe('Test users query', () => {
    const validQuery = `query {
      users {
        id
        username
      }
    }`;

    test('It should fail with an invalid query', async () => {
      const response = await request(app)
        .post('/graphql')
        .set('Content-Type', contentType)
        .send(
          `query {
            users
          }`
        );
      
        expect(response.body).toHaveProperty('errors');
    });

    test('It should succeed with a valid query', async () => {
      const response = await request(app)
        .post('/graphql')
        .set('Content-type', contentType)
        .send(validQuery);

      expect(response.body).not.toHaveProperty('errors');
    });

    test('It should return an array with length >= 0 for a valid query', async () => {
      const response = await request(app)
        .post('/graphql')
        .set('Content-type', contentType)
        .send(validQuery);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('users');

      const users = response.body.data.users;
      expect(users.length).toBeGreaterThanOrEqual(0);
    });

    test('It should return an array with length matching number of users', async () => {
      const response = await request(app)
        .post('/graphql')
        .set('Content-type', contentType)
        .send(validQuery);

      const users = response.body.data.users;
      expect(users.length).toEqual(numUsers);
    });

  });

  describe('Test find user by ID', () => {
    const validQuery = (id: number) => {
      return `query {
        user(id: ${id}) {
          id
          username
        }
      }`;
    }

    const validID = numUsers - 1;

    test('It should return a user if ID exists', async () => {
      const response = await request(app)
        .post('/graphql')
        .set('Content-type', contentType)
        .send(validQuery(validID));

      const user = response.body.data.user;
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('username');
    });

    test('It should return the correct user for a valid ID', async () => {
      const response = await request(app)
        .post('/graphql')
        .set('Content-type', contentType)
        .send(validQuery(validID));

      const user = response.body.data.user;
      expect(user).not.toBeNull();
      expect(user.id).toEqual(validID.toString());
    })

    test('It should return null if ID does not exist', async () => {
      const response = await request(app)
        .post('/graphql')
        .set('Content-type', contentType)
        .send(validQuery(-5));

      const user = response.body.data.user;
      expect(user).toBeNull();
    });
  });

  describe('Test add new user', () => {
    const functionName = 'signup';

    const validQuery = (username: string, password: string) => {
      return `mutation {
        ${functionName}(username: "${username}" password: "${password}") {
          ... on User {
            id
            username
          }
          ... on UserToken {
              token
          }
          ... on UserError {
              error {
                username
                password
              }
          }
        }
      }`;
    }

    const validNewID = numUsers;
    const testUsername = 'testusername123';
    const testPass = 'passwordabc123';

    let response: any;

    beforeEach(async () => {
      await Users.deleteOne({username: testUsername});

      response = await request(app)
        .post('/graphql')
        .set('Content-type', contentType)
        .send(validQuery(testUsername, testPass));
    });

    test('It should create a user with the correct auto-incremented ID', async () => {
      const user = response.body.data[functionName];
      expect(user).not.toBeNull();
      expect(user.id).toEqual(validNewID.toString());
    });

    test('It should create a new user with the desired username', async () => {
      const user = response.body.data[functionName];
      expect(user).not.toBeNull();
      expect(user.username).toStrictEqual(testUsername);
    });

    test('It should not create another user when given an existing username', async () => {
      // Second insert using duplicate username
      const dupeResponse = await request(app)
        .post('/graphql')
        .set('Content-type', contentType)
        .send(validQuery(testUsername, 'password'));

      expect(dupeResponse.body.data.signup).toHaveProperty('error');

    });

    test('It should not store passwords in plaintext', async () => {
      const user = await Users.findOne({username: testUsername});
      expect(user).toHaveProperty('password');
      expect(user?.password).not.toEqual(testPass);
    });
  });

  describe('Test delete user', () => {
    const validQuery = (id: number) => {
      return `mutation {
        deleteUser(id: ${id}) {
          id
          username
        }
      }`;
    }

    const testUsername = 'deletee123';
    const testID = 500, testPass = 'password';

    beforeEach(async () => {
      await new Users({
        id: testID,
        username: testUsername,
        password: testPass
      }).save();
    });

    afterEach(async () => {
      await Users.findOneAndDelete({id: testID});
    });

    test('It should return null if user does not exist', async () => {
      const response = await request(app)
        .post('/graphql')
        .set('Content-type', contentType)
        .send(validQuery(-100));

      expect(response.body.data.deleteUser).toBeNull();
    });

    test('It should return the correct user information on deletion', async () => {
      const response = await request(app)
        .post('/graphql')
        .set('Content-type', contentType)
        .send(validQuery(testID));

      const user = response.body.data.deleteUser;
      expect(user.id).toEqual(testID.toString());
      expect(user.username).toEqual(testUsername);
    });

    test('It should delete the user from the database', async () => {
      await request(app)
        .post('/graphql')
        .set('Content-type', contentType)
        .send(validQuery(testID));

      const user = await Users.findOne({id: testID});
      expect(user).toBeNull();
    });
  
  });

});