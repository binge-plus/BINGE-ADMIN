const express = require('express');
const router = express.Router();
const Series = require('../models/Series');
const path = require('path');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.isAuthenticated) {
        return next();
    }
    res.redirect('/login');
};

// Get series form page
router.get('/', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/series.html'));
});

// Handle series submission
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const seriesData = {
            title: req.body.title,
            details: req.body.details,
            Quality: req.body.Quality,
            rating: parseFloat(req.body.rating),
            imageH: req.body.imageH,
            imageV: req.body.imageV,
            releaseDate: new Date(req.body.releaseDate),
            cast: Array.isArray(req.body.cast) ? req.body.cast : [req.body.cast],
            genre: req.body.genre,
            director: req.body.director,
            trailer: req.body.trailer,
            episodes: req.body.episodes
        };

        const series = new Series(seriesData);
        await series.save();
        
        res.redirect('/index.html');
    } catch (error) {
        console.error('Error saving series:', error);
        res.status(400).json({ message: error.message });
    }
});

// Get all series
router.get('/api/series', async (req, res) => {
    try {
        const series = await Series.find();
        res.json(series);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single series by ID
router.get('/api/series/:id', async (req, res) => {
    try {
        const series = await Series.findById(req.params.id);
        if (series) {
            res.json(series);
        } else {
            res.status(404).json({ message: 'Series not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add new series (protected route)
router.post('/api/series', async (req, res) => {
    const series = new Series({
        title: req.body.title,
        imageH: req.body.imageH,
        imageV: req.body.imageV,
        details: req.body.details,
        Quality: req.body.Quality,
        rating: req.body.rating,
        releaseDate: req.body.releaseDate,
        cast: req.body.cast,
        genre: req.body.genre,
        director: req.body.director,
        trailer: req.body.trailer,
        episodes: req.body.episodes
    });

    try {
        const newSeries = await series.save();
        res.status(201).json(newSeries);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 