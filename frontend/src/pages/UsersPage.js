import React from 'react';
import { Container } from '@mui/material';
import UserList from '../components/UserList';
import '../style/Pages.css';


const UsersPage = () => {
  return (
    <Container maxWidth="lg" className="page-container users-page">
      <UserList />
    </Container>
  );
};

export default UsersPage; 