import { Navigate, useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import { customAxios } from 'libs/customAxios';
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

  const [isAuthenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    customAxios
      .get('/users/me')
      .then((res) => {
        console.log(res.response);
        setAuthenticated(true);
      })
      .catch(() => {
        setAuthenticated(false);
      });
  }, [token]);

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
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const ProtectedRoute = ({ redirectTo, children }) => {
  const { token, isAuthenticated } = useAuth();

  console.log('token', token, 'isAuthenticated', isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={redirectTo || '/'} replace />;
  }

  return children;
};
