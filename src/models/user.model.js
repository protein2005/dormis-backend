const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  fullName: { type: String, require: true },
  email: { type: String, require: true , unique: true },
  password: { type: String },
  googleId: { type: String },
  avatar: { type: String },
});

module.exports = model("User", userSchema);