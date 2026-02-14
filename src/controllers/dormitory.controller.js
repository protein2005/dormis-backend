const DormitoryService = require('../services/dormitory.service');
const MembershipService = require('../services/membership.service');
const SettlementService = require('../services/settlement.service');

class DormitoryController {
  async create(req, res, next) {
    try {
      const dorm = await DormitoryService.create(req.user.id, req.body);
      return res.json(dorm);
    } catch (e) { next(e); }
  }

  async getOne(req, res, next) {
    try {
      const dorm = await DormitoryService.getById(req.params.id);
      return res.json(dorm);
    } catch (e) { next(e); }
  }

  async updateSettlementSettings(req, res, next) {
    try {
      const dorm = await DormitoryService.updateSettlementSettings(req.params.id, req.user.id, req.body.settlementFields);
      return res.json(dorm);
    } catch (e) { next(e); }
  }

  async join(req, res, next) {
    try {
      const result = await MembershipService.joinByCode(req.user.id, req.body.inviteCode);
      return res.json(result);
    } catch (e) { next(e); }
  }

  async getMembers(req, res, next) {
    try {
      const members = await MembershipService.getMembers(req.params.id);
      return res.json(members);
    } catch (e) { next(e); }
  }

  async submitSettlement(req, res, next) {
    try {
      const result = await SettlementService.submitRequest(req.user.id, req.params.id, req.body);
      return res.json(result);
    } catch (e) { next(e); }
  }

  async getMyRequests(req, res, next) {
    try {
      const requests = await SettlementService.getMyRequests(req.user.id);
      return res.json(requests);
    } catch (e) { next(e); }
  }

  async getRequests(req, res, next) {
    try {
      const requests = await SettlementService.getDormRequests(req.params.id);
      return res.json(requests);
    } catch (e) { next(e); }
  }

  async updateRequestStatus(req, res, next) {
    try {
      const result = await SettlementService.updateStatus(req.params.requestId, req.user.id, req.body);
      return res.json(result);
    } catch (e) { next(e); }
  }

  async updateMember(req, res, next) {
    try {
      const { membershipId, role, status, roomNumber, comment } = req.body;

      const result = await MembershipService.updateMember(
        req.user.id,
        { membershipId, role, status, roomNumber, comment }
      );

      return res.json(result);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new DormitoryController();