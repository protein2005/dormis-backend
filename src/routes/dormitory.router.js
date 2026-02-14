const Router = require('express').Router;
const DormitoryController = require('../controllers/dormitory.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const RoomController = require("../controllers/room.controller");

const dormitoryRouter = new Router();

dormitoryRouter.post('/create', authMiddleware, DormitoryController.create);
dormitoryRouter.post('/join', authMiddleware, DormitoryController.join);

dormitoryRouter.get('/my-requests', authMiddleware, DormitoryController.getMyRequests);

dormitoryRouter.get('/:id/rooms', authMiddleware, RoomController.getDormRooms);

dormitoryRouter.post('/:id/rooms', authMiddleware, RoomController.addRoom);

dormitoryRouter.get('/:id/rooms/available', authMiddleware, RoomController.getAvailable);

dormitoryRouter.get('/:id', authMiddleware, DormitoryController.getOne);
dormitoryRouter.get('/:id/members', authMiddleware, DormitoryController.getMembers);

dormitoryRouter.patch('/:id/members', authMiddleware, DormitoryController.updateMember);

dormitoryRouter.patch('/:id/settlement-settings', authMiddleware, DormitoryController.updateSettlementSettings);

dormitoryRouter.post('/:id/settlement-submit', authMiddleware, DormitoryController.submitSettlement);

dormitoryRouter.get('/:id/requests', authMiddleware, DormitoryController.getRequests);

dormitoryRouter.patch('/requests/:requestId/status', authMiddleware, DormitoryController.updateRequestStatus);

module.exports = dormitoryRouter;

module.exports = dormitoryRouter;