type authFormError = {
  username: string | undefined,
  password: string | undefined
}

type authFormAction = 
  { type: 'set_form_errors', error: authFormError }
  // { type: 'set_email_error', error: string }
  // | { type: 'set_password_error', error: string }
  // | { type: 'set_username_error', error: string }

function errorReducer(state: authFormError, action: authFormAction): authFormError  {
  switch(action.type) {
    case 'set_form_errors':
      return {
        username: action.error.username,
        password: action.error.password
      };
  }
};

export {
  errorReducer
}

export type {
  authFormError,
  authFormAction,
}