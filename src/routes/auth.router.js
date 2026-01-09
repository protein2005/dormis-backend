const Router = require("express").Router;
const AuthController = require("../controllers/auth.controller.js");

const passport = require("passport");
const authMiddleware = require("../middlewares/auth.middleware.js");
const { registerValidator, loginValidator } = require("../validators/auth.validator.js");
const validationMiddleware = require("../middlewares/validation.middleware.js");
const authRouter = new Router();

authRouter.post(
  "/register",
  registerValidator,
  validationMiddleware,
  AuthController.register
);
authRouter.post(
  "/login",
  loginValidator,
  validationMiddleware,
  AuthController.login);
authRouter.get("/me", authMiddleware, AuthController.me);
authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
authRouter.get('/google/callback', passport.authenticate('google', { session: false }), AuthController.googleCallback);
authRouter.post("/logout", AuthController.logout);
authRouter.get("/refresh", AuthController.refresh);
module.exports = authRouter;