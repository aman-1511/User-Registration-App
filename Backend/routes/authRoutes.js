const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { registerUser, loginUser, getUserProfile } = require('../controllers/authControllers');


router.post('/register', registerUser);
router.post('/login', loginUser);


router.get('/profile', protect, getUserProfile);

module.exports = router; 