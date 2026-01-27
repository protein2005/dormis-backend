const MembershipModel = require('../models/membership.model');
const DormitoryModel = require('../models/dormitory.model');
const ApiError = require('../exceptions/api.error');

class MembershipService {
  async joinByCode(userId, inviteCode) {
    const dormitory = await DormitoryModel.findOne({ inviteCode });
    if (!dormitory) throw ApiError.BadRequest('Гуртожиток не знайдено'); //

    const existingMembership = await MembershipModel.findOne({
      dormitory: dormitory._id,
      user: userId
    });

    if (existingMembership) {
      throw ApiError.BadRequest('Ви вже є учасником цього гуртожитку'); //
    }

    return await MembershipModel.create({
      user: userId,
      dormitory: dormitory._id,
      role: 'resident',
      status: 'joined'
    }); //
  }

  async getMembers(dormId) {
    return await MembershipModel.find({ dormitory: dormId })
      .populate('user', 'fullName email avatar gender')
      .sort({ role: 1 }); //
  }

  async updateMember(adminId, { membershipId, role, status, roomNumber, comment }) {
    const membership = await MembershipModel.findById(membershipId);
    if (!membership) throw ApiError.BadRequest('Членство не знайдено'); //

    const oldStatus = membership.status;
    if (role) membership.role = role;
    if (status) membership.status = status;
    if (roomNumber) membership.roomNumber = roomNumber;

    membership.logs.push({
      action: status === 'active' ? 'approved' : 'updated',
      admin: adminId,
      comment: comment || 'Дані оновлено',
      prevStatus: oldStatus,
      newStatus: status || oldStatus
    });

    await membership.save();
    return membership;
  }
}

module.exports = new MembershipService();