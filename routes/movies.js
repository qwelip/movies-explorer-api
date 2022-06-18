const moviesRouter = require('express').Router();

const { getSavedMovies, createMovie, deleteMovie } = require('../controllers/movies');

moviesRouter.get('/', getSavedMovies);
moviesRouter.post('/', createMovie);
moviesRouter.delete('/:movieId', deleteMovie);

module.exports = moviesRouter;
