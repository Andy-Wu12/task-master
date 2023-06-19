import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { AuthContext } from './context/authContext';

import './index.css';

import type { IUser } from './context/authContext';
import type { UserQueryResult } from './hooks/useAuth';

const container = document.getElementById('root')!;
const root = createRoot(container);

function Index() {
  const [user, setUser] = useState<IUser | null>(null);

  // Persist user session data even after refresh
  useEffect(() => {
    const userJSON = window.sessionStorage.getItem('user');
    if(userJSON) {
      const userObj: UserQueryResult = JSON.parse(userJSON);
      setUser(userObj);
    } else {
      setUser(null);
    }
  }, []);

  return (
    <React.StrictMode>
      <AuthContext.Provider value={{user, setUser}}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthContext.Provider>
    </React.StrictMode>
  );
}

root.render(<Index/>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
