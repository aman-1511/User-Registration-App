import React from 'react';
import { Container } from '@mui/material';
import UserRegistrationForm from '../components/UserRegistrationForm';
import '../style/Pages.css';

const RegisterPage = () => {
  return (
    <Container maxWidth="lg" className="page-container">
      <UserRegistrationForm />
    </Container>
  );
};

export default RegisterPage; 