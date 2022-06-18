const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator() {
        // return urlRegExp.test(str); todo
      },
      message: 'Введите корректную ссылку',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    // validate: {
    //   validator() {
    //     return urlRegExp.test(str); todo
    //   },
    //   message: 'Введите корректную ссылку',
    // },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator() {
        // return urlRegExp.test(str); todo
      },
      message: 'Введите корректную ссылку',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
