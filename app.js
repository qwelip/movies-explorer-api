require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');

const { NODE_ENV, DB_ADDRESS } = process.env;
const addressBD = NODE_ENV === 'production' ? DB_ADDRESS : 'mongodb://localhost:27017/moviesdb';

const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const { checkCors } = require('./middlewares/cors');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { NotFoundError } = require('./errors/NotFoundError');

const {
  COMMON_ERROR_TEXT,
  NOT_FOUND_PAGE_ERROR_TEXT,
} = require('./constants/constants');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(checkCors);
app.use(requestLogger);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);

app.use('/users', usersRouter);
app.use('/movies', moviesRouter);

app.use('/', (req, res, next) => {
  next(new NotFoundError(NOT_FOUND_PAGE_ERROR_TEXT));
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(err.statusCode).send({
    message: statusCode === 500 ? COMMON_ERROR_TEXT : message,
  });
  next();
});

async function main() {
  await mongoose.connect(addressBD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  app.listen(PORT, () => {
    console.log('Server is running');
  });
}

main();
