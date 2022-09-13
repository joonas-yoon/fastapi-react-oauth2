import { Container } from '@mui/material';
import { ProtectedRoute } from 'components/AuthProvider';
import React from 'react';

const MyPage = () => {
  return (
    <ProtectedRoute redirectTo="/login">
      <Container>
        <h1>My Page</h1>
      </Container>
    </ProtectedRoute>
  );
};

export default MyPage;
