import User from "../schemas/users/users.mongo";

import { generateRandomString } from "./random";

async function createAndSaveRandomUsers(count: number): Promise<void> {
  for(let i = 0; i < count; i++) {
    const newUser = new User({
      id: i,
      email: generateRandomString(5),
      username: generateRandomString(5),
      password: generateRandomString(5)
    });

    await newUser.save();
  }
}

export {
  createAndSaveRandomUsers
}