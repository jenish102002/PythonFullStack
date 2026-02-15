import { useState, useEffect } from 'react';

const slides = [
    {
        id: 1,
        image: '/assets/images/box_cricket_turf_neon.png',
        title: 'Experience Night Cricket',
        subtitle: 'Play under professional floodlights on premium turf.'
    },
    {
        id: 2,
        image: '/assets/images/cricket_action_shot.png',
        title: 'Unleash Your Skills',
        subtitle: 'Perfect for tournaments, practice, and friendly matches.'
    },
    {
        id: 3,
        image: '/assets/images/cricket_stumps_ball.png',
        title: 'Professional Gear',
        subtitle: 'Top-quality equipment available for every booking.'
    }
];

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{ position: 'relative', height: '400px', borderRadius: '1.5rem', overflow: 'hidden', marginBottom: '3rem', boxShadow: 'var(--shadow-lg)' }}>
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: index === current ? 1 : 0,
                        transition: 'opacity 1s ease-in-out',
                        backgroundImage: `url(${slide.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9), transparent)'
                    }} />

                    <div style={{
                        position: 'absolute',
                        bottom: '3rem',
                        left: '3rem',
                        maxWidth: '600px',
                        transform: index === current ? 'translateY(0)' : 'translateY(20px)',
                        opacity: index === current ? 1 : 0,
                        transition: 'all 1s ease-out 0.3s'
                    }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{slide.title}</h2>
                        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 5px rgba(0,0,0,0.5)' }}>{slide.subtitle}</p>
                    </div>
                </div>
            ))}

            <div style={{ position: 'absolute', bottom: '1.5rem', right: '3rem', display: 'flex', gap: '0.5rem' }}>
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: index === current ? 'var(--primary)' : 'rgba(255,255,255,0.3)',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
