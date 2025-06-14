const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// POST /api/movie/:id/review
router.post('/:id/review', async (req, res) => {
  const { rating, review } = req.body;
  const movieId = req.params.id;

  if (!rating || !review) {
    return res.status(400).json({ message: 'Rating and review are required.' });
  }

  try {
    // Check if movie exists
    let movie = await Movie.findOne({ movieId });
    /* if (!movie) {
      // If not, create a new movie
      movie = new Movie({ movieId, reviews: [] });
    } */

    // Add the new review
    movie.reviews.push({ rating, review });

    await movie.save();

    res.status(201).json({
      message: 'Review added successfully!',
      movie
    });
  } catch (err) {
    console.error('Error saving review:', err);
    res.status(500).json({ message: 'Failed to submit review' });
  }
});

// GET /api/movie/:id/reviews
router.get('/:id/reviews', async (req, res) => {
  const movieId = req.params.id;
  try {
    const movie = await Movie.findOne({ movieId });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie.reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

module.exports = router;
