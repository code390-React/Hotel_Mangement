const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    number: { type: Number, required: true, unique: true, min: 1 },
    type: { type: String, required: true, trim: true, maxlength: 80 },
    price: { type: Number, required: true, min: 0 },
    capacity: { type: Number, required: true, min: 1, max: 20, default: 2 },
    status: { type: String, enum: ['active', 'maintenance'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);
