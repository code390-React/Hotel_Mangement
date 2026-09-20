const Room = require('../model/RoomModel');
const Booking = require('../model/BookingModel');

const roomValues = (body) => ({
  number: Number(body.number),
  type: String(body.type || '').trim(),
  price: Number(body.price),
  capacity: Number(body.capacity),
  status: body.status,
});

const validateRoom = (room) => {
  if (!Number.isInteger(room.number) || room.number < 1) return 'Room number must be a positive whole number.';
  if (!room.type) return 'Room type is required.';
  if (!Number.isFinite(room.price) || room.price < 0) return 'Nightly price must be zero or more.';
  if (!Number.isInteger(room.capacity) || room.capacity < 1 || room.capacity > 20) return 'Capacity must be between 1 and 20.';
  if (!['active', 'maintenance'].includes(room.status)) return 'Choose a valid room status.';
  return null;
};

const getRooms = async (_req, res) => {
  try {
    res.json({ rooms: await Room.find().sort({ number: 1 }) });
  } catch {
    res.status(500).json({ message: 'Could not retrieve rooms.' });
  }
};

const getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found.' });
    res.json({ room });
  } catch {
    res.status(400).json({ message: 'Invalid room id.' });
  }
};

const createRoom = async (req, res) => {
  const room = roomValues(req.body);
  const validationError = validateRoom(room);
  if (validationError) return res.status(400).json({ message: validationError });
  try {
    const createdRoom = await Room.create(room);
    res.status(201).json({ room: createdRoom, message: 'Room added.' });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'That room number already exists.' });
    res.status(500).json({ message: 'Could not add room.' });
  }
};

const updateRoom = async (req, res) => {
  const room = roomValues(req.body);
  const validationError = validateRoom(room);
  if (validationError) return res.status(400).json({ message: validationError });
  try {
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, room, { new: true, runValidators: true });
    if (!updatedRoom) return res.status(404).json({ message: 'Room not found.' });
    res.json({ room: updatedRoom, message: 'Room updated.' });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'That room number already exists.' });
    res.status(400).json({ message: 'Could not update room.' });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found.' });
    const hasFutureBooking = await Booking.exists({ roomNumber: room.number, status: 'confirmed', checkOut: { $gt: new Date() } });
    if (hasFutureBooking) return res.status(409).json({ message: 'This room has an active booking and cannot be deleted.' });
    await room.deleteOne();
    res.json({ message: 'Room deleted.' });
  } catch {
    res.status(400).json({ message: 'Could not delete room.' });
  }
};

module.exports = { getRooms, getRoom, createRoom, updateRoom, deleteRoom };
