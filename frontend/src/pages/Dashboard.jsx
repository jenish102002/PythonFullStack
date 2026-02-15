import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import HeroSlider from '../components/HeroSlider';
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
            setMessage('Booking failed. Slot might be taken.');
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

                {/* Hero Slider */}
                <HeroSlider />
            </div>

            <div className="grid grid-cols-1" style={{ gap: '3rem' }}>

                {/* Available Slots Section */}
                <section>
                    <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem' }}>Available Slots</h2>
                        <span className="badge badge-success">{slots.length} open</span>
                    </div>

                    <div className="grid grid-cols-3">
                        {slots.length === 0 ? (
                            <div className="glass-panel" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem' }}>
                                <p style={{ color: 'var(--text-secondary)' }}>No slots available right now. Check back later!</p>
                            </div>
                        ) : slots.map(slot => (
                            <div key={slot.id} className="glass-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '600', marginBottom: '0.25rem' }}>
                                            {new Date(slot.start_time).toLocaleDateString(undefined, { weekday: 'long' })}
                                        </div>
                                        <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                                            {new Date(slot.start_time).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '0.5rem', fontWeight: '600' }}>
                                        ₹{slot.price}
                                    </div>
                                </div>

                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1rem', marginTop: 'auto' }}>
                                    <div className="flex justify-between items-center">
                                        <span>
                                            {new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                            {new Date(slot.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>

                                <button onClick={() => handleBook(slot.id)} className="btn btn-primary" style={{ width: '100%' }}>
                                    Book Now
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* My Bookings Section */}
                <section>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>My Bookings</h2>
                    <div className="grid grid-cols-2">
                        {myBookings.length === 0 ? (
                            <p className="text-secondary" style={{ gridColumn: '1 / -1' }}>You haven't booked any slots yet.</p>
                        ) : myBookings.map(booking => (
                            <div key={booking.id} className="glass-panel animate-fade-in" style={{ borderLeft: '4px solid var(--primary)' }}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>
                                            {new Date(booking.slot.start_time).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                                        </div>
                                        <div style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                            {new Date(booking.slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                            {new Date(booking.slot.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <span className="badge badge-success">Confirmed</span>
                                </div>
                                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    Booking Reference: #{booking.id} • Booked on {new Date(booking.booking_date).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>

    );
}
