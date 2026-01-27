const DormitoryModel = require('../models/dormitory.model');
const MembershipModel = require('../models/membership.model');
const SettlementRequestModel = require('../models/settlementRequest.model');
const crypto = require('crypto');
const ApiError = require('../exceptions/api.error');

class DormitoryService {
  async create(userId, dormData) {
    const inviteCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    const dormitory = await DormitoryModel.create({
      ...dormData,
      owner: userId,
      inviteCode
    });

    await MembershipModel.create({
      user: userId,
      dormitory: dormitory._id,
      role: 'owner',
      status: 'active'
    });

    if (dormData.whitelist && dormData.whitelist.length > 0) {
      const memberships = dormData.whitelist.map(email => ({
        email,
        dormitory: dormitory._id,
        role: 'resident',
        status: 'active'
      }));
      await MembershipModel.insertMany(memberships);
    }

    return dormitory;
  }

  async joinByCode(userId, userEmail, inviteCode) {
    const dormitory = await DormitoryModel.findOne({ inviteCode });
    if (!dormitory) throw ApiError.BadRequest('Гуртожиток не знайдено');

    const existingMembership = await MembershipModel.findOne({
      dormitory: dormitory._id,
      user: userId
    });

    if (existingMembership) {
      throw ApiError.BadRequest('Ви вже подали заявку або є учасником цього гуртожитку');
    }

    return await MembershipModel.create({
      user: userId,
      dormitory: dormitory._id,
      role: 'resident',
      status: 'joined'
    });
  }

  async getById(dormId) {
    const dormitory = await DormitoryModel.findById(dormId);
    if (!dormitory) throw ApiError.BadRequest('Гуртожиток не знайдено');
    return dormitory;
  }

  async getMembers(dormId) {
    const members = await MembershipModel.find({ dormitory: dormId })
      .populate('user', 'fullName email avatar')
      .sort({ role: 1 });
    return members;
  }

  async updateMember(dormId, adminId, { membershipId, role, status, roomNumber, comment }) {
    const membership = await MembershipModel.findById(membershipId);
    if (!membership) throw ApiError.BadRequest('Членство не знайдено');

    const oldStatus = membership.status;

    if (role) membership.role = role;
    if (status) membership.status = status;
    if (roomNumber) membership.roomNumber = roomNumber;

    const logEntry = {
      action: status === 'active' ? 'approved' : status === 'rejected' ? 'rejected' : 'updated',
      admin: adminId,
      comment: comment || (status === 'active' ? 'Заявку схвалено' : 'Дані оновлено'),
      prevStatus: oldStatus,
      newStatus: status || oldStatus
    };

    membership.logs.push(logEntry);
    await membership.save();

    return MembershipModel.findById(membershipId).populate('user').populate('logs.admin', 'name email');
  }

  async updateSettlementSettings(dormId, userId, settlementFields) {
    const dormitory = await DormitoryModel.findById(dormId);

    if (!dormitory) {
      throw ApiError.BadRequest('Гуртожиток не знайдено');
    }

    if (dormitory.owner.toString() !== userId) {
      throw ApiError.Forbidden('Тільки власник може змінювати налаштування поселення');
    }

    dormitory.settlementFields = settlementFields;
    await dormitory.save();

    return dormitory;
  }

  async submitSettlement(userId, dormId, applicationData) {
    const membership = await MembershipModel.findOne({ user: userId, dormitory: dormId });
    if (!membership) throw ApiError.BadRequest('Ви не приєднані до цього гуртожитку');

    const request = await SettlementRequestModel.create({
      user: userId,
      dormitory: dormId,
      membership: membership._id,
      responses: applicationData.responses,
      files: applicationData.files,
      logs: [{ action: 'submitted', comment: 'Заявку подано' }]
    });

    return request;
  }

  async approveSettlement(requestId, adminId, { roomNumber, comment }) {
    const request = await SettlementRequestModel.findById(requestId);
    if (!request) throw ApiError.BadRequest('Заявку не знайдено');

    request.status = 'approved';
    request.roomNumber = roomNumber;
    request.logs.push({ action: 'approved', admin: adminId, comment });
    await request.save();

    await MembershipModel.findByIdAndUpdate(request.membership, {
      status: 'active',
      roomNumber: roomNumber
    });

    return request;
  }

  async getUserRequests(userId) {
    return await SettlementRequestModel.find({ user: userId })
      .populate('dormitory', 'name address')
      .sort({ createdAt: -1 });
  }

  async getSettlementRequests(dormId) {
    return await SettlementRequestModel.find({ dormitory: dormId })
      .populate('user', 'fullName email gender avatar')
      .sort({ createdAt: -1 });
  }

  async updateSettlementStatus(requestId, adminId, { status, roomNumber, comment }) {
    const request = await SettlementRequestModel.findById(requestId);
    if (!request) throw ApiError.BadRequest('Заявку не знайдено');

    request.status = status;
    if (roomNumber) request.roomNumber = roomNumber;

    request.logs.push({
      action: status,
      admin: adminId,
      comment: comment || `Статус змінено на ${status}`
    });

    await request.save();

    if (status === 'approved') {
      await MembershipModel.findByIdAndUpdate(request.membership, {
        status: 'active',
        roomNumber: roomNumber
      });
    }

    return request;
  }
}

module.exports = new DormitoryService();