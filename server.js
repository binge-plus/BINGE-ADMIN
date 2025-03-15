require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const connectDB = require('./config/db');
const path = require('path');
const seriesRoutes = require('./routes/seriesRoutes');

const app = express();

// Connect to MongoDB
connectDB();

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
app.use('/series', seriesRoutes);

// Add route handlers for the HTML pages
app.get('/series', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/public', express.static('public'));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 