const { extend } = require("lodash");
const { User } = require("../models/user.model");
const { getErrorMessage } = require("../helpers/dbErrorHandler");

const create = async (req, res, next) => {
  const user = new User(req.body);
  try {
    await user.save();
    return res.status(201).json({
      message: "Successfully signed up!",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: getErrorMessage(error),
    });
  }
};

const list = async (req, res) => {
  try {
    let users = await User.find().select("name email updated created");
    // console.log(users);
    return res.json(users);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: getErrorMessage(error),
    });
  }
};

const read = async (req, res) => {
  const { userId } = req.params;
  try {
    let user = await User.findById(userId).select("name email updated created");

    if (!user)
      return res.status(400).json({
        error: "User not found",
      });

    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Could not retrieve user",
    });
  }
};
const update = async (req, res, next) => {
  const { userId } = req.params;
  try {
    let user = await User.findById(userId);
    user = extend(user, req.body);
    user.updated = Date.now();
    await user.save();
    user.hashed_password = undefined;
    user.salt = undefined;
    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const remove = async (req, res, next) => {
  const { userId } = req.params;
  try {
    let user = await User.findById(userId);
    let deletedUser = await user.remove();
    deletedUser.hashed_password = undefined;
    deletedUser.salt = undefined;
    res.json(deletedUser);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

module.exports = { create, list, read, update, remove };
