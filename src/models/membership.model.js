const { Schema, model } = require('mongoose');

const membershipSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  email: { type: String },
  dormitory: { type: Schema.Types.ObjectId, ref: 'Dormitory', required: true },
  role: { type: String, enum: ['owner', 'admin', 'resident'], default: 'resident' },
  status: { type: String, enum: ['active', 'pending', 'banned'], default: 'active' }
}, { timestamps: true });

module.exports = model("Membership", membershipSchema);