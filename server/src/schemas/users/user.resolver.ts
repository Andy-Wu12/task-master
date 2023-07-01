import type { YogaInitialContext } from "graphql-yoga";

import UserModel from "./user.model";
import type { User } from "./users.mongo";

import type { UserToken, UserError, UserAuthResult, UserAuthArgs } from "./userAuth";

const day = 24 * 60 * 60 * 1000;

async function setUserToken(ctx: YogaInitialContext, tokenValue: string) {
  await ctx.request.cookieStore?.set({
    name: 'token',
    value: tokenValue,
    expires: Date.now() + day,
    sameSite: 'none',
    domain: null,
    secure: true,
  })

}

const userResolvers = {
  Query: {
    users: async () => await UserModel.getAllUsers(),

    user: async (_: unknown, args: { id: number }) => {
      const { id } = args;
      return await UserModel.getUserByID(id);
    },
  },

  Mutation: {
    signup: async (_: unknown, args: UserAuthArgs, ctx: YogaInitialContext) => {
      const { username, password } = args;
      const response = await UserModel.addNewUser(username, password);

      if(!('error' in response)) {
        const result = await UserModel.loginUser(username, password);
        if('token' in result) {
          await setUserToken(ctx, result.token);
        }
      }

      return response;
    },

    login: async (_: unknown, args: UserAuthArgs, ctx: YogaInitialContext) => {
      const { username, password } = args;
      const result = await UserModel.loginUser(username, password);

      if('token' in result) {
        await setUserToken(ctx, result.token);
      }

      return result;
    },

    deleteUser: async (_: unknown, args: { id: number }) => {
      const { id } = args;
      return await UserModel.deleteUser(id);
    }
  },

  User: {
    id: (parent: User) => parent.id,
    username: (parent: User) => parent.username,
  },

  UserError: {
    error: (parent: UserError) => parent.error
  },

  UserToken: {
    token: (parent: UserToken) => parent.token
  },

  AuthResult: {
    __resolveType: (obj: UserAuthResult) => {
      if("error" in obj) return "UserError"
      else if("token" in obj) return "UserToken"
      else return "User"
    }
  }

}

export default userResolvers;
