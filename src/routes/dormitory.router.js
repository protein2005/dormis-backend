const Router = require('express').Router;
const DormitoryController = require('../controllers/dormitory.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const dormitoryRouter = new Router();

dormitoryRouter.post('/create', authMiddleware, DormitoryController.create);
dormitoryRouter.post('/join', authMiddleware, DormitoryController.join);

dormitoryRouter.get('/:id', authMiddleware, DormitoryController.getOne);
dormitoryRouter.get('/:id/members', authMiddleware, DormitoryController.getMembers);

dormitoryRouter.patch('/:id/members', authMiddleware, DormitoryController.updateMember);

dormitoryRouter.patch('/:id/settlement-settings', authMiddleware, DormitoryController.updateSettlementSettings);

dormitoryRouter.post('/:id/settlement-submit', authMiddleware, DormitoryController.submitSettlement);

dormitoryRouter.get('/:id/requests', authMiddleware, DormitoryController.getRequests);

dormitoryRouter.patch('/requests/:requestId/status', authMiddleware, DormitoryController.updateRequestStatus);

module.exports = dormitoryRouter;

module.exports = dormitoryRouter;