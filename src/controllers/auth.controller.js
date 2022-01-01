const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

const { User } = require("../models/user.model");
const { getErrorMessage } = require("../helpers/dbErrorHandler");

const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) return res.status("401").json({ error: "User not found" });

    if (!user.authenticate(password)) {
      return res
        .status("401")
        .send({ error: "Email and password don't match." });
    }

    const token = jwt.sign({ _id: user._id }, process.env.MERN_JWT_SECRET);
    res.cookie("t", token, { expire: new Date() + 9999 });
    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status("401").json({ error: "Could not sign in" });
  }
};

const signout = (req, res) => {
  res.clearCookie("t");
  return res.status("200").json({
    message: "signed out",
  });
};

const requiresSignin = expressJwt({
  secret: process.env.MERN_JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth", // if we dont specify this, default is req.user
});

const hasAuthorization = (req, res, next) => {
  const { userId } = req.params;
  const authorized = req.auth && userId && req.auth._id == userId;

  if (!authorized) {
    return res.status("403").json({
      error: "User is not authorized",
    });
  }
  next();
};

module.exports = { signin, signout, requiresSignin, hasAuthorization };
