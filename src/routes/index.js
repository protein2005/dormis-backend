const Router = require("express").Router;
const authRouter = require("./auth.router.js");
const dormitoryRouter = require("./dormitory.router.js");
const userRouter = require("./user.router.js");

const router = new Router();
router.use("/auth", authRouter);
router.use("/dormitory", dormitoryRouter);
router.use("/user", userRouter)

module.exports = router;