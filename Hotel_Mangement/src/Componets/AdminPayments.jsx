import { useEffect, useState } from 'react';
import { CreditCard } from 'lucide-react';

const API = 'http://localhost:8080/api/bookings';
const ROOM_PRICES = { 'Classic Room': 120, 'Ocean View Room': 185, 'Harbor Suite': 265 };
const formatMoney = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

export default function AdminPayments() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => { fetch(API).then(async (response) => {
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    setBookings(data.bookings || []);
  }).catch((requestError) => setError(requestError.message || 'Could not load payment information.')); }, []);
  const estimatedValue = bookings.filter((booking) => booking.status === 'confirmed').reduce((total, booking) => {
    const nights = Math.max(1, Math.round((new Date(booking.checkOut) - new Date(booking.checkIn)) / 86400000));
    return total + (ROOM_PRICES[booking.roomType] || 0) * nights;
  }, 0);
  return <section className="admin-content"><section className="admin-bookings"><div className="admin-list-heading"><div><h1>Payments</h1><p>Estimated value from confirmed room bookings.</p></div></div>{error && <p className="admin-error">{error}</p>}{!error && <div className="payment-summary"><CreditCard /><div><span>Estimated booking value</span><strong>{formatMoney(estimatedValue)}</strong><p>Payment transactions are not yet recorded in the booking system.</p></div></div>}</section></section>;
}
