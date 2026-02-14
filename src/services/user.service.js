const UserModel = require('../models/user.model');
const ApiError = require('../exceptions/api.error');

class UserService {
  async updateProfile(userId, updateData) {
    const allowedUpdates = ['fullName', 'gender', 'avatar'];
    const filteredData = {};

    Object.keys(updateData).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredData[key] = updateData[key];
      }
    });

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: filteredData },
      { new: true }
    ).select('-password');

    if (!user) {
      throw ApiError.BadRequest('Користувача не знайдено');
    }

    return user;
  }
}

module.exports = new UserService();