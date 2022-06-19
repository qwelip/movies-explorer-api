const { celebrate, Joi } = require('celebrate');
const moviesRouter = require('express').Router();

const { getSavedMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { URL_REG_STR } = require('../constants/constants');

const urlRegExp = new RegExp(URL_REG_STR);

moviesRouter.get('/', getSavedMovies);

moviesRouter.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(urlRegExp),
    trailerLink: Joi.string().required().pattern(urlRegExp),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required(),
    movieId: Joi.string().required(),
  }),
}), createMovie);

moviesRouter.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi
      .string()
      .required()
      .alphanum()
      .length(24)
      .hex(),
  }),
}), deleteMovie);

module.exports = moviesRouter;
