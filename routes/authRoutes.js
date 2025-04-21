const express = require('express');
const router = express.Router();
const path = require('path');

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Login page
router.get('/login', (req, res) => {
    // If already logged in, redirect to home
    if (req.session.user) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, '../views/login.html'));
});

// Login handle
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === process.env.ADMIN_USERNAME && 
        password === process.env.ADMIN_PASSWORD) {
        // Store user info and activity timestamp
        req.session.user = { username };
        req.session.lastActivity = Date.now();
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

// Session timeout check API endpoint
router.get('/api/check-session', (req, res) => {
    if (!req.session.user) {
        return res.json({ valid: false });
    }
    
    // Update last activity timestamp
    req.session.lastActivity = Date.now();
    return res.json({ valid: true });
});

// Home page - protected route
router.get('/', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/admin.html'));
});

module.exports = router; 