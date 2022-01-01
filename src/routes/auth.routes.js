const express = require("express");
const authController = require("../controllers/auth.controller");

const authRouter = express.Router();

authRouter.post("/auth/signin", authController.signin);
authRouter.get("/auth/signout", authController.signout);

module.exports = { authRouter };
