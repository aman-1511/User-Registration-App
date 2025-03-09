import React from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../style/Pages.css';
import '../style/NotFound.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" className="page-container not-found-page">
      <Paper elevation={3} className="not-found-paper">
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" paragraph>
          The page you are looking for does not exist or has been moved.
        </Typography>
        <Box className="not-found-button-container">
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/')}
            size="large"
          >
            Go to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFoundPage; 