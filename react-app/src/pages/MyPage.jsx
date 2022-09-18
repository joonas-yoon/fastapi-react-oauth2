import { Avatar, Container, Typography, Button, Stack } from '@mui/material';
import React, { useEffect, useCallback, useState } from 'react';

import { Card } from 'components/Card';
import { ProtectedRoute, useAuth } from 'providers/AuthProvider';
import { customAxios } from 'libs/customAxios';

const MyPage = () => {
  const [userData, setUserData] = useState(null);
  const { logout } = useAuth();

  useEffect(() => {
    customAxios()
      .get('/users/me')
      .then(({ data }) => {
        console.log(data);
        setUserData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const UserProfile = useCallback(() => {
    if (userData === null) return <></>;
    const { first_name, last_name, picture } = userData;
    const full_name = [first_name, last_name].join(' ');
    return (
      <Card
        sx={{
          maxWidth: '480px',
          margin: '1em auto',
        }}
      >
        <Stack>
          <div>
            <Avatar
              alt={full_name}
              src={picture}
              sx={{
                width: 64,
                height: 64,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <Typography mt={1} fontSize={24} textAlign="center">
              Hello, {full_name}.
            </Typography>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Button variant="contained" onClick={() => logout({ redirectUrl: '/' })}>
              Logout
            </Button>
          </div>
        </Stack>
      </Card>
    );
  }, [userData]);

  return (
    <ProtectedRoute redirectTo="/login">
      <Container>
        <Card>
          <h1>My Page</h1>
          <UserProfile />
        </Card>
      </Container>
    </ProtectedRoute>
  );
};

export default MyPage;
