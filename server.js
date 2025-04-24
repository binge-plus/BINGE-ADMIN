require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const movieRoutes = require('./routes/movies');

const app = express(); 

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/movies', movieRoutes);

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.stack);
    res.status(500).json({
        message: 'An unexpected error occurred',
        error: err.message
    });
});

const MOVIES_DB_PORT = process.env.MOVIES_DB_PORT;
const IP = process.env.IP || 'localhost';
app.listen(MOVIES_DB_PORT, () => {
    console.log(`Server running on port http://${IP}:${MOVIES_DB_PORT}`);
});