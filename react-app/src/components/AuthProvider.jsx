import React, { useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const AuthContext = React.createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ afterLogin, children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(null);

  const storeToken = (accessToken) => {
    localStorage.setItem('access_token', JSON.stringify(accessToken || {}));
    setToken(accessToken);
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

  if (!token) {
    return <Navigate to={redirectTo || '/'} replace />;
  }

  return children;
};
