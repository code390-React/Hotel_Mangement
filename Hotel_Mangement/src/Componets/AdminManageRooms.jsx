import { useEffect, useState } from 'react';
import { BedDouble, Pencil, Trash2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:8080/api/rooms';

export default function AdminManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetch(API).then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.message); setRooms(data.rooms || []); }).catch((requestError) => setError(requestError.message || 'Could not load rooms.')); }, []);
  const removeRoom = async (room) => {
    if (!window.confirm(`Delete room ${room.number}? This cannot be undone.`)) return;
    setDeleting(room._id); setError('');
    try {
      const response = await fetch(`${API}/${room._id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}` } });
      const data = await response.json(); if (!response.ok) throw new Error(data.message);
      setRooms((current) => current.filter((item) => item._id !== room._id));
    } catch (requestError) { setError(requestError.message || 'Could not delete room.'); } finally { setDeleting(''); }
  };

  return <section className="admin-content"><section className="admin-bookings"><div className="admin-list-heading"><div><h1>Manage rooms</h1><p>Edit room details, change status, or remove a room.</p></div></div>{error && <p className="admin-error">{error}</p>}{!error && rooms.length === 0 && <p className="admin-empty">No rooms have been created yet.</p>}{!error && rooms.length > 0 && <div className="room-status-grid">{rooms.map((room) => <article key={room._id} className={room.status === 'active' ? 'room-available' : 'room-unavailable'}><BedDouble /><div><strong>Room {room.number}</strong><span>{room.type} · ${room.price}/night</span><span><Users /> {room.capacity} guest{room.capacity === 1 ? '' : 's'}</span></div><b>{room.status === 'active' ? 'Active' : 'Maintenance'}</b><div className="room-actions"><button type="button" onClick={() => navigate(`/admin/rooms/${room._id}/edit`)}><Pencil /> Edit</button><button type="button" className="delete-room" disabled={deleting === room._id} onClick={() => removeRoom(room)}><Trash2 /> {deleting === room._id ? 'Deleting…' : 'Delete'}</button></div></article>)}</div>}</section></section>;
}
