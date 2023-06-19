import { ErrorResponse } from "../types/errorResponse";
import type { User } from "./users.mongo";

type UserError = ErrorResponse

type UserToken = {
  token: string,
  user: User
}

type UserAuthResult = User | UserToken | UserError;

export type {
  UserError,
  UserToken,
  UserAuthResult
}
