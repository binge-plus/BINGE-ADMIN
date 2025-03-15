const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    Quality: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    imageH: {
        type: String,
        required: true
    },
    imageV: {
        type: String,
        required: true
    },
    releaseDate: {
        type: Date,
        required: true
    },
    cast: [{
        type: String
    }],
    genre: {
        type: String,
        required: true
    },
    director: {
        type: String,
        required: true
    },
    visitMovie: {
        type: String,
        required: true
    },
    trailer: {
        type: String,
        required: true
    },
    isMarvel: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Movie', movieSchema); 