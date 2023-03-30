import React, { useState } from 'react';
import '../index.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import AuthContext from '../hooks/AuthContextProvider.jsx';
import { useAuth } from '../hooks/index.jsx';
import LoginPage from './LoginPage.jsx';
import ErrorPage from './ErrorPage.jsx';
import SignupPage from './SignupPage.jsx';
import MainPage from './MainPade.jsx';
import Layout from './Layout.jsx';
import routes from '../routes.js';

const AuthProvider = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(currentUser);

  const logIn = (data) => {
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  const logOut = () => {
    localStorage.removeItem('user');
    setUser({});
  };

  const getAuthHeader = () => {
    const userId = JSON.parse(localStorage.getItem('user'));
    return userId && userId.token ? ({ Authorization: `Bearer ${userId.token}` }) : {};
  };

  return (
    <AuthContext.Provider value={{ // eslint-disable-line
      logIn, logOut, getAuthHeader, user,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const RequestAuth = ({ children }) => {
  const { user } = useAuth();
  const Component = user ? children : <Navigate to={routes.loginPadePath()} />;
  return Component;
};

const App = () => (
  <AuthProvider>
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <Layout />
          <Routes>
            <Route index element={(<RequestAuth><MainPage /></RequestAuth>)} />
            <Route path={routes.signupPadePath()} element={<SignupPage />} />
            <Route path={routes.loginPadePath()} element={<LoginPage />} />
            <Route path={routes.errorPagePath()} element={<ErrorPage />} />
          </Routes>
        </div>
      </div>
    </div>
    <ToastContainer />
  </AuthProvider>
);

export default App;
