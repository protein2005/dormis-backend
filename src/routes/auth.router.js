const Router = require("express").Router;
const AuthController = require("../controllers/auth.controller.js");

const authMiddleware = require("../middlewares/auth.middleware.js");
const authRouter = new Router();

authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);
authRouter.post("/logout", AuthController.logout);
authRouter.get("/refresh", AuthController.refresh);
module.exports = authRouter;