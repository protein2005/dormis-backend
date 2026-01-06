const ApiError = require('../exceptions/api.error');
const TokenService = require('../services/token.service');

module.exports = function (req, res, next) {
  try {
    const accessToken = req.headers.authorization.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.Unauthorized());
    }
    const userData = TokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.Unauthorized());
    }
    req.user = userData;
    next();
  } catch (e) {
    next(ApiError.Unauthorized());
  }
}