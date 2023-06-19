import { createContext } from 'react';

interface IUser {
  username: string
}

type AuthContextType = {
  user: IUser | null,
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>
}

const defaultState = {
  user: null,
  setUser: () => {}
}

const AuthContext = createContext<AuthContextType>(defaultState);

export type {
  IUser
}

export {
  AuthContext
}
