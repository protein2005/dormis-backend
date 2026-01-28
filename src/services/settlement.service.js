const SettlementRequestModel = require('../models/settlementRequest.model');
const MembershipModel = require('../models/membership.model');
const ApiError = require('../exceptions/api.error');

class SettlementService {
  async submitRequest(userId, dormId, applicationData) {
    const membership = await MembershipModel.findOne({ user: userId, dormitory: dormId });
    if (!membership) throw ApiError.BadRequest('Ви не приєднані до гуртожитку');

    const existingRequest = await SettlementRequestModel.findOne({ user: userId, dormitory: dormId });

    if (existingRequest) {
      if (existingRequest.status === 'approved') {
        throw ApiError.BadRequest('Ваша заявка вже схвалена');
      }

      existingRequest.responses = applicationData.responses;
      existingRequest.files = applicationData.files;
      existingRequest.wishlist = applicationData.wishlist;
      existingRequest.status = 'pending';
      existingRequest.logs.push({
        action: 'resubmitted',
        comment: 'Заявку відредаговано та подано повторно'
      });

      return await existingRequest.save();
    }

    return await SettlementRequestModel.create({
      user: userId,
      dormitory: dormId,
      membership: membership._id,
      responses: applicationData.responses,
      files: applicationData.files,
      wishlist: applicationData.wishlist,
      logs: [{ action: 'submitted', comment: 'Заявку подано' }]
    });
  }

  async getMyRequests(userId) {
    return await SettlementRequestModel.find({ user: userId })
      .populate('dormitory', 'name address')
      .sort({ createdAt: -1 }); //
  }

  async getDormRequests(dormId) {
    return await SettlementRequestModel.find({ dormitory: dormId })
      .populate('user', 'fullName email gender avatar')
      .sort({ createdAt: -1 });
  }

  async updateStatus(requestId, adminId, { status, roomNumber, comment }) {
    const request = await SettlementRequestModel.findById(requestId);
    if (!request) throw ApiError.BadRequest('Заявку не знайдено'); //

    request.status = status;
    if (roomNumber) request.roomNumber = roomNumber;
    request.logs.push({
      action: status,
      admin: adminId,
      comment: comment || `Вас заселено до гуртожитку`
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

module.exports = new SettlementService();