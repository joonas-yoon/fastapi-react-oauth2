import LoginForm, { LoginContainer, SubTitle, Title } from 'components/LoginForm';
import React, { useState } from 'react';

import { Box } from '@mui/material';
import { customAxios } from 'libs/customAxios';
import qs from 'qs';

const Login = () => {
  const [serverResponse, setServerResponse] = useState({
    status: null,
    message: '',
  });

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
        const { accessToken } = response.data;
        localStorage.setItem('access_token', JSON.stringify(accessToken || {}));
        setServerResponse({
          status: 'success',
          message: null,
        });
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

export default Login;
