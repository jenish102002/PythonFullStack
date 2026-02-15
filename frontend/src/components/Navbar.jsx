import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'color: white; border-bottom: 2px solid var(--primary-color);' : '';

    return (
        <nav className="navbar">
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" className="logo">BoxCricket</Link>

                {user && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <Link to="/" style={{
                            color: location.pathname === '/' ? 'white' : 'var(--text-muted)',
                            fontWeight: location.pathname === '/' ? 600 : 400,
                            borderBottom: location.pathname === '/' ? '2px solid var(--primary-color)' : 'none',
                            paddingBottom: '2px',
                            transition: 'all 0.2s'
                        }}>
                            Book Slots
                        </Link>

                        <Link to="/payments" style={{
                            color: location.pathname === '/payments' ? 'white' : 'var(--text-muted)',
                            fontWeight: location.pathname === '/payments' ? 600 : 400,
                            borderBottom: location.pathname === '/payments' ? '2px solid var(--primary-color)' : 'none',
                            paddingBottom: '2px',
                            transition: 'all 0.2s'
                        }}>
                            Payment History
                        </Link>

                        {user.is_admin && (
                            <Link to="/admin" style={{
                                color: location.pathname === '/admin' ? 'var(--secondary-color)' : 'var(--text-muted)',
                                fontWeight: location.pathname === '/admin' ? 600 : 400,
                            }}>
                                Admin
                            </Link>
                        )}

                        <div style={{ height: '24px', width: '1px', background: 'var(--border-color)', margin: '0 0.5rem' }}></div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                Hey, <span style={{ color: 'white' }}>{user.username}</span>
                            </span>
                            <button onClick={logout} className="btn btn-danger" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
