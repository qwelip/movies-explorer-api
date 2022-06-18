const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const { auth } = require('./middlewares/auth');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const { login, createUser } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { NotFoundError } = require('./errors/NotFoundError');

const {
  COMMON_ERROR_TEXT,
  NOT_FOUND_PAGE_ERROR_TEXT,
} = require('./constants/constants');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());

app.use(requestLogger);

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/movies', moviesRouter);

app.use('/', (req, res, next) => {
  next(new NotFoundError(NOT_FOUND_PAGE_ERROR_TEXT));
});

app.use(errorLogger);

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(err.statusCode).send({
    message: statusCode === 500 ? COMMON_ERROR_TEXT : message,
  });
  next();
});

async function main() {
  await mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  app.listen(PORT, () => {
    console.log('Server is running');
  });
}

main();
