import { BedDouble, CalendarCheck, CirclePlus, CreditCard, Hotel, LayoutDashboard, LogOut, Settings, Users } from 'lucide-react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const navigate = useNavigate();
  const signOut = () => {
    localStorage.removeItem('accessToken');
    navigate('/login', { replace: true });
  };

  return (
    <main className="admin-page">
      <header className="admin-header">
        <Link to="/admin" className="admin-brand"><Hotel /> HARBOR <span>HOUSE</span></Link>
        <div><span className="admin-label">ADMIN PORTAL</span><button type="button" className="admin-logout" onClick={signOut}><LogOut /> Log out</button></div>
      </header>
      <div className="admin-layout">
        <aside className="admin-sidebar" aria-label="Admin navigation">
          <p>MANAGEMENT</p>
          <NavLink end to="/admin"><LayoutDashboard /> Overview</NavLink>
          <NavLink to="/admin/bookings"><CalendarCheck /> Hotel bookings</NavLink>
          <NavLink to="/admin/customers"><Users /> Customer visits</NavLink>
          <NavLink end to="/admin/rooms"><BedDouble /> Available rooms</NavLink>
          <NavLink to="/admin/rooms/add"><CirclePlus /> Add room</NavLink>
          <NavLink to="/admin/rooms/manage"><Settings /> Manage rooms</NavLink>
          <NavLink to="/admin/payments"><CreditCard /> Payments</NavLink>
        </aside>
        <Outlet />
      </div>
    </main>
  );
}
