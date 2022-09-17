import { Alert, Box } from '@mui/material';
import LoginForm, { LoginCard, LoginContainer, SubTitle, Title } from 'components/LoginForm';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { customAxios } from 'libs/customAxios';
import qs from 'qs';
import { useAuth } from 'providers/AuthProvider';

export const Login = () => {
  const [serverResponse, setServerResponse] = useState({
    status: null,
    message: '',
  });
  const { login, isAuthenticated } = useAuth();
  const location = useLocation();

  console.log('Component rendered: isAuthenticated', isAuthenticated);

  const onSubmit = (username, password) => {
    const formData = qs.stringify({
      username,
      password,
    });

    setServerResponse({
      status: 'waiting',
    });

    customAxios({
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    })
      .post('/auth/jwt/login', formData)
      .then((response) => {
        console.log('Response', response);
        const { access_token } = response.data;
        setServerResponse({
          status: 'success',
          message: null,
        });
        login(access_token);
      })
      .catch(({ message }) => {
        console.error(`Failed to request : ${message}`);
        const ERROR_MESSAGE = 'Your login attempt was not successful. Try again';
        setServerResponse({
          status: 'error',
          message: ERROR_MESSAGE,
        });
      });
  };

  return (
    <LoginContainer>
      {location.state?.from && (
        <Alert
          severity="error"
          sx={{
            marginBottom: '1em',
          }}
        >
          This page requires login to access.
        </Alert>
      )}
      <LoginCard>
        <Box
          sx={{
            marginBottom: '1em',
          }}
        >
          <Title>Login</Title>
          <SubTitle>Welcome back! Sign in to continue</SubTitle>
        </Box>
        <LoginForm onSubmit={onSubmit} serverResponse={serverResponse} />
      </LoginCard>
    </LoginContainer>
  );
};

export const Logout = () => {
  const location = useNavigate();
  useEffect(() => {
    location(-1);
  }, [location]);
  return null;
};

export default {
  Login,
  Logout,
};
