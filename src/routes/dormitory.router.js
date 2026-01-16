const Router = require('express').Router;
const DormitoryController = require('../controllers/dormitory.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const dormitoryRouter = new Router();

dormitoryRouter.post('/create', authMiddleware, DormitoryController.create);
dormitoryRouter.post('/join', authMiddleware, DormitoryController.join);

dormitoryRouter.get('/:id', authMiddleware, DormitoryController.getOne);
dormitoryRouter.get('/:id/members', authMiddleware, DormitoryController.getMembers);

dormitoryRouter.patch('/:id/members', authMiddleware, DormitoryController.updateMember);

module.exports = dormitoryRouter;

module.exports = dormitoryRouter;