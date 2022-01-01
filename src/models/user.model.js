const { Schema, model } = require("mongoose");
const { createHmac } = require("crypto");

// Schema defines how the data looks lik in db
const UserSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: "Name is required",
  },
  email: {
    type: String,
    trim: true,
    unique: "Email already exists",
    required: "Email is required",
    match: [/.@./, "Please fill a valid email address"],
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
  hashed_password: {
    type: String,
    required: "Password is required",
  },
  salt: String,
});

// Virtuals (computed property) are document properties that you can get and set but that do not get persisted to MongoDB
UserSchema.virtual("password")
  .set(function (plainPassword) {
    this._password = plainPassword;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(plainPassword);
  })
  .get(function () {
    return this._password;
  });

// add methods
UserSchema.methods = {
  makeSalt: function () {
    return String(Math.round(new Date().valueOf() * Math.random()));
  },
  encryptPassword: function (plainPassword) {
    if (!plainPassword) return "";
    try {
      return createHmac("sha1", this.salt).update(plainPassword).digest("hex");
    } catch (error) {
      return "";
    }
  },
  authenticate: function (plainPassword) {
    return this.encryptPassword(plainPassword) === this.hashed_password;
  },
};

// model provides the API for programming
const User = model("User", UserSchema);

module.exports = {
  User,
};
