import { useEffect, useState } from 'react';
import { CalendarCheck, Hotel, Users } from 'lucide-react';

const BOOKING_API = 'http://localhost:8080/api/bookings';
const CUSTOMER_API = 'http://localhost:8080/api/customers';

export default function AdminOverview() {
  const [data, setData] = useState({ bookings: [], customers: [], rooms: [] });
  const [error, setError] = useState('');
  useEffect(() => { Promise.all([fetch(BOOKING_API), fetch(CUSTOMER_API), fetch(`${BOOKING_API}/availability`)]).then(async (responses) => {
    const results = await Promise.all(responses.map((response) => response.json()));
    if (responses.some((response) => !response.ok)) throw new Error('Could not load overview data.');
    setData({ bookings: results[0].bookings || [], customers: results[1].customers || [], rooms: results[2].rooms || [] });
  }).catch((requestError) => setError(requestError.message)); }, []);
  const confirmed = data.bookings.filter((booking) => booking.status === 'confirmed').length;
  const available = data.rooms.filter((room) => room.available).length;
  return <section className="admin-content"><p className="section-kicker">ADMIN PORTAL</p><h1>Overview</h1><p className="admin-intro">Select a menu item to open its dedicated management page.</p>{error && <p className="admin-error">{error}</p>}<div className="admin-stats"><article><CalendarCheck /><span>Total bookings</span><strong>{data.bookings.length}</strong></article><article><Users /><span>Confirmed stays</span><strong>{confirmed}</strong></article><article><Hotel /><span>Available rooms</span><strong>{available}</strong></article><article><Users /><span>Registered customers</span><strong>{data.customers.length}</strong></article></div></section>;
}
