import { Link } from 'react-router-dom';
import { BedDouble, Users } from 'lucide-react';

const ROOM_IMAGES = {
  'Classic Room': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85',
  'Ocean View Room': 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=85',
  'Harbor Suite': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=85',
};

// Helper: groups rooms by type and counts available ones
function groupRoomsByType(rooms = []) {
  const grouped = rooms.reduce((acc, room) => {
    if (!acc[room.type]) {
      acc[room.type] = { ...room, availableCount: 0 };
    }
    if (room.available) {
      acc[room.type].availableCount += 1;
    }
    return acc;
  }, {});

  return Object.values(grouped);
}

export default function Gallery({ rooms = [], loading }) {
  const roomTypes = groupRoomsByType(rooms);

  return (
    <main className="hotel-content gallery-page">
      <p className="section-kicker">ROOMS & SUITES</p>
      <h1>Make yourself at home.</h1>
      <p className="lead">
        Each room has been designed for slow mornings, deep rest, and a beautiful view.
      </p>

      <div className="room-grid">
        {roomTypes.map((room) => (
          <RoomCard key={room.type} room={room} loading={loading} />
        ))}
      </div>
    </main>
  );
}

function RoomCard({ room, loading }) {
  const isAvailable = Boolean(room.availableCount);
  const availabilityText = loading
    ? 'Checking availability...'
    : `${room.availableCount} room${room.availableCount === 1 ? '' : 's'} available`;

  return (
    <article className="room-card">
      <img src={ROOM_IMAGES[room.type]} alt={room.type} />

      <div className="room-card-body">
        <div>
          <h2>{room.type}</h2>
          <p>
            <Users /> Up to 2 guests <BedDouble /> Room {room.number}
          </p>
        </div>

        <strong>
          ${room.price}
          <small> / night</small>
        </strong>

        <span className={isAvailable ? 'available' : 'unavailable'}>
          {availabilityText}
        </span>

        <Link to="/book-room">Reserve this room →</Link>
      </div>
    </article>
  );
}