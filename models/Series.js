const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema({
    EpisodeNumber: {
        type: Number,
        required: true
    },
    EpisodeTitle: {
        type: String,
        required: true
    }
});

const seriesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    quality: {
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
    trailer: {
        type: String,
        required: true
    },
    episodes: [episodeSchema]
});

module.exports = mongoose.model('Series', seriesSchema); 