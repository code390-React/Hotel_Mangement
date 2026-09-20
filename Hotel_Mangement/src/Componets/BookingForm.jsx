import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const API = 'http://localhost:8080/api/bookings';

const INITIAL_FORM = {
  guestName: '',
  email: '',
  phone: '',
  roomNumber: '',
  checkIn: '',
  checkOut: '',
  guests: '2',
};

export default function BookingForm({ onBooked }) {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('edit');
  const [form, setForm] = useState(INITIAL_FORM);
  const [rooms, setRooms] = useState([]);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load the current database values when this form is opened for editing.
  useEffect(() => {
    if (!bookingId) return;

    fetch(`${API}/${bookingId}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data.booking;
      })
      .then((booking) => setForm({
        guestName: booking.guestName,
        email: booking.email,
        phone: booking.phone,
        roomNumber: String(booking.roomNumber),
        checkIn: booking.checkIn.slice(0, 10),
        checkOut: booking.checkOut.slice(0, 10),
        guests: String(booking.guests),
      }))
      .catch((error) => setMessage(error.message || 'Could not load this reservation.'));
  }, [bookingId]);

  // Fetch available rooms whenever check-in or check-out dates change
  useEffect(() => {
    if (!form.checkIn || !form.checkOut || form.checkIn >= form.checkOut) {
      return;
    }

    fetch(`${API}/availability?checkIn=${form.checkIn}&checkOut=${form.checkOut}`)
      .then((res) => res.json())
      .then((data) => {
        setRooms(data.rooms || []);
      })
      .catch(() => {
        setMessage('Unable to check availability. Is the backend running?');
      });
  }, [form.checkIn, form.checkOut]);

  const update = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');

    const selectedRoom = rooms.find((room) => room.number === Number(form.roomNumber));
    if (!selectedRoom) {
      return setMessage('Choose dates first, then select an available room.');
    }

    setSubmitting(true);

    try {
      const response = await fetch(bookingId ? `${API}/${bookingId}` : API, {
        method: bookingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          roomType: selectedRoom.type,
          guests: Number(form.guests),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      setMessage(bookingId ? 'updated' : 'confirmed');
      if (!bookingId) {
        setForm(INITIAL_FORM);
        setRooms([]);
      }
      onBooked();
    } catch (error) {
      setMessage(error.message || 'Could not create reservation.');
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="hotel-content booking-page">
      <div className="booking-copy">
        <p className="section-kicker">ONLINE RESERVATION</p>
        <h1>Your harbor escape awaits.</h1>
        <p>Choose your dates and we will show only rooms that are free for your stay.</p>
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=85"
          alt="Hotel lounge"
        />
      </div>

      <form className="booking-form" onSubmit={submit}>
        <h2>{bookingId ? 'Edit your reservation' : 'Book your stay'}</h2>

        {message === 'confirmed' || message === 'updated' ? (
          <div className="success">
            <CheckCircle2 /> {message === 'updated' ? 'Reservation updated.' : 'Reservation confirmed! It now appears in the booking list.'}
          </div>
        ) : (
          message && <div className="form-error">{message}</div>
        )}

        <label>
          Full name
          <input
            required
            name="guestName"
            value={form.guestName}
            onChange={update}
          />
        </label>

        <label>
          Email address
          <input
            required
            type="email"
            name="email"
            value={form.email}
            onChange={update}
          />
        </label>

        <label>
          Phone number
          <input
            name="phone"
            value={form.phone}
            onChange={update}
          />
        </label>

        <div className="form-row">
          <label>
            Check-in
            <input
              required
              type="date"
              name="checkIn"
              min={today}
              value={form.checkIn}
              onChange={update}
            />
          </label>

          <label>
            Check-out
            <input
              required
              type="date"
              name="checkOut"
              min={form.checkIn || today}
              value={form.checkOut}
              onChange={update}
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            Guests
            <select name="guests" value={form.guests} onChange={update}>
              <option value="1">1 guest</option>
              <option value="2">2 guests</option>
              <option value="3">3 guests</option>
              <option value="4">4 guests</option>
            </select>
          </label>

          <label>
            Available room
            <select
              required
              name="roomNumber"
              value={form.roomNumber}
              onChange={update}
            >
              <option value="">Select dates first</option>
              {rooms
                .filter((room) => room.available || room.number === Number(form.roomNumber))
                .map((room) => (
                  <option key={room.number} value={room.number}>
                    Room {room.number} · {room.type} (${room.price})
                  </option>
                ))}
            </select>
          </label>
        </div>

        <button disabled={submitting}>
          {submitting ? 'Saving…' : bookingId ? 'Update reservation' : 'Confirm reservation'}
        </button>
      </form>
    </main>
  );
}
