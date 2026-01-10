const Router = require("express").Router;
const authRouter = require("./auth.router.js");
const dormitoryRouter = require("./dormitory.router.js");

const router = new Router();
router.use("/auth", authRouter);
router.use("/dormitory", dormitoryRouter);

module.exports = router;