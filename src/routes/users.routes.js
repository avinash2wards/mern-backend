const express = require("express");
const usersController = require("../controllers/users.controller");
const authController = require("../controllers/auth.controller");

const usersRouter = express.Router();

usersRouter.post("/api/users", usersController.create);
usersRouter.get("/api/users", usersController.list);
usersRouter.get(
  "/api/users/:userId",
  authController.requiresSignin,
  usersController.read
);
usersRouter.put(
  "/api/users/:userId",
  authController.requiresSignin,
  authController.hasAuthorization,
  usersController.update
);
usersRouter.delete(
  "/api/users/:userId",
  authController.requiresSignin,
  authController.hasAuthorization,
  usersController.remove
);

module.exports = { usersRouter };
