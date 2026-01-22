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
      const { membershipId, role, status, roomNumber, comment } = req.body;

      const result = await DormitoryService.updateMember(
        id,
        req.user.id,
        { membershipId, role, status, roomNumber, comment }
      );
      return res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async updateSettlementSettings(req, res, next) {
    try {
      const { id } = req.params;
      const { settlementFields } = req.body;

      const dorm = await DormitoryService.updateSettlementSettings(id, req.user.id, settlementFields);
      return res.json(dorm);
    } catch (e) {
      next(e);
    }
  }

  async submitSettlement(req, res, next) {
    try {
      const { id } = req.params;
      const result = await DormitoryService.submitSettlement(req.user.id, id, req.body);
      return res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async getMyRequests(req, res, next) {
    try {
      const requests = await DormitoryService.getUserRequests(req.user.id);
      return res.json(requests);
    } catch (e) {
      next(e);
    }
  }

  async getRequests(req, res, next) {
    try {
      const { id } = req.params;
      const requests = await DormitoryService.getSettlementRequests(id);
      return res.json(requests);
    } catch (e) {
      next(e);
    }
  }

  async updateRequestStatus(req, res, next) {
    try {
      const { requestId } = req.params;
      const { status, roomNumber, comment } = req.body;
      const result = await DormitoryService.updateSettlementStatus(
        requestId,
        req.user.id,
        { status, roomNumber, comment }
      );
      return res.json(result);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new DormitoryController();