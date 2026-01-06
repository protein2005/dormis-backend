const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true , unique: true },
  password: { type: String },
  googleId: { type: String },
  avatar: { type: String },
});

module.exports = model("User", userSchema);