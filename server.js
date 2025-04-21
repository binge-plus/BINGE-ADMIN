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
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

// Serve static HTML files from views directory
app.use(express.static('views'));

// Routes
app.use('/', require('./routes/authRoutes'));

app.use('/public', express.static('public'));

const PORT = process.env.PORT;
const IP = process.env.IP || 'localhost';
app.listen(PORT, () => console.log(`Server running on port http://${IP}:${PORT}`)); 