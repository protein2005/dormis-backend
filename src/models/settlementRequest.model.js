const { Schema, model } = require('mongoose');

const settlementRequestSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dormitory: {
    type: Schema.Types.ObjectId,
    ref: 'Dormitory',
    required: true
  },
  membership: {
    type: Schema.Types.ObjectId,
    ref: 'Membership',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  responses: [{
    fieldName: String,
    value: String
  }],
  files: [{
    fileName: String,
    url: String
  }],
  roomNumber: {
    type: String
  },
  adminComment: {
    type: String
  },
  logs: [{
    action: String,
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

module.exports = model("SettlementRequest", settlementRequestSchema);