import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const API = 'http://localhost:8080/api/rooms';
const EMPTY_ROOM = { number: '', type: '', price: '', capacity: '2', status: 'active' };

export default function AdminRoomForm() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(roomId);
  const [form, setForm] = useState(EMPTY_ROOM);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    fetch(`${API}/${roomId}`).then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.message); return data.room; })
      .then((room) => setForm({ number: String(room.number), type: room.type, price: String(room.price), capacity: String(room.capacity), status: room.status }))
      .catch((error) => setMessage(error.message || 'Could not load room.'));
  }, [isEditing, roomId]);

  const update = ({ target: { name, value } }) => setForm((current) => ({ ...current, [name]: value }));
  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setMessage('');
    try {
      const response = await fetch(isEditing ? `${API}/${roomId}` : API, { method: isEditing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}` }, body: JSON.stringify({ ...form, number: Number(form.number), price: Number(form.price), capacity: Number(form.capacity) }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.message);
      navigate('/admin/rooms', { replace: true });
    } catch (error) { setMessage(error.message || 'Could not save room.'); } finally { setSaving(false); }
  };

  return <section className="admin-content"><section className="admin-bookings admin-room-form-wrap"><div className="admin-list-heading"><div><h1>{isEditing ? 'Edit room' : 'Add room'}</h1><p>{isEditing ? 'Update this room’s details.' : 'Create a room that guests can book.'}</p></div><Link className="admin-secondary-action" to="/admin/rooms">Back to rooms</Link></div><form className="admin-room-form" onSubmit={submit}>{message && <p className="admin-error">{message}</p>}<label>Room number<input required min="1" step="1" type="number" name="number" value={form.number} onChange={update} /></label><label>Room type<input required maxLength="80" name="type" placeholder="e.g. Ocean View Room" value={form.type} onChange={update} /></label><label>Price per night ($)<input required min="0" step="0.01" type="number" name="price" value={form.price} onChange={update} /></label><label>Guest capacity<input required min="1" max="20" step="1" type="number" name="capacity" value={form.capacity} onChange={update} /></label><label>Room status<select name="status" value={form.status} onChange={update}><option value="active">Active / bookable</option><option value="maintenance">Maintenance / unavailable</option></select></label><div className="admin-form-actions"><Link className="admin-secondary-action" to="/admin/rooms">Cancel</Link><button className="admin-primary-action" disabled={saving}>{saving ? 'Saving…' : isEditing ? 'Save changes' : 'Add room'}</button></div></form></section></section>;
}
