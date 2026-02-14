const MembershipModel = require('../models/membership.model');
const ApiError = require('../exceptions/api.error');

module.exports = function(roles) {
  return async function(req, res, next) {
    try {
      const { dormId } = req.params;
      const membership = await MembershipModel.findOne({ user: req.user.id, dormitory: dormId });

      if (!membership || !roles.includes(membership.role)) {
        return next(ApiError.Forbidden('Недостатньо прав'));
      }

      next();
    } catch (e) {
      return next(ApiError.Forbidden('Помилка доступу'));
    }
  }
}