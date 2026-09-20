import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BedDouble, CalendarDays, Hotel, LogOut, Menu, Users } from 'lucide-react';
import Gallery from './Gallery';
import BookingForm from './BookingForm';
import Reservations from './Reservations';

const API = 'http://localhost:8080/api/bookings';

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      const [roomResponse, bookingResponse] = await Promise.all([
        fetch(`${API}/availability`),
        fetch(API),
      ]);
      const roomData = await roomResponse.json();
      const bookingData = await bookingResponse.json();

      setRooms(roomData.rooms || []);
      setBookings(bookingData.bookings || []);
    } catch {
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialLoad = setTimeout(refreshData, 0);
    return () => clearTimeout(initialLoad);
  }, []);

  const signOut = () => {
    localStorage.removeItem('accessToken');
    navigate('/login', { replace: true });
  };

  const page = location.pathname.includes('book-room')
    ? 'book'
    : location.pathname.includes('reservations')
    ? 'reservations'
    : location.pathname.includes('gallery')
    ? 'gallery'
    : 'home';

  return (
    <div className="hotel-site">
      <header className="site-header">
        <Link to="/dashboard" className="site-logo">
          <Hotel /> HARBOR <span>HOUSE</span>
        </Link>
        <nav>
          <Link to="/dashboard">Home</Link>
          <Link to="/gallery">Rooms</Link>
          <Link to="/reservations">Bookings</Link>
          <Link className="header-cta" to="/book-room">
            Book a room
          </Link>
          <button className="logout-button" onClick={signOut}>
            <LogOut /> Log out
          </button>
        </nav>
        <Menu className="mobile-menu" />
      </header>

      {page === 'home' && (
        <Home rooms={rooms} bookings={bookings} loading={loading} />
      )}
      {page === 'gallery' && <Gallery rooms={rooms} loading={loading} />}
      {page === 'book' && <BookingForm onBooked={refreshData} />}
      {page === 'reservations' && (
        <Reservations bookings={bookings} loading={loading} onChanged={refreshData} />
      )}

      <footer>© 2026 Harbor House Hotel · Your restful stay begins here.</footer>
    </div>
  );
}

function Home({ rooms, bookings, loading }) {
  const available = rooms.filter((room) => room.available).length;

  const stats = useMemo(
    () => [
      {
        icon: <BedDouble />,
        value: loading ? '—' : available,
        label: 'Rooms available now',
      },
      {
        icon: <CalendarDays />,
        value: loading ? '—' : bookings.length,
        label: 'Reservations saved',
      },
      {
        icon: <Users />,
        value: '24/7',
        label: 'Guest support',
      },
    ],
    [available, bookings.length, loading]
  );

  return (
    <>
      <section className="hotel-hero">
        <div>
          <p className="section-kicker">STAY BY THE WATER</p>
          <h1>Where every stay feels like coming home.</h1>
          <p>Coastal calm, thoughtful rooms, and the warmest welcome in the harbor.</p>
          <Link className="hero-button" to="/book-room">
            Find your room
          </Link>
        </div>
      </section>

      <section className="hotel-content stats">
        <p className="section-kicker">LIVE AVAILABILITY</p>
        <h2>Plan your perfect escape</h2>
        <div className="stat-cards">
          {stats.map((stat) => (
            <article key={stat.label}>
              {stat.icon}
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="hotel-content intro">
        <div>
          <p className="section-kicker">OUR HOTEL</p>
          <h2>Unhurried days. Memorable nights.</h2>
        </div>
        <p>
          Choose from bright classic rooms, sea-facing retreats, and spacious
          suites. Bookings are saved instantly, so every guest can see which
          rooms remain available.
        </p>
        <Link to="/gallery">Explore our rooms →</Link>
      </section>
    </>
  );
}
