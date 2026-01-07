const { body } = require('express-validator');

exports.registerValidator = [
  body('fullName')
    .isString()
    .isLength({ min: 3 })
    .withMessage("Імʼя повинно містити мінімум 3 символи"),

  body('email')
    .isEmail()
    .withMessage("Некоректний email"),

  body('password')
    .isLength({ min: 6 })
    .withMessage("Пароль мінімум 6 символів")
];

exports.loginValidator = [
  body('email')
    .isEmail()
    .withMessage("Некоректний email"),

  body('password')
    .isLength({ min: 6 })
    .withMessage("Пароль мінімум 6 символів")
];