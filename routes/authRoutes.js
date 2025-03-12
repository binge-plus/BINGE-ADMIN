const express = require('express');
const router = express.Router();
const path = require('path');

// Login page
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
});

// Login handle
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === process.env.ADMIN_USERNAME && 
        password === process.env.ADMIN_PASSWORD) {
        req.session.isAuthenticated = true;
        req.flash('success_msg', 'Login successful!');
        res.redirect('/');
    } else {
        req.flash('error_msg', 'Invalid credentials');
        res.redirect('/login');
    }
});

// Logout handle
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Home page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/admin.html'));
});

module.exports = router; 