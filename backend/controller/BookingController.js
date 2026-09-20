const Booking = require('../model/BookingModel');
const Room = require('../model/RoomModel');

const overlapQuery = (checkIn, checkOut) => ({
  checkIn: { $lt: new Date(checkOut) },
  checkOut: { $gt: new Date(checkIn) },
  status: 'confirmed',
});

const getAvailability = async (req, res) => {
  const { checkIn, checkOut } = req.query;
  if ((checkIn && !checkOut) || (!checkIn && checkOut)) {
    return res.status(400).json({ message: 'Provide both check-in and check-out dates.' });
  }
  if (checkIn && (Number.isNaN(Date.parse(checkIn)) || Number.isNaN(Date.parse(checkOut)))) {
    return res.status(400).json({ message: 'Please provide valid dates.' });
  }
  if (checkIn && new Date(checkIn) >= new Date(checkOut)) {
    return res.status(400).json({ message: 'Check-out must be after check-in.' });
  }

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const availabilityCheckIn = checkIn || today;
  const availabilityCheckOut = checkOut || tomorrow;

  try {
    const [bookings, rooms] = await Promise.all([
      Booking.find(overlapQuery(availabilityCheckIn, availabilityCheckOut)),
      Room.find({ status: 'active' }).sort({ number: 1 }),
    ]);
    const bookedRooms = new Set(bookings.map((booking) => booking.roomNumber));
    res.json({ rooms: rooms.map((room) => ({ ...room.toObject(), available: !bookedRooms.has(room.number) })) });
  } catch {
    res.status(500).json({ message: 'Could not check room availability.' });
  }
};

const getBookings = async (_req, res) => {
  try {
    const bookings = await Booking.find().sort({ checkIn: 1 });
    res.json({ bookings });
  } catch {
    res.status(500).json({ message: 'Could not retrieve bookings.' });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });
    res.json({ booking });
  } catch {
    res.status(400).json({ message: 'Invalid booking id.' });
  }
};

const createBooking = async (req, res) => {
  const { guestName, email, phone, roomType, roomNumber, checkIn, checkOut, guests } = req.body;
  const parsedGuests = Number(guests);
  const parsedRoomNumber = Number(roomNumber);

  if (!guestName || !email || !phone || !roomType || !roomNumber || !checkIn || !checkOut || !guests) {
    return res.status(400).json({ message: 'Please complete all booking details.' });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }
  if (!Number.isInteger(parsedGuests) || parsedGuests < 1 || parsedGuests > 4) {
    return res.status(400).json({ message: 'Guests must be between 1 and 4.' });
  }
  if (Number.isNaN(Date.parse(checkIn)) || Number.isNaN(Date.parse(checkOut)) || new Date(checkIn) >= new Date(checkOut)) {
    return res.status(400).json({ message: 'Check-out must be after check-in.' });
  }

  const room = await Room.findOne({ number: parsedRoomNumber, type: roomType, status: 'active' });
  if (!room) return res.status(400).json({ message: 'Please choose a valid room.' });

  try {
    const alreadyBooked = await Booking.findOne({ roomNumber: parsedRoomNumber, ...overlapQuery(checkIn, checkOut) });
    if (alreadyBooked) {
      return res.status(409).json({ message: 'This room was just booked for those dates. Please choose another room.' });
    }

    const booking = await Booking.create({
      guestName, email, phone, roomType, roomNumber: parsedRoomNumber, checkIn, checkOut, guests: parsedGuests,
    });
    res.status(201).json({ booking, message: 'Your reservation is confirmed.' });
  } catch {
    res.status(500).json({ message: 'Could not create the reservation.' });
  }
};

const updateBooking = async (req, res) => {
  const { guestName, email, phone, roomType, roomNumber, checkIn, checkOut, guests } = req.body;
  const parsedGuests = Number(guests);
  const parsedRoomNumber = Number(roomNumber);

  if (!guestName || !email || !phone || !roomType || !roomNumber || !checkIn || !checkOut || !guests) {
    return res.status(400).json({ message: 'Please complete all booking details.' });
  }
  if (!/^\S+@\S+\.\S+$/.test(email) || !Number.isInteger(parsedGuests) || parsedGuests < 1 || parsedGuests > 4) {
    return res.status(400).json({ message: 'Please provide valid booking details.' });
  }
  if (Number.isNaN(Date.parse(checkIn)) || Number.isNaN(Date.parse(checkOut)) || new Date(checkIn) >= new Date(checkOut)) {
    return res.status(400).json({ message: 'Check-out must be after check-in.' });
  }
  if (!await Room.exists({ number: parsedRoomNumber, type: roomType, status: 'active' })) {
    return res.status(400).json({ message: 'Please choose a valid room.' });
  }

  try {
    const existingBooking = await Booking.findById(req.params.id);
    if (!existingBooking) return res.status(404).json({ message: 'Booking not found.' });

    const alreadyBooked = await Booking.findOne({
      _id: { $ne: existingBooking._id },
      roomNumber: parsedRoomNumber,
      ...overlapQuery(checkIn, checkOut),
    });
    if (alreadyBooked) return res.status(409).json({ message: 'That room is already booked for these dates.' });

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { guestName, email, phone, roomType, roomNumber: parsedRoomNumber, checkIn, checkOut, guests: parsedGuests },
      { new: true, runValidators: true }
    );
    res.json({ booking, message: 'Reservation updated.' });
  } catch {
    res.status(400).json({ message: 'Could not update this booking.' });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });
    res.json({ message: 'Reservation cancelled.' });
  } catch {
    res.status(400).json({ message: 'Could not cancel this booking.' });
  }
};

module.exports = { getAvailability, getBookings, getBookingById, createBooking, updateBooking, deleteBooking };
