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
  const [isAuthenticated, setAuthenticated] = useState(false);
  const location = useLocation();

  const TOKEN_NAME = 'access_token';

  const getToken = () => storage.get(TOKEN_NAME);

  const updateToken = (new_token) => {
    if (new_token !== null) {
      storage.set(TOKEN_NAME, new_token);
    } else {
      storage.remove(TOKEN_NAME);
    }
  };

  const authenticate = async () => {
    const access_token = getToken();
    if (access_token) {
      const result = await customAxios()
        .get('auth/authenticated-route')
        .then(() => true)
        .catch(() => false);
      setAuthenticated(result);
      updateToken(result ? access_token : null);
    }
  };

  useEffect(() => {
    authenticate();
  }, [location]);

  console.log('[Provider] token:', getToken());

  const handleLogin = (token) => {
    console.log('handleLogin', token);
    updateToken(token);
    const { location } = window;
    const url = new URL(location.href);
    const next = url.searchParams.get('next');
    const redirectUrl = afterLogin || next || '/';
    navigate(redirectUrl);
  };

  const handleLogout = () => {
    console.log('handleLogout', getToken());
    updateToken(null);
  };

  const value = {
    token: getToken(),
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const ProtectedRoute = ({ redirectTo, children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  console.log('isAuthenticated', isAuthenticated);

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
