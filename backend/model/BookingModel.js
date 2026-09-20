const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    guestName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, match: /^\S+@\S+\.\S+$/ },
    phone: { type: String, required: true, trim: true },
    roomType: { type: String, required: true },
    roomNumber: { type: Number, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true, min: 1, max: 4 },
    status: { type: String, default: 'confirmed', enum: ['confirmed', 'cancelled'] },
  },
  { timestamps: true }
);

bookingSchema.index({ roomNumber: 1, checkIn: 1, checkOut: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
