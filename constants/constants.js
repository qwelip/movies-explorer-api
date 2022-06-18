const { NODE_ENV, JWT_SECRET } = process.env;

const STATUS_OK = 200;
const SECRET = NODE_ENV === 'production' ? JWT_SECRET : 'SECRET';
const PASSWORD_HASH = 10;
const STATUS_CREATED = 201;

const VALIDATION_ERROR_TEXT = 'Переданы некорректные данные';
const COMMON_ERROR_TEXT = 'Ошибка сервера';
const NOT_FOUND_PAGE_ERROR_TEXT = 'Страница не найдена';
const NOT_FOUND_USER_ERROR_TEXT = 'Пользователь не найден';
const NOT_FOUND_MOVIE_ERROR_TEXT = 'Фильм не найден';
const NOT_VALID_AUTH_ERROR_TEXT = 'Вы ввели некорректную почту или пароль';
const UNIC_CONFLICT_ERROR_TEXT = 'Пользователь с такой почтой уже существует';
const AUTH_REQUIRED_ERROR_TEXT = 'Необходима авторизация';
const ACCESS_DENIED_ERROR_TEXT = 'Нет прав для удаления чужого фильма';

module.exports = {
  VALIDATION_ERROR_TEXT,
  COMMON_ERROR_TEXT,
  NOT_FOUND_PAGE_ERROR_TEXT,
  NOT_VALID_AUTH_ERROR_TEXT,
  UNIC_CONFLICT_ERROR_TEXT,
  NOT_FOUND_USER_ERROR_TEXT,
  NOT_FOUND_MOVIE_ERROR_TEXT,
  ACCESS_DENIED_ERROR_TEXT,
  STATUS_OK,
  SECRET,
  PASSWORD_HASH,
  STATUS_CREATED,
  AUTH_REQUIRED_ERROR_TEXT,
};
