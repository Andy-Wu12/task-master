import { useCallback, useState, useReducer, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { errorReducer } from "../reducers/auth.reducer";

import type { authFormAction, authFormError } from "../reducers/auth.reducer";
import { AuthContext } from "../context/authContext";
import useFormValidator from "./useFormValidator";

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
  }, [isLogin]);

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

      const response = await fetch(`${process.env.REACT_APP_SERVER_URL!}/graphql`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/graphql"
        },
        body: queryBody
      });

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

  }, [updateUserContext, validator.validateForm]);

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

      const response = await fetch(`${process.env.REACT_APP_SERVER_URL!}/graphql`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/graphql",
        },
        body: queryBody,
        mode: "cors",
        credentials: "include"
      });

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

  }, [updateUserContext, validator.validateForm]);

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