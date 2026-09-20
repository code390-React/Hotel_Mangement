import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';

const API = 'http://localhost:8080/api/bookings';
const formatDate = (date) => new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date));

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  useEffect(() => { fetch(API).then(async (response) => {
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    setBookings(data.bookings || []);
  }).catch((requestError) => setError(requestError.message || 'Could not load bookings.')); }, []);
  const filteredBookings = useMemo(() => {
    const query = search.toLowerCase().trim();
    return query ? bookings.filter((booking) => [booking.guestName, booking.email, booking.phone, booking.roomType, booking.roomNumber].join(' ').toLowerCase().includes(query)) : bookings;
  }, [bookings, search]);
  return <section className="admin-content"><section className="admin-bookings"><div className="admin-list-heading"><div><h1>Hotel bookings</h1><p>{filteredBookings.length} booking{filteredBookings.length === 1 ? '' : 's'} shown</p></div><label className="admin-search"><Search /><span className="sr-only">Search bookings</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search guest, room, email…" /></label></div>{error && <p className="admin-error">{error}</p>}{!error && filteredBookings.length === 0 && <p className="admin-empty">No bookings found.</p>}{!error && filteredBookings.length > 0 && <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Guest</th><th>Contact</th><th>Room</th><th>Stay</th><th>Guests</th><th>Status</th></tr></thead><tbody>{filteredBookings.map((booking) => <tr key={booking._id}><td><strong>{booking.guestName}</strong></td><td><span>{booking.email}</span><small>{booking.phone}</small></td><td><strong>{booking.roomType}</strong><small>Room {booking.roomNumber}</small></td><td>{formatDate(booking.checkIn)}<small>to {formatDate(booking.checkOut)}</small></td><td>{booking.guests}</td><td><b className={`admin-status ${booking.status}`}>{booking.status}</b></td></tr>)}</tbody></table></div>}</section></section>;
}
