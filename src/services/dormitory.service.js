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

  async getById(dormId) {
    const dormitory = await DormitoryModel.findById(dormId);
    if (!dormitory) throw ApiError.BadRequest('Гуртожиток не знайдено');
    return dormitory;
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
}

module.exports = new DormitoryService();