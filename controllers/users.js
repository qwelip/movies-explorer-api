const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const { CommonError } = require('../errors/CommonError');
const { NotFoundError } = require('../errors/NotFoundError');
const { ValidationError } = require('../errors/ValidationError');
const { NotValidAuthError } = require('../errors/NotValidAuthError');
const { UnicConflictError } = require('../errors/UnicConflictError');

const {
  VALIDATION_ERROR_TEXT,
  COMMON_ERROR_TEXT,
  NOT_VALID_AUTH_ERROR_TEXT,
  SECRET,
  PASSWORD_HASH,
  STATUS_CREATED,
  UNIC_CONFLICT_ERROR_TEXT,
  NOT_FOUND_USER_ERROR_TEXT,
} = require('../constants/constants');

function getCurrentUser(req, res, next) {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError(NOT_FOUND_USER_ERROR_TEXT));
        return;
      }
      res.send({ data: user });
    })
    .catch(() => {
      next(new CommonError(COMMON_ERROR_TEXT));
    });
}

function updateCurrentUser(req, res, next) {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(VALIDATION_ERROR_TEXT));
      } if (err.code === 11000) {
        next(new UnicConflictError(UNIC_CONFLICT_ERROR_TEXT));
      } else {
        next(new CommonError(COMMON_ERROR_TEXT));
      }
    });
}

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new NotValidAuthError(NOT_VALID_AUTH_ERROR_TEXT);
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      throw new NotValidAuthError(NOT_VALID_AUTH_ERROR_TEXT);
    }

    const token = jwt.sign({ _id: user._id }, SECRET, { expiresIn: '7d' });
    const resData = { token };
    res.send(resData);
  } catch (err) {
    next(err);
  }
}

function createUser(req, res, next) {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, PASSWORD_HASH)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
      })
        .then((user) => {
          const newUser = user.toObject();
          delete newUser.password;
          res.status(STATUS_CREATED).send({ data: newUser });
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new UnicConflictError(UNIC_CONFLICT_ERROR_TEXT));
            return;
          }
          if (err.name === 'ValidationError') {
            next(new ValidationError(VALIDATION_ERROR_TEXT));
          } else {
            next(new CommonError(COMMON_ERROR_TEXT));
          }
        });
    })
    .catch(() => {
      next(new CommonError(COMMON_ERROR_TEXT));
    });
}

module.exports = {
  getCurrentUser,
  updateCurrentUser,
  login,
  createUser,
};
