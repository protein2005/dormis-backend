const UserService = require('../services/user.service');

class UserController {
  async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const updateData = req.body;
      const updatedUser = await UserService.updateProfile(userId, updateData);
      res.json(updatedUser);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();