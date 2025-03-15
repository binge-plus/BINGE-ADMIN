const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// GET route to serve the movie form page
router.get('/', (req, res) => {
    res.sendFile('index.html', { root: './views' });
});

// POST route to add a new movie
router.post('/', async (req, res) => {
    try {
        const movieData = {
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
            visitMovie: req.body.visitMovie,
            trailer: req.body.trailer,
            isMarvel: req.body.Marvel === '1'
        };

        const movie = new Movie(movieData);
        await movie.save();
        
        res.redirect('/index.html');
    } catch (error) {
        console.error('Error saving movie:', error);
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 