const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: true
    },
    Details: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    Rating: {
        type: String,
        required: true
    },
    Image: {
        type: String,
        required: true
    },
    Link: {
        type: String,
        required: true
    },
    Visit_Movie: {
        type: String,
        required: true
    },
    Trailer: {
        type: String,
        required: true
    },
    ReleaseDate: {
        type: String,
        required: true
    },
    Genre: {
        type: String,
        required: true
    },
    Director: {
        type: String,
        required: true
    },
    Cast: [{
        type: String
    }]
});

module.exports = mongoose.model('Movie', movieSchema); 