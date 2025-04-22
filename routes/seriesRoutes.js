const express = require('express');
const router = express.Router();
const Series = require('../models/Series');
const path = require('path');

// Get series form page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

// Handle series submission
router.post('/', async (req, res) => {
    try {
        console.log('Received series data:', req.body);
        
        const seriesData = {
            title: req.body.title,
            details: req.body.details,
            quality: req.body.quality,
            rating: parseFloat(req.body.rating),
            imageH: req.body.imageH,
            imageV: req.body.imageV,
            releaseDate: new Date(req.body.releaseDate),
            cast: Array.isArray(req.body.cast) ? req.body.cast : [req.body.cast],
            genre: req.body.genre,
            director: req.body.director,
            trailer: req.body.trailer,
            episodes: req.body.episodes || []
        };

        console.log('Processed series data:', seriesData);
        
        const series = new Series(seriesData);
        const savedSeries = await series.save();
        
        console.log('Series saved:', savedSeries);
        
        // Return JSON response
        res.status(201).json({ 
            success: true, 
            message: 'Series added successfully',
            series: savedSeries 
        });
    } catch (error) {
        console.error('Error saving series:', error);
        res.status(400).json({ success: false, message: error.message });
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

module.exports = router; 