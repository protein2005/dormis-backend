const { Schema, model } = require('mongoose');

const RoomSchema = new Schema({
  dormitory: { type: Schema.Types.ObjectId, ref: 'Dormitory', required: true },
  roomNumber: { type: String, required: true },
  floor: { type: Number, required: true },
  capacity: { type: Number, required: true },
  gender: {
    type: String,
    enum: ['male', 'female', 'mixed'],
    default: 'mixed'
  },
  residents: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = model('Room', RoomSchema);