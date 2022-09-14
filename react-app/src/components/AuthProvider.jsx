import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { customAxios } from 'libs/customAxios';
import storage from 'libs/storage';

const AuthContext = createContext(null);

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (value === null) {
    throw new Error('useAuth should be used within AuthProvider');
  }
  return value;
};

export const AuthProvider = ({ afterLogin, children }) => {
  const navigate = useNavigate();

  const TOKEN_NAME = 'access_token';

  const token = useMemo(() => {
    return storage.get(TOKEN_NAME);
  }, [storage]);

  const [isAuthenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    customAxios()
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
    const { location } = window;
    const url = new URL(location.href);
    const next = url.searchParams.get('next');
    const redirectUrl = afterLogin || next || '/';
    navigate(redirectUrl === '/login' ? '/' : redirectUrl);
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
  const location = useLocation();

  console.log('token', token, 'isAuthenticated', isAuthenticated);

  if (!isAuthenticated) {
    const origin = location?.origin || window.location.origin;
    const targetUrl = new URL(redirectTo || '/', origin);
    const next = location?.pathname + location?.search + location?.hash;
    targetUrl.searchParams.append('next', encodeURI(next));
    const nextUrl = targetUrl.toString().replace(targetUrl.origin, '');
    return <Navigate to={nextUrl || '/'} replace state={{ from: location }} />;
  }

  return children;
};
