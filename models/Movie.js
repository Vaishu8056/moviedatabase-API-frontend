const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    rating: Number,
    review: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const movieSchema = new mongoose.Schema({
    movieId:  String,
    title: String,
    poster_path: String,
    popularity: Number,
    overview: String,
    download_link: String,
    
    /* reviews: [
        {
            rating: Number,
            review: String
          }
    ]  */// Add reviews field
    reviews: [reviewSchema]
});

module.exports = mongoose.model('Movie', movieSchema);