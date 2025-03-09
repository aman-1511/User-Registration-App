import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Alert,
    Box,
    FormControl,
    InputLabel,
    Select,
    CircularProgress,
    Backdrop
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, ExitToApp as LogoutIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import useUsers from '../hooks/useUsers';

import '../style/UserList.css';
import '../style/Dialog.css';


const UserTableRow = ({ user, currentUserEmail, onEdit, onDelete }) => {
    if (!user?._id) return null;

    return (
        <TableRow 
            className={user.email === currentUserEmail ? 'current-user-row' : ''}
        >
            <TableCell>{user.name || 'N/A'}</TableCell>
            <TableCell>{user.email || 'N/A'}</TableCell>
            <TableCell>{user.age || 'N/A'}</TableCell>
            <TableCell>{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'}</TableCell>
            <TableCell>{user.gender || 'N/A'}</TableCell>
            <TableCell>{user.about || 'N/A'}</TableCell>
            <TableCell align="center">
                <IconButton 
                    onClick={() => onEdit(user)}
                    className="action-button edit-button"
                >
                    <EditIcon />
                </IconButton>
                <IconButton 
                    onClick={() => onDelete(user._id, user.email)}
                    className={`action-button delete-button ${user.email === currentUserEmail ? 'self-delete-button' : ''}`}
                >
                    <DeleteIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    );
};


const EditUserDialog = ({ open, user, onClose, onSave, genderOptions }) => {
    const [formData, setFormData] = useState({});
    const [formErrors, setFormErrors] = useState({});
    
    useEffect(() => {
        if (user) {
            try {
                setFormData({
                    ...user,
                    dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : ''
                });
            } catch (error) {
                onClose();
            }
        }
    }, [user, onClose]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;
        
        if (!formData.name) {
            errors.name = 'Name is required';
            isValid = false;
        }
        
        if (!formData.email) {
            errors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
            isValid = false;
        }
        
        if (!formData.age) {
            errors.age = 'Age is required';
            isValid = false;
        }
        
        if (!formData.dateOfBirth) {
            errors.dateOfBirth = 'Date of Birth is required';
            isValid = false;
        }
        
        if (!formData.gender) {
            errors.gender = 'Gender is required';
            isValid = false;
        }
        
        setFormErrors(errors);
        return isValid;
    };

    const handleSaveClick = () => {
        if (validateForm()) {
            onSave(formData);
        }
    };

    if (!user) return null;

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="sm" 
            fullWidth
            className="edit-dialog"
        >
            <DialogTitle className="edit-dialog-title">Edit User</DialogTitle>
            <DialogContent className="edit-dialog-content">
                <TextField
                    fullWidth
                    name="name"
                    label="Name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    margin="normal"
                    required
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                />
                <TextField
                    fullWidth
                    name="email"
                    label="Email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    margin="normal"
                    required
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                />
                <TextField
                    fullWidth
                    name="age"
                    label="Age"
                    type="number"
                    value={formData.age || ''}
                    onChange={handleChange}
                    margin="normal"
                    required
                    error={!!formErrors.age}
                    helperText={formErrors.age}
                />
                <TextField
                    fullWidth
                    name="dateOfBirth"
                    label="Date of Birth"
                    type="date"
                    value={formData.dateOfBirth || ''}
                    onChange={handleChange}
                    margin="normal"
                    required
                    error={!!formErrors.dateOfBirth}
                    helperText={formErrors.dateOfBirth}
                    InputLabelProps={{
                        shrink: true,
                    }}
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
                        value={formData.gender || ''}
                        onChange={handleChange}
                        label="Gender"
                    >
                        {genderOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                    {formErrors.gender && (
                        <Typography variant="caption" color="error">
                            {formErrors.gender}
                        </Typography>
                    )}
                </FormControl>
                <TextField
                    fullWidth
                    name="about"
                    label="About"
                    multiline
                    rows={4}
                    value={formData.about || ''}
                    onChange={handleChange}
                    margin="normal"
                />
            </DialogContent>
            <DialogActions className="edit-dialog-actions">
                <Button 
                    onClick={onClose}
                    className="dialog-cancel-button"
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleSaveClick}
                    variant="contained"
                    className="update-button"
                >
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const UserList = () => {
    const { currentUser, logout } = useAuthContext();
    const { 
        users, 
        loading: usersLoading, 
        error, 
        success, 
        fetchUsers, 
        fetchUserById,
        updateUser, 
        deleteUser, 
        clearMessages 
    } = useUsers();
    
    const [selectedUser, setSelectedUser] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [genderOptions] = useState(['Male', 'Female', 'Other']);
    const [editLoading, setEditLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            fetchUsers().catch(error => {
                if (error.message === 'Authentication required') {
                    logout();
                }
            });
        }
    }, [fetchUsers, logout, currentUser]);

    const handleEdit = async (user) => {
        if (!user?._id) return;
        
        try {
            setEditLoading(true);
            const latestUserData = await fetchUserById(user._id);
            
            if (!latestUserData) {
                throw new Error('Failed to fetch user data');
            }
            
            setSelectedUser(latestUserData);
            setOpenDialog(true);
        } catch (error) {
            alert(`Failed to load user data: ${error.message || 'Unknown error'}`);
        } finally {
            setEditLoading(false);
        }
    };

    const handleDelete = async (userId, userEmail) => {
        const isSelfDelete = userEmail === currentUser?.email;
        const confirmMessage = isSelfDelete 
            ? 'WARNING: You are about to delete your own account! This will log you out immediately. Are you sure you want to proceed?'
            : 'Are you sure you want to delete this user?';

        if (window.confirm(confirmMessage)) {
            const success = await deleteUser(userId);
            if (success && isSelfDelete) {
                setTimeout(logout, 2000);
            }
        }
    };

    const handleSave = async (editedUser) => {
        const success = await updateUser(selectedUser._id, editedUser);
        if (success) {
            setOpenDialog(false);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUser(null);
    };

    const handleRefresh = () => {
        fetchUsers().catch(() => {});
    };

    return (
        <Container maxWidth="lg">
            <Paper elevation={8} className="list-container">
                <Box className="list-header">
                    <Typography 
                        variant="h4" 
                        component="h1"
                        className="list-title"
                    >
                        Registered Users
                    </Typography>
                    <Box>
                        <Button 
                            variant="contained" 
                            color="primary"
                            onClick={() => navigate('/register')}
                            className="add-button"
                        >
                            Add New User
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleRefresh}
                            className="refresh-button"
                        >
                            Refresh
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<LogoutIcon />}
                            onClick={logout}
                            className="logout-button"
                        >
                            Logout
                        </Button>
                    </Box>
                </Box>

                {error && <Alert severity="error" className="alert" onClose={clearMessages}>{error}</Alert>}
                {success && <Alert severity="success" className="alert" onClose={clearMessages}>{success}</Alert>}

                {usersLoading ? (
                    <Box display="flex" justifyContent="center" padding={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer className="table-container">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Age</TableCell>
                                    <TableCell>Date of Birth</TableCell>
                                    <TableCell>Gender</TableCell>
                                    <TableCell>About</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {!users || users.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7}>
                                            <Box className="no-users">
                                                {error ? 'Error loading users' : 'No users registered yet. Click "Add New User" to get started!'}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((user) => (
                                        <UserTableRow 
                                            key={user._id}
                                            user={user}
                                            currentUserEmail={currentUser?.email}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <EditUserDialog 
                    open={openDialog}
                    user={selectedUser}
                    onClose={handleCloseDialog}
                    onSave={handleSave}
                    genderOptions={genderOptions}
                />
                
                <Backdrop
                    className="loading-backdrop"
                    open={editLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Paper>
        </Container>
    );
};

export default UserList; 