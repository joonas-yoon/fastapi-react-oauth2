import LoginForm, { LoginContainer, SubTitle, Title } from 'components/LoginForm';
import React, { useEffect, useState } from 'react';

import { Box } from '@mui/material';
import { customAxios } from 'libs/customAxios';
import qs from 'qs';
import { useAuth } from 'components/AuthProvider';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [serverResponse, setServerResponse] = useState({
    status: null,
    message: '',
  });
  const { login } = useAuth();

  const onSubmit = (username, password) => {
    const formData = qs.stringify({
      username,
      password,
    });

    setServerResponse({
      status: 'waiting',
    });

    customAxios
      .post('/auth/jwt/login', formData, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      })
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
      <Box
        sx={{
          marginBottom: '1em',
        }}
      >
        <Title>Login</Title>
        <SubTitle>Welcome back! Sign in to continue</SubTitle>
      </Box>
      <LoginForm onSubmit={onSubmit} serverResponse={serverResponse} />
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
