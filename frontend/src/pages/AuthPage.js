import React from 'react';
import { Container } from '@mui/material';
import UserRegistrationForm from '../components/UserRegistrationForm';
import '../style/Pages.css';


const AuthPage = () => {
  return (
    <Container maxWidth="lg" className="page-container auth-page">
      <UserRegistrationForm />
    </Container>
  );
};

export default AuthPage; 