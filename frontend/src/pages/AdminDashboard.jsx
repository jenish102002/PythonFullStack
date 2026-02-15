import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [price, setPrice] = useState('1000');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user && !user.is_admin) {
            navigate('/');
        }
        fetchAllBookings();
    }, [user, navigate]);

    const fetchAllBookings = async () => {
        try {
            const res = await api.get('/bookings/all');
            setBookings(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateSlot = async (e) => {
        e.preventDefault();
        try {
            await api.post('/slots/', {
                start_time: startTime,
                end_time: endTime,
                price: parseFloat(price)
            });
            setMessage('Slot created successfully!');
            setStartTime('');
            setEndTime('');
        } catch (err) {
            setMessage('Failed to create slot.');
        }
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div style={{ paddingBottom: '4rem' }}>
            <Navbar />

            <div className="container" style={{ marginTop: '3rem' }}>
                {message &&
                    <div className="animate-fade-in" style={{
                        position: 'fixed', bottom: '2rem', right: '2rem',
                        background: 'var(--accent-success)', color: 'white',
                        padding: '1rem 1.5rem', borderRadius: '0.75rem',
                        boxShadow: 'var(--shadow-lg)', zIndex: 100
                    }}>
                        {message}
                    </div>
                }

                <div className="grid grid-cols-3" style={{ alignItems: 'start' }}>
                    {/* Create Slot Section - Takes 1/3 width */}
                    <div className="glass-panel">
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Create New Slot</h3>
                        <form onSubmit={handleCreateSlot}>
                            <div className="form-group">
                                <label className="form-label">Start Time</label>
                                <input
                                    className="form-input"
                                    type="datetime-local"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">End Time</label>
                                <input
                                    className="form-input"
                                    type="datetime-local"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Price (₹)</label>
                                <input
                                    className="form-input"
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Slot</button>
                        </form>
                    </div>

                    {/* All Bookings Section - Takes 2/3 width */}
                    <div style={{ gridColumn: 'span 2' }}>
                        <div className="glass-panel">
                            <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem' }}>Global Bookings</h3>
                                <span className="badge badge-success">{bookings.length} Total</span>
                            </div>

                            <div className="flex flex-col gap-4" style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                {bookings.length === 0 ? <p className="text-secondary">No bookings found.</p> : bookings.map(booking => (
                                    <div key={booking.id} style={{
                                        background: 'rgba(255,255,255,0.03)',
                                        padding: '1rem',
                                        borderRadius: '0.75rem',
                                        border: '1px solid var(--border-glass)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div className="flex items-center gap-4">
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                {booking.user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600' }}>{booking.user.username}</div>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{booking.user.email}</div>
                                            </div>
                                        </div>

                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                                                {new Date(booking.slot.start_time).toLocaleDateString()}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                {new Date(booking.slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                                {new Date(booking.slot.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
