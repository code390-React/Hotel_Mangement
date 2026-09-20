const express = require('express');
const ensureAuthenticated = require('../middleware/Auth');
const { getRooms, getRoom, createRoom, updateRoom, deleteRoom } = require('../controller/RoomController');

const router = express.Router();

router.get('/', getRooms);
router.get('/:id', getRoom);
router.post('/', ensureAuthenticated, createRoom);
router.put('/:id', ensureAuthenticated, updateRoom);
router.delete('/:id', ensureAuthenticated, deleteRoom);

module.exports = router;
