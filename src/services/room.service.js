const RoomModel = require('../models/room.model');
const ApiError = require('../exceptions/api.error');

class RoomService {
  async addRoom(dormId, roomData) {
    const existingRoom = await RoomModel.findOne({ dormitory: dormId, roomNumber: roomData.roomNumber });
    if (existingRoom) {
      throw ApiError.BadRequest(`Кімната ${roomData.roomNumber} вже існує`);
    }

    return await RoomModel.create({
      dormitory: dormId,
      ...roomData
    });
  }

  async getDormRooms(dormId) {
    return await RoomModel.find({ dormitory: dormId }).populate('residents', 'fullName avatar gender');
  }

  async getAvailableRooms(dormId, gender) {
    return await RoomModel.find({
      dormitory: dormId,
      $and: [
        { $or: [{ gender: gender }, { gender: 'mixed' }] },
        { $expr: { $lt: [{ $size: "$residents" }, "$capacity"] } }
      ]
    });
  }
}

module.exports = new RoomService();