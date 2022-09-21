import { Alert, Box, LinearProgress, Stack, Typography } from '@mui/material';
import LoginForm, { LoginContainer, SubTitle, Title } from 'components/LoginForm';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Card } from 'components/Card';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { OAuth } from 'components/Buttons';
import { SiKakao, SiNaver } from 'react-icons/si';
import { customAxios } from 'libs/customAxios';
import qs from 'qs';
import { useAuth } from 'providers/AuthProvider';
import Colors from 'components/colors';

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
        login({ token: access_token });
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

  const handleOAuth = (link) => {
    customAxios()
      .get(link)
      .then((response) => {
        const { authorization_url } = response.data;
        window.location.href = authorization_url;
      })
      .catch((e) => console.log('log', e));
  };

  const onClickGoogleButton = (evt) => {
    evt.preventDefault();
    handleOAuth('/auth/google/authorize');
  };

  const onClickGitHubButton = (evt) => {
    evt.preventDefault();
    handleOAuth('/auth/github/authorize');
  };

  const onClickKakaoButton = (evt) => {
    evt.preventDefault();
    handleOAuth('/auth/kakao/authorize');
  };

  const onClickNaverButton = (evt) => {
    evt.preventDefault();
    handleOAuth('/auth/naver/authorize');
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
          {location.state?.message || 'This page requires login to access'}
        </Alert>
      )}
      <Card>
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
            <OAuth.NaverButton onClick={onClickNaverButton} />
            <OAuth.EmailButton onClick={onClickEmailButton} />
          </Stack>
        )}
      </Card>
    </LoginContainer>
  );
};

export const Logout = () => {
  const { logout } = useAuth();
  const location = useNavigate();
  useEffect(() => {
    logout();
    location(-1);
  }, [location]);
};

const CallbackOAuth = ({ api_callback_url, icon, children, error_message }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    customAxios()
      .get(api_callback_url + location.search)
      .then(({ data }) => {
        console.log('Recieved data', data);
        login({
          token: data.access_token,
        });
      })
      .catch(({ response }) => {
        console.error(response);
        navigate('/login', {
          replace: true,
          state: {
            from: location,
            message: error_message,
          },
        });
      });
  }, [location]);

  return (
    <LoginContainer>
      <Card>
        <Box sx={{ width: '100%', textAlign: 'center', fontSize: '5em', marginBottom: '10px' }}>
          {icon}
          <LinearProgress />
        </Box>
        {children}
      </Card>
    </LoginContainer>
  );
};

const CallbackGoogle = () => {
  return (
    <CallbackOAuth
      api_callback_url="/auth/google/callback"
      icon={<FcGoogle />}
      error_message="Failed to authroize with Google"
    >
      <Typography>Waiting for Google Sign-in to complete...</Typography>
    </CallbackOAuth>
  );
};

const CallbackGithub = () => {
  return (
    <CallbackOAuth
      api_callback_url="/auth/github/callback"
      icon={<FaGithub />}
      error_message="Failed to authroize with GitHub"
    >
      <Typography>Waiting for GitHub Sign-in to complete...</Typography>
    </CallbackOAuth>
  );
};

const CallbackKakao = () => {
  return (
    <CallbackOAuth
      api_callback_url="/auth/kakao/callback"
      icon={<SiKakao />}
      error_message="Failed to authroize with Kakao"
    >
      <Typography>Waiting for Kakao Sign-in to complete...</Typography>
    </CallbackOAuth>
  );
};

const CallbackNaver = () => {
  return (
    <CallbackOAuth
      api_callback_url="/auth/naver/callback"
      icon={<SiNaver style={{ fill: Colors.Brands.Naver }} />}
      error_message="Failed to authroize with NAVER"
    >
      <Typography>Waiting for NAVER Sign-in to complete...</Typography>
    </CallbackOAuth>
  );
};

export default {
  Login,
  Logout,
  Redirects: {
    Google: CallbackGoogle,
    Github: CallbackGithub,
    Kakao: CallbackKakao,
    Naver: CallbackNaver,
  },
};
