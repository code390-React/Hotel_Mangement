import { useNavigate } from 'react-router-dom';
import './Reservations.css';

const API = 'http://localhost:8080/api/bookings';

export default function Reservations({ bookings, loading, onChanged }) {
  const navigate = useNavigate();

  const cancelBooking = async (booking) => {
    if (!window.confirm(`Are you sure you want to cancel the reservation for ${booking.guestName}?`)) return;

    try {
      const response = await fetch(`${API}/${booking._id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      onChanged();
    } catch (error) {
      window.alert(error.message || 'Could not cancel this reservation.');
    }
  };

  return (
    <main className="hotel-content reservation-page">
      <p className="section-kicker">SHARED BOOKING BOARD</p>
      <h1>Room availability at a glance.</h1>
      <p className="lead">Every confirmed reservation is stored in MongoDB and shown here, keeping rooms from being double booked.</p>
      <div className="reservation-table">
        <div className="table-head"><span>Guest</span><span>Room</span><span>Stay</span><span>Status</span><span>Actions</span></div>
        {loading ? <p>Loading reservations...</p> : bookings.length === 0 ? <p>No reservations yet. Be the first to plan a stay.</p> : (
          bookings.map((booking) => (
            <div className="table-row" key={booking._id}>
              <strong>{booking.guestName}<small>{booking.email}</small></strong>
              <span>{booking.roomType}<small>Room {booking.roomNumber}</small></span>
              <span>{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</span>
              <b>{booking.status}</b>
              <div className="booking-actions">
                <button type="button" className="edit-booking" onClick={() => navigate(`/book-room?edit=${booking._id}`)}>Edit</button>
                <button type="button" className="cancel-booking" onClick={() => cancelBooking(booking)}>Cancel</button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}
