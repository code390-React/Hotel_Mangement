import { useEffect, useMemo, useState } from 'react';
import { BedDouble, CalendarCheck, CreditCard, Hotel, LayoutDashboard, LogOut, Search, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const BOOKING_API = 'http://localhost:8080/api/bookings';
const CUSTOMER_API = 'http://localhost:8080/api/customers';
const ROOM_PRICES = { 'Classic Room': 120, 'Ocean View Room': 185, 'Harbor Suite': 265 };
const formatDate = (date) => new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date));
const formatMoney = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [bookingResponse, customerResponse, roomResponse] = await Promise.all([fetch(BOOKING_API), fetch(CUSTOMER_API), fetch(`${BOOKING_API}/availability`)]);
        const [bookingData, customerData, roomData] = await Promise.all([bookingResponse.json(), customerResponse.json(), roomResponse.json()]);
        if (!bookingResponse.ok) throw new Error(bookingData.message || 'Could not load bookings.');
        if (!customerResponse.ok) throw new Error(customerData.message || 'Could not load customers.');
        if (!roomResponse.ok) throw new Error(roomData.message || 'Could not load room availability.');
        setBookings(bookingData.bookings || []);
        setCustomers(customerData.customers || []);
        setRooms(roomData.rooms || []);
      } catch (requestError) {
        setError(requestError.message || 'Could not load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return bookings;
    return bookings.filter((booking) => [booking.guestName, booking.email, booking.phone, booking.roomType, booking.roomNumber].join(' ').toLowerCase().includes(query));
  }, [bookings, search]);

  const confirmed = bookings.filter((booking) => booking.status === 'confirmed');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const arrivalsToday = confirmed.filter((booking) => new Date(booking.checkIn).setHours(0, 0, 0, 0) === today.getTime()).length;
  const availableRooms = rooms.filter((room) => room.available);
  const estimatedBookingValue = confirmed.reduce((total, booking) => {
    const nights = Math.max(1, Math.round((new Date(booking.checkOut) - new Date(booking.checkIn)) / 86400000));
    return total + (ROOM_PRICES[booking.roomType] || 0) * nights;
  }, 0);

  const signOut = () => {
    localStorage.removeItem('accessToken');
    navigate('/login', { replace: true });
  };

  return (
    <main className="admin-page">
      <header className="admin-header"><Link to="/admin" className="admin-brand"><Hotel /> HARBOR <span>HOUSE</span></Link><div><span className="admin-label">ADMIN PORTAL</span><button type="button" className="admin-logout" onClick={signOut}><LogOut /> Log out</button></div></header>
      <div className="admin-layout">
        <aside className="admin-sidebar" aria-label="Admin navigation"><p>MANAGEMENT</p><a href="#overview"><LayoutDashboard /> Overview</a><a href="#hotel-bookings"><CalendarCheck /> Hotel bookings</a><a href="#customer-visits"><Users /> Customer visits</a><a href="#available-rooms"><BedDouble /> Available rooms</a><a href="#payments"><CreditCard /> Payments</a></aside>
        <section className="admin-content">
          <section id="overview" className="admin-section"><p className="section-kicker">BOOKING MANAGEMENT</p><h1>Hotel dashboard</h1><p className="admin-intro">Choose a section from the menu to manage hotel information.</p><div className="admin-stats"><article><CalendarCheck /><span>Total bookings</span><strong>{loading ? '—' : bookings.length}</strong></article><article><Users /><span>Confirmed stays</span><strong>{loading ? '—' : confirmed.length}</strong></article><article><Hotel /><span>Arrivals today</span><strong>{loading ? '—' : arrivalsToday}</strong></article><article><Users /><span>Registered customers</span><strong>{loading ? '—' : customers.length}</strong></article></div></section>
          {error && <p className="admin-error">{error}</p>}
          <section id="hotel-bookings" className="admin-bookings admin-section"><div className="admin-list-heading"><div><h2>Hotel bookings</h2><p>{loading ? 'Loading bookings…' : `${filteredBookings.length} booking${filteredBookings.length === 1 ? '' : 's'} shown`}</p></div><label className="admin-search"><Search /><span className="sr-only">Search bookings</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search guest, room, email…" /></label></div>{!loading && !error && filteredBookings.length === 0 && <p className="admin-empty">No bookings match your search.</p>}{!error && filteredBookings.length > 0 && <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Guest</th><th>Contact</th><th>Room</th><th>Stay</th><th>Guests</th><th>Status</th></tr></thead><tbody>{filteredBookings.map((booking) => <tr key={booking._id}><td><strong>{booking.guestName}</strong></td><td><span>{booking.email}</span><small>{booking.phone}</small></td><td><strong>{booking.roomType}</strong><small>Room {booking.roomNumber}</small></td><td>{formatDate(booking.checkIn)}<small>to {formatDate(booking.checkOut)}</small></td><td>{booking.guests}</td><td><b className={`admin-status ${booking.status}`}>{booking.status}</b></td></tr>)}</tbody></table></div>}</section>
          <section id="customer-visits" className="admin-bookings admin-section"><div className="admin-list-heading"><div><h2>Customer visits</h2><p>Customers who have signed in to the website.</p></div></div>{!loading && !error && customers.length === 0 && <p className="admin-empty">No customer logins have been recorded yet.</p>}{!error && customers.length > 0 && <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Customer</th><th>Email</th><th>Last login</th><th>Account created</th></tr></thead><tbody>{customers.map((customer) => <tr key={customer._id}><td><strong>{customer.name}</strong></td><td>{customer.email}</td><td>{customer.lastLoginAt ? formatDate(customer.lastLoginAt) : 'No login recorded'}</td><td>{customer.createdAt ? formatDate(customer.createdAt) : 'Not available'}</td></tr>)}</tbody></table></div>}</section>
          <section id="available-rooms" className="admin-bookings admin-section"><div className="admin-list-heading"><div><h2>Available rooms</h2><p>{loading ? 'Loading rooms…' : `${availableRooms.length} of ${rooms.length} rooms currently available`}</p></div></div>{!error && <div className="room-status-grid">{rooms.map((room) => <article key={room.number} className={room.available ? 'room-available' : 'room-unavailable'}><BedDouble /><div><strong>Room {room.number}</strong><span>{room.type}</span></div><b>{room.available ? 'Available' : 'Booked'}</b></article>)}</div>}</section>
          <section id="payments" className="admin-bookings admin-section"><div className="admin-list-heading"><div><h2>Payments</h2><p>Estimated value from confirmed room bookings.</p></div></div><div className="payment-summary"><CreditCard /><div><span>Estimated booking value</span><strong>{loading ? '—' : formatMoney(estimatedBookingValue)}</strong><p>Payment transactions are not yet recorded in the booking system.</p></div></div></section>
        </section>
      </div>
    </main>
  );
}
