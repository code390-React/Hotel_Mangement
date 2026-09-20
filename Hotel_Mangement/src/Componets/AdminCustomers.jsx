import { useEffect, useState } from 'react';

const API = 'http://localhost:8080/api/customers';
const formatDate = (date) => new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date));

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => { fetch(API).then(async (response) => {
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    setCustomers(data.customers || []);
  }).catch((requestError) => setError(requestError.message || 'Could not load customers.')); }, []);
  return <section className="admin-content"><section className="admin-bookings"><div className="admin-list-heading"><div><h1>Customer visits</h1><p>Customers who have signed in to the website.</p></div></div>{error && <p className="admin-error">{error}</p>}{!error && customers.length === 0 && <p className="admin-empty">No customer logins have been recorded yet.</p>}{!error && customers.length > 0 && <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Customer</th><th>Email</th><th>Last login</th><th>Account created</th></tr></thead><tbody>{customers.map((customer) => <tr key={customer._id}><td><strong>{customer.name}</strong></td><td>{customer.email}</td><td>{customer.lastLoginAt ? formatDate(customer.lastLoginAt) : 'No login recorded'}</td><td>{customer.createdAt ? formatDate(customer.createdAt) : 'Not available'}</td></tr>)}</tbody></table></div>}</section></section>;
}
