import Users from "./users.mongo";
import type { User } from "./users.mongo";
import type { UserAuthResult } from "./userAuth";

import { hashText } from "../../util/auth";

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const DEFAULT_ID = -1;

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
    return { error: 'Password length needs to be at least 4 characters' };
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
      return { error: 'User already exists!' };
    } else {
      return { error: 'Unexpected error occurred.' };
    }
  }

  return newUser;
}

async function loginUser(username: string, password: string): Promise<UserAuthResult> {
  const user = await Users.findOne({username: username});

  if(!user) {
    return { error: 'User not found.' };
  } else {
    const valid = await bcrypt.compare(password, user.password);
    if(!valid) {
      return { error: 'Invalid username/password combination.' };
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
