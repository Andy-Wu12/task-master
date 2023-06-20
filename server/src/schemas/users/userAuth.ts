import { IErrorResponse } from "../types/errorResponse";
import type { User } from "./users.mongo";

type UserAuthArgs = {
  username: string,
  password: string
}

type UserError = IErrorResponse<UserAuthArgs>

type UserToken = {
  token: string,
  user: User
}

type UserAuthResult = User | UserToken | UserError;

export type {
  UserAuthArgs,
  UserError,
  UserToken,
  UserAuthResult
}
