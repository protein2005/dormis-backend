const AuthService = require('../services/auth.service');

class AuthController {
  async register(req, res, next) {
    try {
      const { fullName, email, password } = req.body;
      const data = await AuthService.register(fullName, email, password);

      res.cookie('refreshToken', data.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const data = await AuthService.login(email, password);

      res.cookie('refreshToken', data.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      await AuthService.logout(refreshToken);
      res.clearCookie('refreshToken');
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }

  getAllUsers(req, res) {
    res.json([{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Smith' }]);
  }
}

module.exports = new AuthController();