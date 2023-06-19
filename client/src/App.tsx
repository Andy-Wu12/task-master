import { useEffect } from 'react';
import { Route, Routes, redirect } from 'react-router-dom';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'

import Landing from './routes/Landing';
import Dashboard from './routes/Dashboard';
import AuthenticationForm from './routes/Auth/Auth';

import ProtectedRoute from './components/ProtectedRoute';

import useAuth from './hooks/useAuth';

function App() {
  const auth = useAuth();

  useEffect(() => {
    // TODO: Verify user with token
    if(!auth.authContext.user) {
      redirect('/auth')
    }
  });

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/auth' element={<AuthenticationForm />} />
        <Route path='/dashboard' element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }/>
      </Routes>
    </div>
  );
}

export default App;