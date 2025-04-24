const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// Route to add a new movie
router.post('/', async (req, res) => {
    try {
        // Create new movie
        const newMovie = new Movie(req.body);

        // Save movie to database
        const savedMovie = await newMovie.save();
        
        // Send response
        res.status(201).json({ 
            message: 'Movie saved successfully', 
            movie: savedMovie 
        });
    } catch (error) {
        console.error('Error saving movie:', error);
        res.status(500).json({ 
            message: 'Error saving movie', 
            error: error.message
        });
    }
});

// Route to get all movies
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ 
            message: 'Error fetching movies', 
            error: error.message 
        });
    }
});

module.exports = router; 