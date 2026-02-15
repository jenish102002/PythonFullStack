import React from 'react';

const HeroSection = () => {
    return (
        <div className="hero-section" style={{
            position: 'relative',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
            borderRadius: '24px',
            overflow: 'hidden',
            padding: '4rem 2rem',
            marginBottom: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.05)'
        }}>
            {/* Background Pattern */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `
                    radial-gradient(circle at 10% 20%, rgba(0, 255, 136, 0.1) 0%, transparent 20%),
                    radial-gradient(circle at 90% 80%, rgba(0, 204, 255, 0.1) 0%, transparent 20%)
                `,
                zIndex: 0
            }} />

            {/* Grid Overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                opacity: 0.5,
                zIndex: 0
            }} />

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
                <div style={{
                    display: 'inline-block',
                    padding: '0.5rem 1rem',
                    background: 'rgba(0, 255, 136, 0.1)',
                    border: '1px solid rgba(0, 255, 136, 0.2)',
                    borderRadius: '50px',
                    color: '#00ff88',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    marginBottom: '1.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                }}>
                    Premium Box Cricket
                </div>
                <h1 style={{
                    fontSize: '3.5rem',
                    fontWeight: '800',
                    lineHeight: 1.1,
                    marginBottom: '1.5rem',
                    background: 'linear-gradient(to right, #fff, #cecece)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Level Up Your <br />
                    <span style={{ color: '#00ff88', WebkitTextFillColor: '#00ff88' }}>Game Tonight</span>
                </h1>
                <p style={{
                    fontSize: '1.2rem',
                    color: '#8899a6',
                    marginBottom: '2.5rem',
                    lineHeight: 1.6
                }}>
                    Experience top-tier turf with professional lighting.
                    Book your slot now and unleash your skills.
                </p>
                <div className="flex gap-4">
                    <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }} onClick={() => document.getElementById('slots-section').scrollIntoView({ behavior: 'smooth' })}>
                        Book a Slot
                    </button>
                    <button className="btn btn-ghost" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                        Learn More
                    </button>
                </div>
            </div>

            {/* Illustration/Icon */}
            <div style={{ position: 'relative', zIndex: 1, display: 'none', md: { display: 'block' } }}>
                {/* Abstract Cricket Icon using CSS/SVG */}
                <div style={{
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(0,255,136,0.2) 0%, transparent 70%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'pulse 3s infinite'
                }}>
                    <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.05); opacity: 1; }
                    100% { transform: scale(1); opacity: 0.8; }
                }
            `}</style>
        </div>
    );
};

export default HeroSection;
