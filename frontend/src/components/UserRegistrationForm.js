import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Typography, Paper, Container, Alert } from '@mui/material';
import '../style/UserRegistrationForm.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import useForm from '../hooks/useForm';
import { registrationValidationRules, loginValidationRules } from '../utils/validation';

const UserRegistrationForm = ({ onUserAdded }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, register, isAuthenticated } = useAuthContext();
    const isAddingNewUser = location.pathname === '/register';
    
    const [isLogin, setIsLogin] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const initialFormValues = {
        name: '',
        email: '',
        password: '',
        age: '',
        dateOfBirth: '',
        gender: '',
        about: ''
    };

    const validationRules = isLogin ? loginValidationRules : registrationValidationRules;

    const { 
        values: formData, 
        handleChange, 
        handleBlur,
        errors: formErrors, 
        validateForm,
        resetForm
    } = useForm(initialFormValues);

    useEffect(() => {
        if (isAuthenticated && !isAddingNewUser) {
            navigate('/users');
        }
    }, [isAuthenticated, isAddingNewUser, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const isValid = validateForm(validationRules);
        if (!isValid) return;

        try {
            const result = await (isLogin 
                ? login(formData.email, formData.password)
                : register(formData));

            if (result.success) {
                setSuccess(isLogin ? 'Login successful!' : 'Registration successful!');
                resetForm();
                
                if (isLogin || isAddingNewUser) {
                    navigate('/users');
                } else if (onUserAdded) {
                    onUserAdded();
                }
            } else {
                setError(result.message || `${isLogin ? 'Login' : 'Registration'} failed`);
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        }
    };

    const handleToggle = () => {
        if (isAddingNewUser) {
            navigate('/users');
        } else {
            setIsLogin(!isLogin);
            resetForm();
            setError('');
            setSuccess('');
        }
    };

    return (
        <Container component="main" maxWidth="sm" className="form-container">
            <Paper elevation={3} className="form-paper">
                <Typography variant="h5" component="h1" className="form-title">
                    {isAddingNewUser ? 'Add New User' : (isLogin ? 'Login' : 'User Registration')}
                </Typography>

                {error && <Alert severity="error" className="alert">{error}</Alert>}
                {success && <Alert severity="success" className="alert">{success}</Alert>}

                <form onSubmit={handleSubmit} className="registration-form">
                    {!isLogin && (
                        <TextField
                            name="name"
                            label="Name"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={(e) => handleBlur(e, validationRules)}
                            fullWidth
                            required
                            margin="normal"
                            error={!!formErrors.name}
                            helperText={formErrors.name}
                        />
                    )}

                    <TextField
                        name="email"
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={(e) => handleBlur(e, validationRules)}
                        fullWidth
                        required
                        margin="normal"
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                    />

                    <TextField
                        name="password"
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={(e) => handleBlur(e, validationRules)}
                        fullWidth
                        required
                        margin="normal"
                        error={!!formErrors.password}
                        helperText={formErrors.password}
                    />

                    {!isLogin && (
                        <>
                            <TextField
                                name="age"
                                label="Age"
                                type="number"
                                value={formData.age}
                                onChange={handleChange}
                                onBlur={(e) => handleBlur(e, validationRules)}
                                fullWidth
                                required
                                margin="normal"
                                error={!!formErrors.age}
                                helperText={formErrors.age}
                            />

                            <TextField
                                name="dateOfBirth"
                                label="Date of Birth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                onBlur={(e) => handleBlur(e, validationRules)}
                                fullWidth
                                required
                                margin="normal"
                                error={!!formErrors.dateOfBirth}
                                helperText={formErrors.dateOfBirth}
                                InputLabelProps={{ shrink: true }}
                            />

                            <FormControl 
                                fullWidth 
                                margin="normal" 
                                required
                                error={!!formErrors.gender}
                            >
                                <InputLabel>Gender</InputLabel>
                                <Select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    onBlur={(e) => handleBlur(e, validationRules)}
                                    label="Gender"
                                >
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </Select>
                                {formErrors.gender && (
                                    <Typography variant="caption" color="error">
                                        {formErrors.gender}
                                    </Typography>
                                )}
                            </FormControl>

                            <TextField
                                name="about"
                                label="About"
                                multiline
                                rows={4}
                                value={formData.about}
                                onChange={handleChange}
                                onBlur={(e) => handleBlur(e, validationRules)}
                                fullWidth
                                margin="normal"
                            />
                        </>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        className="submit-button"
                    >
                        {isLogin ? 'Login' : 'Register'}
                    </Button>

                    <Button
                        type="button"
                        color="secondary"
                        fullWidth
                        onClick={handleToggle}
                        className="toggle-button"
                    >
                        {isAddingNewUser ? 'Back to User List' : (isLogin ? 'Need to Register?' : 'Already have an account? Login')}
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default UserRegistrationForm; 