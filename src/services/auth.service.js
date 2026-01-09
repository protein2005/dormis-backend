const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const UserDto = require('../dtos/user.dto');
const TokenService = require('./token.service');
const ApiError = require('../exceptions/api.error');

class AuthService {
  async register(fullName, email, password) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest('Користувач з таким email вже існує');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      fullName,
      email,
      password: hashedPassword
    });

    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest('Користувача не знайдено');
    }

    if (!user.password) {
      throw ApiError.BadRequest('Цей користувач зареєстрований через Google. Використайте вхід через Google.');
    }

    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest('Невірний пароль');
    }

    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async me(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw ApiError.BadRequest('Користувача не знайдено');
    }

    const userDto = new UserDto(user);
    return userDto;
  }

  async googleAuth(user) {
    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDto });

    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto
    };
  }

  async logout(refreshToken) {
    if (!refreshToken) {
      throw ApiError.BadRequest('Refresh token не переданий');
    }

    await TokenService.removeToken(refreshToken);
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.Unauthorized();
    }

    const userData = TokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await TokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw ApiError.Unauthorized();
    }

    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens };
  }
}

module.exports = new AuthService();
