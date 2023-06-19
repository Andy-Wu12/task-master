import type { YogaInitialContext } from "graphql-yoga";

import UserModel from "./user.model";
import type { User } from "./users.mongo";

import type { UserToken, UserError, UserAuthResult } from "./userAuth";

interface IAddNewUserArgs extends User {}
interface ILoginArgs {
  username: string,
  password: string
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
    signup: async (_: unknown, args: IAddNewUserArgs, ctx: YogaInitialContext) => {
      const { username, password } = args;
      const response = await UserModel.addNewUser(username, password);

      if(!('error' in response)) {
        const result = await UserModel.loginUser(username, password);
        if('token' in result) {
          await ctx.request.cookieStore?.set('token', result.token);
        }
      }

      return response;
    },

    login: async (_: unknown, args: ILoginArgs, ctx: YogaInitialContext) => {
      const { username, password } = args;
      const result = await UserModel.loginUser(username, password);

      if('token' in result) {
        await ctx.request.cookieStore?.set('token', result.token);
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
