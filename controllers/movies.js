const Movie = require('../models/Movie');

const {
  STATUS_CREATED,
  COMMON_ERROR_TEXT,
  VALIDATION_ERROR_TEXT,
  NOT_FOUND_MOVIE_ERROR_TEXT,
  ACCESS_DENIED_ERROR_TEXT,
} = require('../constants/constants');

const { ValidationError } = require('../errors/ValidationError');
const { CommonError } = require('../errors/CommonError');
const { NotFoundError } = require('../errors/NotFoundError');
const { AccessDeniedError } = require('../errors/AccessDeniedError');

function getSavedMovies(req, res, next) {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => {
      res.send({ data: movies });
    })
    .catch(() => {
      next(new CommonError(COMMON_ERROR_TEXT));
    });
}

function createMovie(req, res, next) {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    owner,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  })
    .then((movie) => res.status(STATUS_CREATED).send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(VALIDATION_ERROR_TEXT));
      } else {
        next(new CommonError(COMMON_ERROR_TEXT));
      }
    });
}

async function deleteMovie(req, res, next) {
  try {
    const movie = await Movie.findById(req.params.movieId);

    if (!movie) {
      throw new NotFoundError(NOT_FOUND_MOVIE_ERROR_TEXT);
    }

    if (req.user._id !== movie.owner.toString()) {
      throw new AccessDeniedError(ACCESS_DENIED_ERROR_TEXT);
    }

    Movie.findByIdAndRemove(req.params.movieId)
      .then(() => {
        res.send({ data: movie });
      })
      .catch(() => {
        next(new CommonError(COMMON_ERROR_TEXT));
      });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new ValidationError(VALIDATION_ERROR_TEXT));
    }
    next(err);
  }
}

module.exports = {
  getSavedMovies,
  createMovie,
  deleteMovie,
};
