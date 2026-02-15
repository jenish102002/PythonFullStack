import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function PaymentHistory() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const endpoint = user?.is_admin ? '/bookings/all' : '/bookings/my';
                const res = await api.get(endpoint);
                // Sort by most recent
                const sorted = res.data.sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date));
                setBookings(sorted);
            } catch (err) {
                console.error('Failed to fetch history', err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchHistory();
    }, [user]);

    return (
        <div style={{ paddingBottom: '4rem' }}>
            <Navbar />
            <div className="container" style={{ marginTop: '3rem' }}>
                <div className="animate-fade-in">
                    <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                        <div>
                            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, #888)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                {user?.is_admin ? 'Global Transaction History' : 'Payment History'}
                            </h1>
                            <p style={{ color: 'var(--text-muted)' }}>
                                {user?.is_admin ? 'Monitor all user bookings and payments.' : 'Track all your box cricket reservations.'}
                            </p>
                        </div>
                        <div className="glass-panel" style={{ padding: '1rem 2rem', textAlign: 'center', minWidth: '200px' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Revenue</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary-color)', textShadow: '0 0 10px rgba(0,255,136,0.3)' }}>
                                ₹{bookings.reduce((sum, b) => sum + b.slot.price, 0).toLocaleString()}
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel">
                        {loading ? (
                            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading history...</div>
                        ) : bookings.length === 0 ? (
                            <div style={{ padding: '4rem', textAlign: 'center' }}>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No payment history found.</p>
                                {!user?.is_admin && <a href="/" className="btn btn-primary">Book a slot now</a>}
                            </div>
                        ) : (
                            <table className="history-table">
                                <thead>
                                    <tr>
                                        <th>BOOKING DATE</th>
                                        {user?.is_admin && <th>CUSTOMER</th>}
                                        <th>SLOT DETAILS</th>
                                        <th>REFERENCE ID</th>
                                        <th>AMOUNT</th>
                                        <th>STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map(booking => (
                                        <tr key={booking.id}>
                                            <td style={{ color: 'white' }}>
                                                <div style={{ fontWeight: '600' }}>{new Date(booking.booking_date).toLocaleDateString()}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(booking.booking_date).toLocaleTimeString()}</div>
                                            </td>
                                            {user?.is_admin && (
                                                <td>
                                                    <div style={{ fontWeight: '500', color: 'var(--secondary-color)' }}>{booking.user.username}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{booking.user.email}</div>
                                                </td>
                                            )}
                                            <td>
                                                <div style={{ color: 'var(--secondary-color)', fontWeight: '500' }}>
                                                    {new Date(booking.slot.start_time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                    {new Date(booking.slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                                    {new Date(booking.slot.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>
                                            <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>#{booking.id}</td>
                                            <td style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>₹{booking.slot.price}</td>
                                            <td><span className="badge badge-success">PAID</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
