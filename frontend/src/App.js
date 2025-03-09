import React from 'react';
import { ThemeProvider } from '@mui/material';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { AuthPage, RegisterPage, UsersPage, NotFoundPage } from './pages';
import theme from './theme/theme';
import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
  
      <div className="app-container">
        <Router>
          <AuthProvider>
            <Routes>
             
              <Route 
                path="/" 
                element={<AuthPage />} 
              />
            
              <Route
                path="/register"
                element={
                  <ProtectedRoute>
                    <RegisterPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <UsersPage />
                  </ProtectedRoute>
                }
              />
              
           
              <Route
                path="*"
                element={<NotFoundPage />}
              />
            </Routes>
          </AuthProvider>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
