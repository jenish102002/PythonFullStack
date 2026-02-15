import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            backgroundImage: 'url(/assets/images/box_cricket_turf_neon.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
        }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
            <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '420px', padding: '3rem 2.5rem', position: 'relative', zIndex: 10 }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h1 className="logo" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>BoxCricket</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Welcome back, player!</p>
                </div>

                {error &&
                    <div className="badge-danger" style={{ display: 'flex', width: '100%', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
                        {error}
                    </div>
                }

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="e.g. captain_cool"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            className="form-input"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>
                        Sign In to Play
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-glass)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        New to the pitch? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Create an account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
