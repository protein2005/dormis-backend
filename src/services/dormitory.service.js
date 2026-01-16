const DormitoryModel = require('../models/dormitory.model');
const MembershipModel = require('../models/membership.model');
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
      $or: [{ user: userId }, { email: userEmail }]
    });

    if (dormitory.joinType === 'WHITELIST') {
      if (!existingMembership) {
        throw ApiError.Forbidden('Вас немає у списку запрошених');
      }
    }

    const status = dormitory.joinType === 'MODERATION' ? 'pending' : 'active';

    if (existingMembership) {
      existingMembership.user = userId;
      existingMembership.status = status;
      await existingMembership.save();
      return existingMembership;
    }

    return await MembershipModel.create({
      user: userId,
      email: userEmail,
      dormitory: dormitory._id,
      status
    });
  }

  async getById(dormId) {
    const dormitory = await DormitoryModel.findById(dormId);
    if (!dormitory) throw ApiError.BadRequest('Гуртожиток не знайдено');
    return dormitory;
  }

  async getMembers(dormId) {
    const members = await MembershipModel.find({ dormitory: dormId })
      .populate('user', 'name email avatar')
      .sort({ role: 1 });
    return members;
  }

  async updateMember(dormId, adminId, { membershipId, role, status }) {
    const requester = await MembershipModel.findOne({ dormitory: dormId, user: adminId });
    if (!requester || (requester.role !== 'owner' && requester.role !== 'admin')) {
      throw ApiError.Forbidden('Недостатньо прав для редагування учасників');
    }

    const membership = await MembershipModel.findById(membershipId);
    if (!membership) throw ApiError.BadRequest('Учасника не знайдено');

    if (membership.role === 'owner') {
      throw ApiError.Forbidden('Неможливо змінити роль власника');
    }

    if (role) membership.role = role;
    if (status) membership.status = status;

    await membership.save();
    return membership;
  }
}

module.exports = new DormitoryService();