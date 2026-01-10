const Router = require('express').Router;
const controller = require('../controllers/dormitory.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const dormitoryRouter = new Router();

dormitoryRouter.post('/create', authMiddleware, controller.create);
dormitoryRouter.post('/join', authMiddleware, controller.join);

module.exports = dormitoryRouter;