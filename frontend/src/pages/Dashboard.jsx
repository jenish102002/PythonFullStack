import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import HeroSection from '../components/HeroSection';
import Navbar from '../components/Navbar';

export default function Dashboard() {
    const { user } = useAuth();
    const [slots, setSlots] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSlots();
        fetchMyBookings();
    }, []);

    const fetchSlots = async () => {
        try {
            const res = await api.get('/slots/');
            setSlots(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMyBookings = async () => {
        try {
            const res = await api.get('/bookings/my');
            setMyBookings(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleBook = async (slotId) => {
        try {
            await api.post('/bookings/', { slot_id: slotId });
            setMessage('Booking successful!');
            fetchSlots();
            fetchMyBookings();
        } catch (err) {
            if (err.response && (err.response.status === 409 || err.response.status === 400)) {
                setMessage('Booking failed: ' + (err.response.data.detail || 'Slot was just taken.'));
            } else {
                setMessage('Booking failed. Slot might be taken.');
            }
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
                        background: 'var(--primary)', color: 'white',
                        padding: '1rem 1.5rem', borderRadius: '0.75rem',
                        boxShadow: 'var(--shadow-lg)', zIndex: 100
                    }}>
                        {message}
                    </div>
                }

                {/* Hero Section */}
                <HeroSection />
            </div>

            <div className="container" style={{ marginTop: '2rem' }}>
                <div className="grid grid-cols-1" style={{ gap: '3rem' }}>
                    <section id="slots-section">
                        <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '2rem', background: 'linear-gradient(to right, #fff, var(--primary-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
                                Available Slots
                            </h2>
                            <span className="badge badge-success" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>{slots.length} Open</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '2rem' }}>
                            {slots.length === 0 ? (
                                <div style={{
                                    gridColumn: '1 / -1',
                                    textAlign: 'center',
                                    padding: '6rem 2rem',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    borderRadius: '24px',
                                    border: '1px dashed var(--border-color)',
                                    color: 'var(--text-muted)'
                                }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🏏</div>
                                    <h3 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '0.5rem' }}>No slots available</h3>
                                    <p>Check back later for new openings!</p>
                                </div>
                            ) : slots.map(slot => (
                                <div key={slot.id} className="glass-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem' }}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--primary-color)', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                {new Date(slot.start_time).toLocaleDateString(undefined, { weekday: 'long' })}
                                            </div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '800', lineHeight: 1.2 }}>
                                                {new Date(slot.start_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>
                                        <div style={{ background: 'rgba(0, 255, 136, 0.1)', color: 'var(--primary-color)', padding: '0.5rem 1rem', borderRadius: '12px', fontWeight: '700', fontSize: '1.1rem' }}>
                                            ₹{slot.price}
                                        </div>
                                    </div>

                                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <polyline points="12 6 12 12 16 14"></polyline>
                                        </svg>
                                        <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                                            {new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                            {new Date(slot.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    <button onClick={() => handleBook(slot.id)} className="btn btn-primary" style={{ width: '100%', marginTop: 'auto', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem' }}>
                                        Book Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* My Bookings Section */}
                    <section>
                        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', background: 'linear-gradient(to right, #fff, var(--secondary-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            My Bookings
                        </h2>

                        {myBookings.length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '4rem 2rem',
                                background: 'rgba(255, 255, 255, 0.03)',
                                borderRadius: '24px',
                                border: '1px dashed var(--border-color)',
                                color: 'var(--text-muted)'
                            }}>
                                <p style={{ fontSize: '1.1rem' }}>You haven't booked any slots yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {myBookings.map(booking => (
                                    <div key={booking.id} className="glass-panel animate-fade-in" style={{ borderLeft: '4px solid var(--secondary-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                                                    {new Date(booking.slot.start_time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                                </div>
                                                <div style={{ color: 'var(--text-muted)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div style={{ width: '8px', height: '8px', background: 'var(--secondary-color)', borderRadius: '50%' }}></div>
                                                    {new Date(booking.slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                                    {new Date(booking.slot.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                            <span className="badge badge-secondary" style={{ fontSize: '0.8rem' }}>CONFIRMED</span>
                                        </div>
                                        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)', fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span>Ref: #{booking.id}</span>
                                            <span>₹{booking.slot.price}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
