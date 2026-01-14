const Router = require('express').Router;
const DormitoryController = require('../controllers/dormitory.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const dormitoryRouter = new Router();

dormitoryRouter.post('/create', authMiddleware, DormitoryController.create);
dormitoryRouter.post('/join', authMiddleware, DormitoryController.join);

module.exports = dormitoryRouter;