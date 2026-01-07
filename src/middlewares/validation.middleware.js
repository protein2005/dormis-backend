const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api.error');

module.exports = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      ApiError.BadRequest(
        "Помилка валідації",
        errors.array()
      )
    );
  }

  next();
};
