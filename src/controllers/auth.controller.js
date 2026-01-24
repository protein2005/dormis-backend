const AuthService = require('../services/auth.service');

class AuthController {
  async register(req, res, next) {
    try {
      const { fullName, email, password, gender } = req.body;
      const data = await AuthService.register(fullName, email, password, gender);

      res.cookie('refreshToken', data.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      res.status(201).json({ user: data.user, accessToken: data.accessToken });
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

      res.status(200).json({ user: data.user, accessToken: data.accessToken });
    } catch (error) {
      next(error);
    }
  }

  async me(req, res, next) {
    try {
      const userData = await AuthService.me(req.user.id);
      res.status(200).json(userData);
    } catch (error) {
      next(error);
    }
  }

  async googleCallback(req, res, next) {
    try {
      const data = await AuthService.googleAuth(req.user);

      res.cookie('refreshToken', data.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      res.redirect(
        `${process.env.CLIENT_URL}/oauth-success?accessToken=${data.accessToken}`
      );
    } catch (e) {
      next(e);
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

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const data = await AuthService.refresh(refreshToken);

      res.cookie('refreshToken', data.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      res.status(200).json({ accessToken: data.accessToken });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();