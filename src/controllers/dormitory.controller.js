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

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const dorm = await DormitoryService.getById(id);
      return res.json(dorm);
    } catch (e) {
      next(e);
    }
  }

  async getMembers(req, res, next) {
    try {
      const { id } = req.params;
      const members = await DormitoryService.getMembers(id);
      return res.json(members);
    } catch (e) {
      next(e);
    }
  }

  async updateMember(req, res, next) {
    try {
      const { id } = req.params;
      const result = await DormitoryService.updateMember(id, req.user.id, req.body);
      return res.json(result);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new DormitoryController();