import { useEffect, useState } from 'react';
import { BedDouble, Users } from 'lucide-react';

const AVAILABILITY_API = 'http://localhost:8080/api/bookings/availability';

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(AVAILABILITY_API).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setRooms(data.rooms || []);
    }).catch((requestError) => setError(requestError.message || 'Could not load room availability.'));
  }, []);

  const availableRooms = rooms.filter((room) => room.available).length;
  return <section className="admin-content"><section className="admin-bookings"><div className="admin-list-heading"><div><h1>Available rooms</h1><p>{availableRooms} available and {rooms.length - availableRooms} booked today.</p></div></div>{error && <p className="admin-error">{error}</p>}{!error && rooms.length === 0 && <p className="admin-empty">No active rooms have been created yet.</p>}{!error && rooms.length > 0 && <div className="room-status-grid">{rooms.map((room) => <article key={room._id} className={room.available ? 'room-available' : 'room-unavailable'}><BedDouble /><div><strong>Room {room.number}</strong><span>{room.type} · ${room.price}/night</span><span><Users /> {room.capacity} guest{room.capacity === 1 ? '' : 's'}</span></div><b>{room.available ? 'Available' : 'Booked'}</b></article>)}</div>}</section></section>;
}
