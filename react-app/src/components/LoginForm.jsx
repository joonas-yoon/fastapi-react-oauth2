import {
  Alert,
  Button,
  CircularProgress,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  styled,
} from '@mui/material';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { FaCheck } from 'react-icons/fa';

export const LoginContainer = styled(Container)`
  width: 100%;
  min-width: 320px;
  max-width: 425px;
  margin-top: 2em;
  margin-left: auto;
  margin-right: auto;
`;

const validate = ({ username, password }) => {
  if (username.length < 1) {
    return 'Username is required.';
  }
  if (password.length < 1) {
    return 'Password is required.';
  }
  return null;
};

export const Title = styled(Typography)`
  font-weight: bold;
  font-size: 1.5em;
`;

export const SubTitle = styled(Typography)`
  font-size: 0.8rem;
`;

const Input = (props) => {
  const { error } = props;
  const style = useMemo(() => {
    return error
      ? {
          border: '1px solid #d32f2f',
          borderRadius: '5px',
        }
      : {};
  }, [error]);
  return (
    <FormControl variant="outlined" error={error || false} sx={style}>
      {props.children}
    </FormControl>
  );
};

const LoginButton = (props) => {
  const { status, children, ...others } = props;

  const isLoading = status === 'waiting';
  const isSuccess = status === 'success';

  const iconSize = {
    width: '1.5em !important',
    height: '1.5em !important',
  };

  const injectedProps = {
    ...others,
    sx: {
      height: '3em',
    },
  };

  const Result = useCallback(() => {
    if (isSuccess) {
      return (
        <Button color="success" disableElevation {...injectedProps}>
          <FaCheck color="white" sx={iconSize} />
        </Button>
      );
    } else if (isLoading) {
      return (
        <Button color="primary" loading="true" disabled {...injectedProps}>
          <CircularProgress color="primary" sx={iconSize} />
        </Button>
      );
    } else {
      return (
        <Button color="primary" {...injectedProps}>
          {children}
        </Button>
      );
    }
  }, [status]);

  return <Result />;
};

const LoginForm = (props) => {
  const { onSubmit, serverResponse } = props;

  const [values, setValues] = useState({
    username: '',
    password: '',
    showPassword: false,
    errorMessage: null,
  });

  const setValue = (key, value) => {
    setValues({ ...values, [key]: value });
  };

  const handleChange = (prop) => (event) => {
    setValues({
      ...values,
      errorMessage: null,
      [prop]: event.target.value,
    });
  };

  const handleClickShowPassword = () => {
    setValues((prevValue) => ({
      ...values,
      showPassword: !prevValue.showPassword,
    }));
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const hasError = useMemo(() => {
    return !!values.errorMessage;
  }, [values.errorMessage]);

  useEffect(() => {
    setValue('errorMessage', serverResponse.status === 'error' ? serverResponse.message : null);
    console.log(serverResponse);
  }, [serverResponse]);

  return (
    <Stack
      component="form"
      spacing={2}
      noValidate
      autoComplete="off"
      onSubmit={(evt) => {
        evt.preventDefault();
        const err = validate(values);
        const isValid = err === null;
        setValue('errorMessage', err);
        if (isValid) {
          onSubmit(values.username, values.password);
        }
        return isValid;
      }}
    >
      <Input error={hasError}>
        <InputLabel htmlFor="outlined-adornment-username">Username</InputLabel>
        <OutlinedInput
          id="outlined-adornment-username"
          type="text"
          value={values.username}
          onChange={handleChange('username')}
          label="Username"
        />
      </Input>
      <Input error={hasError}>
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={values.showPassword ? 'text' : 'password'}
          value={values.password}
          onChange={handleChange('password')}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {values.showPassword ? <IoEye /> : <IoEyeOff />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
      </Input>
      {hasError && <Alert severity="error">{values.errorMessage}</Alert>}
      <LoginButton
        type="submit"
        variant="contained"
        status={serverResponse ? serverResponse.status : undefined}
      >
        Login
      </LoginButton>
    </Stack>
  );
};

export default LoginForm;
