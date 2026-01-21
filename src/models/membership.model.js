const { Schema, model } = require('mongoose');

const membershipSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  dormitory: {
    type: Schema.Types.ObjectId,
    ref: 'Dormitory',
    required: true
  },
  role: {
    type: String,
    enum: ['owner', 'admin', 'resident'],
    default: 'resident'
  },
  status: {
    type: String,
    enum: ['joined', 'active', 'banned'],
    default: 'joined'
  },
  roomNumber: {
    type: String
  },
}, { timestamps: true });

module.exports = model("Membership", membershipSchema);