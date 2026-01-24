const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true , unique: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
  password: { type: String },
  googleId: { type: String },
  avatar: { type: String },
}, { timestamps: true });

module.exports = model("User", userSchema);