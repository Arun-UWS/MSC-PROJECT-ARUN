const mongoose = require('mongoose');

const MovieSchema = mongoose.Schema({
    movie: String,
    year: String,
    genre: String,
    rating: String,
    comment: String

}, {
    timestamps: true
});

module.exports = mongoose.model('Movie', MovieSchema);
