const { Schema, model } = require('mongoose');

const dormitorySchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String },
  rules: { type: String },
  imageUrl: { type: String },
  files: [{ name: String, url: String }],
  contacts: { phone: String, email: String, telegram: String },
  inviteCode: { type: String, unique: true },
  settlementFields: {
    inputs: [{
      name: String,
      label: String,
      required: { type: Boolean, default: true }
    }],
    requiredFiles: [{
      name: String,
      label: String,
      required: { type: Boolean, default: true }
    }]
  },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = model("Dormitory", dormitorySchema);