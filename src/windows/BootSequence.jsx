import React, { useState, useEffect } from 'react';

function Clock() {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    let h = now.getHours(), m = now.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    const mStr = m < 10 ? '0' + m : String(m);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'];
    return (
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{
                color: 'white',
                fontSize: 'clamp(56px, 8vw, 88px)',
                fontWeight: 300,
                letterSpacing: '-2px',
                lineHeight: 1,
                marginBottom: 4,
                textShadow: '0 2px 32px rgba(0,0,0,0.35)',
                WebkitFontSmoothing: 'antialiased',
            }}>
                {h}:{mStr}
            </div>
            <div style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: 'clamp(14px, 2vw, 18px)',
                fontWeight: 400,
                letterSpacing: '0.01em',
                textShadow: '0 1px 12px rgba(0,0,0,0.3)',
                WebkitFontSmoothing: 'antialiased',
            }}>
                {days[now.getDay()]}, {months[now.getMonth()]} {now.getDate()}
            </div>
        </div>
    );
}

export default function BootSequence({ children, avatarSrc, username = 'Blake' }) {
    // Added 'unlocking' stage for the slide-up animation
    // 'boot' → 'lock' → 'unlocking' → 'desktop'
    const [stage, setStage] = useState('boot');
    const [progress, setProgress] = useState(0);
    const [lockVisible, setLockVisible] = useState(false);

    // 1. Boot up sequence
    useEffect(() => {
        if (stage !== 'boot') return;
        const t1 = setTimeout(() => setProgress(100), 100);
        const t2 = setTimeout(() => {
            setStage('lock');
            setTimeout(() => setLockVisible(true), 600);
        }, 2500);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [stage]);

    // 2. Unlocking animation timer
    useEffect(() => {
        if (stage === 'unlocking') {
            // Wait for the slide-up animation (800ms) to finish before unmounting the lock screen
            const t3 = setTimeout(() => setStage('desktop'), 800);
            return () => clearTimeout(t3);
        }
    }, [stage]);

    function handleLogin() {
        setStage('unlocking');
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') handleLogin();
    }

    if (stage === 'desktop') return children;

    return (
        <div style={{
            width: '100vw', height: '100vh',
            background: '#000',
            position: 'relative', overflow: 'hidden',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif",
        }}>

            {/* ── DESKTOP (Hidden behind lock screen) ── 
                We mount children during the 'lock' phase so the portfolio 
                is already loaded and ready when the screen slides up! 
            */}
            {(stage === 'lock' || stage === 'unlocking') && (
                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                    {children}
                </div>
            )}

            {/* ── LOCK SCREEN & BOOT OVERLAY ── */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 50,
                background: '#000',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                // THE SLIDE UP ANIMATION
                transform: stage === 'unlocking' ? 'translateY(-100vh)' : 'translateY(0)',
                transition: 'transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)',
            }}>

                {/* ── WALLPAPER ── */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop) center/cover no-repeat',
                    opacity: (stage === 'lock' || stage === 'unlocking') ? 1 : 0,
                    filter: 'blur(0px)',
                    transition: 'opacity 1.2s ease',
                }} />

                {/* ── BOOT SCREEN ── */}
                {stage === 'boot' && (
                    <div style={{
                        zIndex: 10,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        position: 'absolute',
                    }}>
                        {/* Apple Logo */}
                        <svg
                            viewBox="0 0 384 512"
                            style={{
                                width: 72, height: 72, fill: 'white', marginBottom: 40,
                                filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.15))'
                            }}
                        >
                            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                        </svg>

                        {/* Progress bar */}
                        <div style={{
                            position: 'fixed', bottom: '10%',
                            left: '50%', transform: 'translateX(-50%)',
                            width: 176, height: 4,
                            background: 'rgba(255,255,255,0.18)',
                            borderRadius: 99, overflow: 'hidden',
                        }}>
                            <div style={{
                                height: '100%',
                                background: 'white',
                                borderRadius: 99,
                                width: `${progress}%`,
                                transition: 'width 2.2s cubic-bezier(0.4,0,0.2,1)',
                            }} />
                        </div>
                    </div>
                )}

                {/* ── LOCK SCREEN CONTENT ── */}
                {(stage === 'lock' || stage === 'unlocking') && (
                    <div style={{
                        zIndex: 10,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        position: 'absolute',
                        // Fade out the UI elements slightly faster as it slides up
                        opacity: stage === 'unlocking' ? 0 : (lockVisible ? 1 : 0),
                        transform: lockVisible ? 'scale(1)' : 'scale(1.04)',
                        transition: 'opacity 0.4s ease, transform 0.7s ease',
                        pointerEvents: lockVisible && stage !== 'unlocking' ? 'all' : 'none',
                    }}>
                        {/* Live Clock */}
                        <Clock />

                        {/* Avatar + Username */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                            <img
                                src={avatarSrc || 'https://github.com/bl4ke100.png'}
                                alt={username}
                                style={{
                                    width: 80, height: 80,
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '2px solid rgba(255,255,255,0.22)',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(255,255,255,0.08)',
                                }}
                            />
                            <div style={{
                                color: 'white',
                                fontSize: 17, fontWeight: 500,
                                letterSpacing: '-0.01em',
                                WebkitFontSmoothing: 'antialiased',
                                textShadow: '0 1px 8px rgba(0,0,0,0.3)',
                            }}>
                                {username}
                            </div>
                        </div>

                        {/* Password / Login field */}
                        <div style={{ position: 'relative', width: 196, marginTop: 8 }}>
                            <input
                                autoFocus
                                type="password"
                                placeholder="Enter Password"
                                onKeyDown={handleKeyDown}
                                style={{
                                    width: '100%',
                                    padding: '8px 40px 8px 16px',
                                    borderRadius: 99,
                                    background: 'rgba(255,255,255,0.22)',
                                    border: '1px solid rgba(255,255,255,0.16)',
                                    backdropFilter: 'blur(24px) saturate(1.8)',
                                    WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
                                    color: 'white',
                                    fontSize: 14,
                                    fontFamily: 'inherit',
                                    fontWeight: 400,
                                    letterSpacing: '0.02em',
                                    outline: 'none',
                                    textAlign: 'center',
                                    cursor: 'text',
                                    caretColor: 'white',
                                }}
                            />
                            {/* Arrow button */}
                            <button
                                onClick={handleLogin}
                                style={{
                                    position: 'absolute',
                                    right: 5, top: '50%', transform: 'translateY(-50%)',
                                    width: 28, height: 28,
                                    borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.25)',
                                    border: 'none',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(8px)',
                                    WebkitBackdropFilter: 'blur(8px)',
                                    transition: 'background 0.18s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.38)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                            >
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M2 6h8M6.5 2.5L10 6l-3.5 3.5"
                                        stroke="white" strokeWidth="1.5"
                                        strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>

                        <div style={{
                            marginTop: 14,
                            color: 'rgba(255,255,255,0.5)',
                            fontSize: 12, fontWeight: 400,
                            letterSpacing: '0.01em',
                            WebkitFontSmoothing: 'antialiased',
                        }}>
                            or press Enter
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}