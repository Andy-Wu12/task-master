import { useCallback, useState, useReducer, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { errorReducer } from "../reducers/auth.reducer";

import type { authFormError } from "../reducers/auth.reducer";
import { AuthContext } from "../context/authContext";
import useFormValidator from "./useFormValidator";
import { queryGraphQL } from "./requests";

type UserQueryResult = {
  username: string
}

function initErrorState(): authFormError {
  return {
    password: '', username: ''
  };
}

function useAuth() {
  const navigate = useNavigate();
  const validator = useFormValidator();
  const authContext = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState<boolean>(false);

  const [error, errorDispatch] = useReducer(errorReducer, null, initErrorState);

  const toggleForm = useCallback(() => {
    setIsLogin(!isLogin);
    validator.setValidated(false);
  }, [isLogin, validator]);

  const updateUserContext = useCallback((userData: UserQueryResult) => {
    authContext.setUser(userData);
    window.sessionStorage.setItem('user', JSON.stringify(userData));
    navigate('/dashboard');
  }, [authContext, navigate]);

  const submitSignup = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    const form = validator.validateForm(event);
    if(form !== null) {
      const data = new FormData(form);
      const username = data.get('username');
      const password = data.get('password');
      
      const queryBody = `mutation {
        signup(username: "${username}", password: "${password}") {
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

      const response = await queryGraphQL(queryBody);

      const json = await response.json();
      if(json.data.signup) {
        const queryResult = json.data.signup;
        if('error' in queryResult) {
          errorDispatch({
            type: 'set_form_errors',
            error: queryResult.error
          })
        } else {
          updateUserContext(queryResult);
        }
      }
    }

  }, [updateUserContext, validator]);

  const submitLogin = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    const form = validator.validateForm(event);
    if(form !== null) {
      const data = new FormData(form);
      const username = data.get('username');
      const password = data.get('password');
      
      const queryBody = `mutation {
        login(username: "${username}" password: "${password}") {
          ... on User {
            username
          }
          ... on UserToken {
              token
              user {
                username
              }
          }
          ... on UserError {
              error {
                username
                password
              }
          }
        }
      }`;

      const response = await queryGraphQL(queryBody);

      const json = await response.json();
      if(json.data.login) {
        const queryResult = json.data.login;
        if('error' in queryResult) {
          errorDispatch({
            type: 'set_form_errors',
            error: queryResult.error
          })
        } else {
          updateUserContext(queryResult.user);
        }
      }
      
    }

  }, [updateUserContext, validator]);

  return {
    validator,
    isLogin,
    error,
    toggleForm,
    submitSignup,
    submitLogin,
    authContext,
  };
}

export type {
  UserQueryResult
}

export default useAuth;