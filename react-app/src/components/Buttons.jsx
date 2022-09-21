import { Button, styled } from '@mui/material';
import { IoLogoGithub, IoMail } from 'react-icons/io5';

import Colors from './colors';
import { FcGoogle } from 'react-icons/fc';
import React from 'react';
import { SiKakao } from 'react-icons/si';
import { TinyColor } from '@ctrl/tinycolor';
import { LogoNaver } from './icons/Naver';

const BasicButton = ({ children, sx, ...others }) => (
  <Button
    variant="outlined"
    sx={{
      ...sx,
      padding: '0.5em 1em',
    }}
    {...others}
  >
    {children}
  </Button>
);

const ColoredAuthButton = styled(BasicButton)(({ theme, foregroundcolor, backgroundcolor }) => {
  const baseBackgroundColor = new TinyColor(backgroundcolor);
  return {
    color: foregroundcolor || theme.palette.getContrastText(backgroundcolor),
    borderColor: 'transparent',
    backgroundColor: baseBackgroundColor.toHexString(),
    '&:hover': {
      borderColor: 'transparent',
      backgroundColor: baseBackgroundColor.darken().toHexString(),
    },
  };
});

const SignInWithGoogleButton = ({ ...props }) => (
  <BasicButton startIcon={<FcGoogle />} {...props}>
    Sign in with Google
  </BasicButton>
);

const SignInWithGitHubButton = ({ ...props }) => (
  <ColoredAuthButton startIcon={<IoLogoGithub />} backgroundcolor={Colors.Brands.GitHub} {...props}>
    Sign in with GitHub
  </ColoredAuthButton>
);

const SignInWithKakaoButton = ({ ...props }) => (
  <ColoredAuthButton startIcon={<SiKakao />} backgroundcolor={Colors.Brands.Kakao} {...props}>
    Sign in with Kakao
  </ColoredAuthButton>
);

const SignInWithNaverButton = ({ ...props }) => (
  <ColoredAuthButton
    startIcon={<LogoNaver invert={true} />}
    foregroundcolor="#ffffff"
    backgroundcolor={Colors.Brands.Naver}
    {...props}
  >
    Sign in with NAVER
  </ColoredAuthButton>
);

const SignInWithEmailButton = ({ ...props }) => (
  <ColoredAuthButton startIcon={<IoMail />} backgroundcolor={Colors.Email} {...props}>
    Sign in with Email
  </ColoredAuthButton>
);

export const OAuth = {
  BasicButton,
  GoogleButton: SignInWithGoogleButton,
  GitHubButton: SignInWithGitHubButton,
  KakaoButton: SignInWithKakaoButton,
  NaverButton: SignInWithNaverButton,
  EmailButton: SignInWithEmailButton,
};

export default {
  OAuth: OAuth,
};
