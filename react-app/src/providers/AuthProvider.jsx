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

export const AuthProvider = ({ children }) => {
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

  const authenticate = async (access_token) => {
    if (access_token) {
      const result = await customAxios({
        headers: {
          access_token,
          Authorization: `Bearer ${access_token}`,
        },
      })
        .get('auth/authenticated-route')
        .then(() => true)
        .catch(() => false);
      console.log('authenticate result:', result);
      setAuthenticated(result);
      updateToken(result ? access_token : null);
    } else {
      setAuthenticated(false);
      updateToken(null);
    }
  };

  useEffect(() => {
    console.log('authenticate');
    authenticate(getToken());
  }, [location]);

  console.log('[Provider] token:', getToken());

  const handleLogin = async ({ token, redirectUrl }) => {
    console.log('handleLogin', token, redirectUrl);
    await authenticate(token);
    const { location } = window;
    const url = new URL(location.href);
    const next = url.searchParams.get('next') || storage.get('login_to', '') || '';
    storage.remove('login_to');
    navigate(redirectUrl || next || '/');
  };

  const handleLogout = async (options) => {
    const { redirectUrl } = options || {};
    console.log('handleLogout', getToken());
    await authenticate(null);
    if (redirectUrl) {
      navigate(redirectUrl);
    }
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
    storage.set('login_to', next);
    const nextUrl = targetUrl.toString().replace(targetUrl.origin, '');
    return <Navigate to={nextUrl || '/'} replace state={{ from: location }} />;
  }

  return children;
};
