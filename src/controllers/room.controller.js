const RoomService = require('../services/room.service');

class RoomController {
  async addRoom(req, res, next) {
    try {
      const { id: dormId } = req.params;
      const roomData = req.body;

      const room = await RoomService.addRoom(dormId, roomData);

      return res.json(room);
    } catch (e) {
      next(e);
    }
  }

  async getDormRooms(req, res, next) {
    try {
      const { id: dormId } = req.params;
      const rooms = await RoomService.getDormRooms(dormId);

      return res.json(rooms);
    } catch (e) {
      next(e);
    }
  }

  async getAvailable(req, res, next) {
    try {
      const { id: dormId } = req.params;
      const { gender } = req.query;

      const rooms = await RoomService.getAvailableRooms(dormId, gender);

      return res.json(rooms);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new RoomController();