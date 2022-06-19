const usersRouter = require('express').Router();
const { getCurrentUser, updateCurrentUser } = require('../controllers/users');

usersRouter.get('/me', getCurrentUser);
usersRouter.post('/me', updateCurrentUser);

module.exports = usersRouter;
