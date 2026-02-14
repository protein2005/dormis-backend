const Router = require('express').Router;
const UserController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const userRouter = new Router();

userRouter.patch('/profile', authMiddleware, UserController.updateProfile);

module.exports = userRouter;