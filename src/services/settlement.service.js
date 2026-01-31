const SettlementRequestModel = require('../models/settlementRequest.model');
const MembershipModel = require('../models/membership.model');
const RoomModel = require('../models/room.model');
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

  async updateStatus(requestId, adminId, { status, roomId, roomNumber, comment }) {
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
        room: roomId,
        roomNumber: roomNumber
      });

      if (roomId) {
        const room = await RoomModel.findById(roomId);

        if (room) {
          const isAlreadyResident = room.residents.some(id => id.toString() === request.user.toString());

          if (!isAlreadyResident) {
            if (room.residents.length < room.capacity) {
              room.residents.push(request.user);
              await room.save();
            } else {
              throw ApiError.BadRequest(`У кімнаті №${roomNumber} немає вільних місць`);
            }
          }
        }
      }
    }

    return request;
  }
}

module.exports = new SettlementService();