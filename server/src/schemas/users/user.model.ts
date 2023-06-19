import Users from "./users.mongo";
import type { User } from "./users.mongo";
import type { UserAuthArgs, UserAuthResult, UserError } from "./userAuth";

import { hashText } from "../../util/auth";

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const DEFAULT_ID = -1;

function createUserAuthError(errors: UserAuthArgs): UserError {
  return {
    error: {
      username: errors.username,
      password: errors.password
    }
  }
}

async function getAllUsers(): Promise<User[]> {
  return Users.find();
}

async function getUserByID(id: number): Promise<User | null> {
  return Users.findOne({id: id});
}

async function getLatestUserNumber(): Promise<number> {
  const latestUser = await Users.findOne().sort('-id');

  if(!latestUser) {
    return DEFAULT_ID;
  }

  return latestUser.id;
}

async function addNewUser(username: string, password: string): Promise<UserAuthResult> {
  const minLength = 4; // Keeping this short for demo purposes

  if(password.length < minLength) {
    return createUserAuthError({
        username: '',
        password: 'Password length needs to be at least 4 characters'
      });
    }

  const hashed = await hashText(password);

  const newUser: User = {
    id: await getLatestUserNumber() + 1,
    username: username,
    password: hashed
  }

  try {
    await saveUser(newUser);
  } catch(e: any) {
    if(e.name === 'MongoServerError' && e.code === 11000) {
      return createUserAuthError({
        username: 'User already exists',
        password: ''
      });
    } else {
      return createUserAuthError({
        username: 'Unexpected error',
        password: 'Unexpected error'
      });
    }
  }

  return newUser;
}

async function loginUser(username: string, password: string): Promise<UserAuthResult> {
  const user = await Users.findOne({username: username});

  if(!user) {
    return createUserAuthError({
      username: 'User does not exist',
      password: ''
    });
  } else {
    const valid = await bcrypt.compare(password, user.password);
    if(!valid) {
      return createUserAuthError({
        username: 'Invalid username and password combination',
        password: ''
      });
    } else {
      return {
        token: jwt.sign(
          { id: user._id, username: user.username },
          process.env.JWT_SECRET!,
          { expiresIn: '1d'}
        ),
        user: user
      }
    }
  }
} 

async function deleteUser(id: number): Promise<User | null> {
  return await Users.findOneAndDelete({id: id})
}

async function saveUser(user: User): Promise<void> {
  await Users.findOneAndUpdate({
    id: user.id
  }, user, {
    upsert: true
  })
}

const UserModel = {
  getAllUsers,
  getUserByID,
  addNewUser,
  loginUser,
  deleteUser
}

export default UserModel;
