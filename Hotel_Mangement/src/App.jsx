import './App.css';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';

import Login from './Componets/Login';
import Register from './Componets/Register';
import Dashboard from './Componets/Dashboard';
import AdminLayout from './Componets/AdminLayout';
import AdminOverview from './Componets/AdminOverview';
import AdminBookings from './Componets/AdminBookings';
import AdminCustomers from './Componets/AdminCustomers';
import AdminRooms from './Componets/AdminRooms';
import AdminRoomForm from './Componets/AdminRoomForm';
import AdminManageRooms from './Componets/AdminManageRooms';
import AdminPayments from './Componets/AdminPayments';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/gallery" element={<Dashboard />} />
        <Route path="/book-room" element={<Dashboard />} />
        <Route path="/reservations" element={<Dashboard />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="rooms" element={<AdminRooms />} />
          <Route path="rooms/add" element={<AdminRoomForm />} />
          <Route path="rooms/manage" element={<AdminManageRooms />} />
          <Route path="rooms/:roomId/edit" element={<AdminRoomForm />} />
          <Route path="payments" element={<AdminPayments />} />
        </Route>
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
