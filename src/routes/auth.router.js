const Router = require("express").Router;
const AuthController = require("../controllers/auth.controller.js");

const passport = require("passport");
const authMiddleware = require("../middlewares/auth.middleware.js");
const authRouter = new Router();

authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);
authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
authRouter.get('/google/callback', passport.authenticate('google', { session: false }), AuthController.googleCallback);
authRouter.post("/logout", AuthController.logout);
authRouter.get("/refresh", AuthController.refresh);
module.exports = authRouter;