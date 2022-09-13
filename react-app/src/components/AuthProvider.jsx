import React, { useContext, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import storage from 'libs/storage';

const AuthContext = React.createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ afterLogin, children }) => {
  const navigate = useNavigate();

  const TOKEN_NAME = 'access_token';

  const token = useMemo(() => {
    return storage.get(TOKEN_NAME);
  }, [storage]);

  const storeToken = (accessToken) => {
    storage.set(TOKEN_NAME, accessToken);
  };

  const handleLogin = (token) => {
    console.log('handleLogin', token);
    storeToken(token);
    navigate(afterLogin);
  };

  const handleLogout = () => {
    console.log('handleLogout', token);
    storeToken(null);
  };

  const value = {
    token,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const ProtectedRoute = ({ redirectTo, children }) => {
  const { token } = useAuth();

  console.log('token', token);

  if (!token) {
    return <Navigate to={redirectTo || '/'} replace />;
  }

  return children;
};
