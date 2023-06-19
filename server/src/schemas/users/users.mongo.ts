import mongoose from 'mongoose';

interface User {
  id: number
  username: string,
  password: string
}

const userSchema = new mongoose.Schema<User>({
  id: {
    type: Number,
    unique: true,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true,
  }
});

const Users = mongoose.model<User>('user', userSchema);

export default Users;

export type {
  User
}
