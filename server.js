require('dotenv').config(); 
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session configuration with 30-minute timeout
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 60 * 1000, // 30 minutes in milliseconds
        httpOnly: true
    }
}));

app.use(flash());

// Middleware to check for session timeout
app.use((req, res, next) => {
    // Skip for login page and public assets
    if (req.path === '/login' || 
        req.path.startsWith('/public/') || 
        req.path === '/favicon.ico') {
        return next();
    }

    // Check if user is authenticated
    if (!req.session.user) {
        return res.redirect('/login');
    }

    // Update last activity timestamp
    req.session.lastActivity = Date.now();
    next();
});

// Serve static HTML files from views directory
app.use(express.static('views'));

// Routes
app.use('/', require('./routes/authRoutes'));

app.use('/public', express.static('public'));

const ADMIN_PAGE_PORT = process.env.ADMIN_PAGE_PORT
const IP = process.env.IP || 'localhost';
app.listen(ADMIN_PAGE_PORT, () => console.log(`Server running on port http://${IP}:${ADMIN_PAGE_PORT}`)); 