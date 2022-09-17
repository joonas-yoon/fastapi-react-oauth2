import { Alert, Box, Stack } from '@mui/material';
import LoginForm, { LoginCard, LoginContainer, SubTitle, Title } from 'components/LoginForm';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { OAuth } from 'components/Buttons';
import { customAxios } from 'libs/customAxios';
import qs from 'qs';
import { useAuth } from 'providers/AuthProvider';

export const Login = () => {
  const [serverResponse, setServerResponse] = useState({
    status: null,
    message: '',
  });
  const [isLoginWithEmail, showEmailLoginForm] = useState(false);
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

  const onClickGoogleButton = (evt) => {
    evt.preventDefault();
    customAxios()
      .get('/auth/google/authorize')
      .then((response) => {
        const { authorization_url } = response.data;
        window.location.href = authorization_url;
      })
      .catch((e) => console.log('log', e));
  };

  const onClickGitHubButton = (evt) => {
    evt.preventDefault();
  };

  const onClickKakaoButton = (evt) => {
    evt.preventDefault();
  };

  const onClickEmailButton = (evt) => {
    evt.preventDefault();
    showEmailLoginForm(true);
  };

  const onClickBackButton = (evt) => {
    evt.preventDefault();
    showEmailLoginForm(false);
  };

  const LoginHeader = () => (
    <Box
      sx={{
        marginBottom: '1em',
      }}
    >
      <Title>Login</Title>
      <SubTitle>Welcome back! Sign in to continue</SubTitle>
    </Box>
  );

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
        <LoginHeader />
        {isLoginWithEmail ? (
          <>
            <LoginForm onSubmit={onSubmit} serverResponse={serverResponse} />
            <Stack marginTop={1}>
              <OAuth.BasicButton onClick={onClickBackButton}>Back</OAuth.BasicButton>
            </Stack>
          </>
        ) : (
          <Stack spacing={1}>
            <OAuth.GoogleButton onClick={onClickGoogleButton} />
            <OAuth.GitHubButton onClick={onClickGitHubButton} />
            <OAuth.KakaoButton onClick={onClickKakaoButton} />
            <OAuth.EmailButton onClick={onClickEmailButton} />
          </Stack>
        )}
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

const CallbackGoogle = () => {
  console.log('Google');
  const location = useLocation();
  if (location.search) {
    const params = location.search.substring(1).split('&');
    return (
      <>
        {params && (
          <pre>
            {params.map((s) => {
              const [key, value] = s.split('=');
              return `${key}: ${value}\n`;
            })}
          </pre>
        )}
      </>
    );
  }
  return 'Failed';
};

export default {
  Login,
  Logout,
  Redirects: {
    Google: CallbackGoogle,
  },
};
