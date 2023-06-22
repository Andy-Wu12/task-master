import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import useAuth from '../../hooks/useAuth';

import './Auth.css';

const MIN_PASSWORD_LENGTH = 4;

export default function AuthenticationForm() {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    // Automatically redirect user to dashboard if they are already logged in
    if(auth.authContext.user) {
      // TODO: Verify user using JWT token
      navigate('/dashboard');
    }
  }, [auth.authContext, navigate]);


  return (
    <div className='pageCenterContainer'>
      <div className='auth-wrapper'>
        <Form.Check 
          type={'checkbox'}
          id={'toggleForm'}
          label={'Signed Up?'}
          onChange={auth.toggleForm}
        />
        
        {auth.isLogin ? <LogInForm /> : <SignUpForm />}
      </div>
    </div>
  )
}

function SignUpForm() {
  const auth = useAuth();

  return (
    <>
      <h1> Sign Up </h1>
      <Form aria-label='form' noValidate validated={auth.validated} onSubmit={auth.submitSignup}> 
        <Form.Group className='mb-3' controlId='formUsername'>
          <Form.Label>Username</Form.Label>
          <Form.Control type='text' name='username' placeholder='username123' required isInvalid={auth.error.username !== null} />
          <Form.Control.Feedback type='invalid'>
            {auth.error.username}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className='mb-3' controlId='formPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' name='password' placeholder='password' minLength={MIN_PASSWORD_LENGTH} required isInvalid={auth.error.password !== null}/>
          <Form.Control.Feedback type='invalid'>
            {auth.error.password}
          </Form.Control.Feedback>
          <Form.Text className='text-muted'>
            Minimum password length is {MIN_PASSWORD_LENGTH}
          </Form.Text>
        </Form.Group>
        <Button variant='primary' type='submit'>
          Submit
        </Button>
      </Form>
    </>
  )
}

function LogInForm() {
  const auth = useAuth();

  return (
    <>
      <h1> Log In </h1>
      <Form aria-label='form' noValidate validated={auth.validated} onSubmit={auth.submitLogin}>
        <Form.Group className='mb-3' controlId='formUsername' >
          <Form.Label>Username</Form.Label>
          <Form.Control type='text' name='username' placeholder='username123' required isInvalid={auth.error.username !== null} />
          <Form.Control.Feedback type='invalid'>
          {auth.error.username}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3' controlId='formPassword' >
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' name='password' placeholder='password' required isInvalid={auth.error.password !== null} />
          <Form.Control.Feedback type='invalid'>
          {auth.error.password}
          </Form.Control.Feedback>
        </Form.Group>
        <Button variant='primary' type='submit'>
          Log In
        </Button>
      </Form>
    </>
  )
}

export {
  AuthenticationForm,
  SignUpForm,
  LogInForm
}