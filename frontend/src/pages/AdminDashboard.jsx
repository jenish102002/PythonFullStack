import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';

export default function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [slots, setSlots] = useState([]);

    // Form and Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [price, setPrice] = useState('1000');

    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user && !user.is_admin) {
            navigate('/');
        }
        if (user) {
            fetchData();
        }
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            const [bookingsRes, slotsRes] = await Promise.all([
                api.get('/bookings/all'),
                api.get('/admin/slots/')
            ]);
            setBookings(bookingsRes.data);
            setSlots(slotsRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const resetForm = () => {
        setStartTime('');
        setEndTime('');
        setPrice('1000');
        setSelectedSlot(null);
        setIsEditModalOpen(false);
        setIsCreateModalOpen(false);
        setIsDeleteModalOpen(false);
    };

    const handleSlotSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                start_time: startTime,
                end_time: endTime,
                price: parseFloat(price)
            };

            if (selectedSlot && isEditModalOpen) {
                // Update existing slot
                await api.put(`/slots/${selectedSlot.id}`, payload);
                setMessage('Slot updated successfully!');
            } else {
                // Create new slot
                await api.post('/slots/', payload);
                setMessage('Slot created successfully!');
            }

            resetForm();
            fetchData();
        } catch (err) {
            console.error(err);
            setMessage('Operation failed. ' + (err.response?.data?.detail || err.message));
        }
        setTimeout(() => setMessage(''), 3000);
    };

    const handleEditClick = (slot) => {
        setStartTime(slot.start_time.slice(0, 16));
        setEndTime(slot.end_time.slice(0, 16));
        setPrice(slot.price);
        setSelectedSlot(slot);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (slot) => {
        setSelectedSlot(slot);
        setIsDeleteModalOpen(true);
    }

    const confirmDelete = async () => {
        if (!selectedSlot) return;

        try {
            console.log(`Attempting to delete slot ${selectedSlot.id}`);
            await api.delete(`/slots/${selectedSlot.id}`);
            setMessage('Slot deleted successfully!');
            resetForm();
            fetchData();
        } catch (err) {
            console.error('Delete failed:', err);
            setMessage('Failed to delete slot. ' + (err.response?.data?.detail || err.message));
        }
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div style={{ paddingBottom: '4rem' }}>
            <Navbar />

            {/* Create Slot Modal */}
            <Modal isOpen={isCreateModalOpen} onClose={resetForm} title="Create New Slot">
                <form onSubmit={handleSlotSubmit}>
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
                    <div className="form-group" style={{ marginTop: '1rem' }}>
                        <label className="form-label">End Time</label>
                        <input
                            className="form-input"
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group" style={{ marginTop: '1rem' }}>
                        <label className="form-label">Price (₹)</label>
                        <input
                            className="form-input"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex gap-4" style={{ marginTop: '2rem' }}>
                        <button type="button" onClick={resetForm} className="btn" style={{ flex: 1, background: 'rgba(255,255,255,0.1)' }}>Cancel</button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Slot</button>
                    </div>
                </form>
            </Modal>

            {/* Edit Slot Modal */}
            <Modal isOpen={isEditModalOpen} onClose={resetForm} title="Edit Slot">
                <form onSubmit={handleSlotSubmit}>
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
                    <div className="form-group" style={{ marginTop: '1rem' }}>
                        <label className="form-label">End Time</label>
                        <input
                            className="form-input"
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group" style={{ marginTop: '1rem' }}>
                        <label className="form-label">Price (₹)</label>
                        <input
                            className="form-input"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex gap-4" style={{ marginTop: '2rem' }}>
                        <button type="button" onClick={resetForm} className="btn" style={{ flex: 1, background: 'rgba(255,255,255,0.1)' }}>Cancel</button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Update Slot</button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={resetForm} title="Confirm Deletion">
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Are you sure you want to delete this slot? <br />
                    <strong style={{ color: 'white' }}>
                        {selectedSlot && new Date(selectedSlot.start_time).toLocaleString()}
                    </strong>
                    <br />
                    This action cannot be undone.
                </p>
                <div className="flex gap-4">
                    <button onClick={resetForm} className="btn" style={{ flex: 1, background: 'rgba(255,255,255,0.1)' }}>Cancel</button>
                    <button onClick={confirmDelete} className="btn btn-danger" style={{ flex: 1 }}>Delete Slot</button>
                </div>
            </Modal>

            <div className="container" style={{ marginTop: '3rem' }}>
                {message &&
                    <div className="animate-fade-in" style={{
                        position: 'fixed', bottom: '2rem', right: '2rem',
                        background: 'var(--accent-success)', color: 'white',
                        padding: '1rem 1.5rem', borderRadius: '0.75rem',
                        boxShadow: 'var(--shadow-lg)', zIndex: 2000
                    }}>
                        {message}
                    </div>
                }

                <div className="grid grid-cols-3" style={{ alignItems: 'start', gap: '2rem' }}>

                    {/* Action Panel - Takes 1/3 width */}
                    <div className="glass-panel" style={{ textAlign: 'center' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Quick Actions</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Manage your turf availability and pricing.</p>
                        <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary" style={{ width: '100%' }}>
                            + Create New Slot
                        </button>
                    </div>

                    {/* Lists Section - Takes 2/3 width */}
                    <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Slot List */}
                        <div className="glass-panel">
                            <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem' }}>Boks Slots Management</h3>
                                <span className="badge badge-success">{slots.length} Slots</span>
                            </div>
                            <div className="flex flex-col gap-4" style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                {slots.length === 0 ? <p className="text-secondary">No slots created yet.</p> : slots.map(slot => (
                                    <div key={slot.id} style={{
                                        background: 'rgba(255,255,255,0.03)',
                                        padding: '1rem',
                                        borderRadius: '0.75rem',
                                        border: '1px solid var(--border-glass)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                                                {new Date(slot.start_time).toLocaleDateString()}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                {new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                                {new Date(slot.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div style={{ marginTop: '0.25rem', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                                ₹{slot.price}
                                                {slot.is_booked && <span className="badge badge-success" style={{ marginLeft: '0.5rem', fontSize: '0.7rem' }}>BOOKED</span>}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {!slot.is_booked && (
                                                <>
                                                    <button onClick={() => handleEditClick(slot)} className="btn" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)' }}>Edit</button>
                                                    <button onClick={() => handleDeleteClick(slot)} className="btn btn-danger" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>Delete</button>
                                                </>
                                            )}
                                            {slot.is_booked && (
                                                <button disabled className="btn" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', opacity: 0.5, cursor: 'not-allowed' }}>Booked</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Bookings List */}
                        <div className="glass-panel">
                            <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem' }}>Recent Bookings</h3>
                                <span className="badge badge-success">{bookings.length} Total</span>
                            </div>
                            <div className="flex flex-col gap-4" style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                {bookings.length === 0 ? <p className="text-secondary">No bookings found.</p> : bookings.map(booking => (
                                    <div key={booking.id} style={{
                                        background: 'rgba(255,255,255,0.03)',
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div className="flex items-center gap-3">
                                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                                {booking.user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{booking.user.username}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{booking.user.email}</div>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'right' }}>
                                            <div>#{booking.id} • ₹{booking.slot.price}</div>
                                            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{new Date(booking.slot.start_time).toLocaleDateString()}</div>
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
