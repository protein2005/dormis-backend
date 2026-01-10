const { Schema, model } = require('mongoose');

const dormitorySchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String },
  rules: { type: String },
  contacts: {
    phone: { type: String },
    email: { type: String },
    telegram: { type: String }
  },
  inviteCode: { type: String, unique: true },
  joinType: {
    type: String,
    enum: ['CODE', 'WHITELIST', 'MODERATION'],
    default: 'CODE'
  },
  whitelist: [{ type: String }],
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = model("Dormitory", dormitorySchema);