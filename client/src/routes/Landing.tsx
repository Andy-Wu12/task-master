import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import useAuth from '../hooks/useAuth';

export default function Landing() {
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
    <>
      <div className="Header-text">
        <h1>Task Master</h1>
        <h2>Task Management Made Easy and Free</h2> <br/>
      </div>
      <Button variant="primary">
        <a href='/auth' style={{color: 'inherit'}}>Get Started</a>
      </Button>{' '}
    </>
  );
}