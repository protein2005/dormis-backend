const DormitoryService = require('../services/dormitory.service');

class DormitoryController {
  async create(req, res, next) {
    try {
      const dorm = await DormitoryService.create(req.user.id, req.body);
      return res.json(dorm);
    } catch (e) {
      next(e);
    }
  }

  async join(req, res, next) {
    try {
      const { inviteCode } = req.body;
      const result = await DormitoryService.joinByCode(req.user.id, req.user.email, inviteCode);
      return res.json(result);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new DormitoryController();