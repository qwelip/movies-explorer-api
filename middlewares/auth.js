const jwt = require('jsonwebtoken');
const { NotValidAuthError } = require('../errors/NotValidAuthError');
const { SECRET, AUTH_REQUIRED_ERROR_TEXT } = require('../constants/constants');

function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new NotValidAuthError(AUTH_REQUIRED_ERROR_TEXT));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, SECRET);
  } catch (error) {
    next(new NotValidAuthError(AUTH_REQUIRED_ERROR_TEXT));
  }
  req.user = payload;
  next();
}

module.exports = {
  auth,
};
