import React, { useEffect, useState, useRef } from 'react';
import WindowWrapper from '#hoc/WindowWrapper';
import WindowControls from '#components/WindowControls';
import { Gamepad2 } from 'lucide-react';

const Steam = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const heroBgRef = useRef(null);
    const featuredBgRef = useRef(null);

    useEffect(() => {
        fetch('/.netlify/functions/steam')
            .then(res => res.json())
            .then(json => { setData(json); setLoading(false); });
    }, []);

    useEffect(() => {
        if (!data) return;
        if (heroBgRef.current) drawHeroBg(heroBgRef.current);
        if (featuredBgRef.current) drawFeaturedBg(featuredBgRef.current);
    }, [data]);

    if (loading) return (
        <div className="h-full flex items-center justify-center" style={{ background: '#080c10' }}>
            <Gamepad2 className="animate-spin" size={36} style={{ color: '#4d9de0' }} />
        </div>
    );

    const topGame = data.most_played?.[0];
    const recentGames = data.recent?.slice(0, 3) ?? [];
    const restGames = data.most_played?.slice(1, 4) ?? [];

    return (
        <div style={s.root}>

            {/* ── HERO BANNER ── */}
            <div style={s.hero}>
                <canvas ref={heroBgRef} width={680} height={220} style={s.heroCanvas} />
                <div style={s.heroFade} />
                <div style={s.heroFadeSide} />

                {/* top bar */}
                <div style={s.topBar}>
                    <WindowControls target="steam" />
                    <span style={s.topBarLabel}>Steam</span>
                </div>

                <div style={s.heroContent}>
                    <div style={s.avatarWrap}>
                        {data.avatar
                            ? <img src={data.avatar} style={s.avatar} alt="" />
                            : <div style={s.avatarFallback}>GS</div>
                        }
                        <div style={{
                            ...s.onlinePip,
                            background: data.status === 'Online' ? '#3fb950' : '#4a5568'
                        }} />
                    </div>
                    <div style={s.heroMeta}>
                        <div style={s.pname}>{data.personaname}</div>
                        <div style={s.psub}>Steam Level {data.level} · Member since {data.account_age} yrs ago</div>
                        <div style={s.pbadges}>
                            <span style={{ ...s.pb, ...s.pbGreen }}>
                                <span style={s.pbDot} />
                                {data.status}
                            </span>
                            {data.current_game && (
                                <span style={{ ...s.pb, ...s.pbGreen }}>
                                    <span style={s.pbDot} />
                                    Playing {data.current_game}
                                </span>
                            )}
                            <span style={{ ...s.pb, ...s.pbBlue }}>
                                {data.total_playtime} hrs total
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── STATS STRIP ── */}
            <div style={s.statsStrip}>
                {[
                    { n: data.total_playtime, l: 'Hours', s: 'all time' },
                    { n: data.total_games, l: 'Games', s: `${Math.round(data.total_games * 0.59)} played` },
                    { n: data.avg_playtime, l: 'Avg hrs', s: 'per game' },
                    { n: `${data.account_age}y`, l: 'Account age', s: 'Steam veteran' },
                ].map((item, i) => (
                    <div key={i} style={{ ...s.sc, ...(i < 3 ? s.scBorder : {}) }}>
                        <div style={s.sn}>{item.n}</div>
                        <div style={s.sl}>{item.l}</div>
                        <div style={s.ss}>{item.s}</div>
                    </div>
                ))}
            </div>

            <div style={s.body}>

                {/* ── FEATURED (TOP GAME) ── */}
                {topGame && (
                    <div style={s.section}>
                        <div style={s.secLabel}>
                            <span>Top game</span>
                            <span style={s.secLink}>View full library →</span>
                        </div>
                        <div style={s.featuredCard}>
                            {topGame.banner
                                ? <img src={topGame.banner} style={s.featuredImg} alt="" />
                                : <canvas ref={featuredBgRef} width={640} height={170} style={s.featuredImg} />
                            }
                            <div style={s.featuredOverlay} />
                            <div style={s.featuredContent}>
                                <div style={s.fgEyebrow}>#1 Most Played</div>
                                <div style={s.fgTitle}>{topGame.name}</div>
                                <div style={s.fgHrs}>{topGame.playtime} hrs on record</div>
                                <div style={s.fgSub}>Last played recently</div>
                                <div style={s.fgBarWrap}>
                                    <div style={{ ...s.fgBar, width: '100%' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── RECENT GAMES GRID ── */}
                {recentGames.length > 0 && (
                    <div style={s.section}>
                        <div style={s.secLabel}>
                            <span>Recently played</span>
                            <span style={s.secLink}>{data.recent?.length} games this week</span>
                        </div>
                        <div style={s.gamesGrid}>
                            {recentGames.map((game, i) => (
                                <GameCard key={i} game={game} hue={[30, 280, 140][i]} />
                            ))}
                        </div>
                    </div>
                )}

                {/* ── MOST PLAYED LIST ── */}
                {restGames.length > 0 && (
                    <div style={s.section}>
                        <div style={s.secLabel}>
                            <span>Hall of fame</span>
                        </div>
                        <div style={s.mostPlayedList}>
                            {restGames.map((game, i) => (
                                <div key={i} style={s.mpRow}>
                                    <div style={s.mpRank}>#{i + 2}</div>
                                    {game.banner
                                        ? <img src={game.banner} style={s.mpThumb} alt="" />
                                        : <div style={{ ...s.mpThumb, background: '#0e1419', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#4d9de0', fontWeight: 700 }}>
                                            {game.name?.slice(0, 4)}
                                          </div>
                                    }
                                    <div style={s.mpInfo}>
                                        <div style={s.mpName}>{game.name}</div>
                                        <div style={s.mpBarWrap}>
                                            <div style={{
                                                ...s.mpBar,
                                                width: `${Math.min(100, (game.playtime / (topGame?.playtime || 1)) * 100)}%`
                                            }} />
                                        </div>
                                    </div>
                                    <div style={s.mpHrs}>{game.playtime} hrs</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── ACHIEVEMENTS ── */}
                {data.achievements?.length > 0 && (
                    <div style={s.section}>
                        <div style={s.secLabel}>
                            <span>Recent achievements</span>
                            <span style={s.secLink}>{data.achievements[0]?.gameName}</span>
                        </div>
                        <div style={s.achList}>
                            {data.achievements.slice(0, 4).map((ach, i) => (
                                <div key={i} style={s.achRow}>
                                    <img src={ach.icon} style={s.achIcon} alt="" />
                                    <div style={s.achInfo}>
                                        <div style={s.achName}>{ach.name}</div>
                                        <div style={s.achDesc}>{ach.description}</div>
                                        <div style={s.achGame}>{ach.gameName}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

/* ── GAME CARD (canvas fallback if no capsule image) ── */
const GameCard = ({ game, hue }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!game.capsule && canvasRef.current) {
            drawGameCard(canvasRef.current, hue, 55);
        }
    }, [game, hue]);

    return (
        <div style={s.gameCard}>
            {game.capsule
                ? <img src={game.capsule} style={s.gcImg} alt={game.name} />
                : <canvas ref={canvasRef} width={220} height={110} style={s.gcImg} />
            }
            <div style={s.gcOverlay} />
            <div style={s.gcContent}>
                <div style={s.gcName}>{game.name}</div>
                <div style={s.gcHrs}>{game.playtime_2weeks}h this week</div>
            </div>
        </div>
    );
};

/* ── CANVAS PAINTERS ── */
function drawHeroBg(canvas) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.fillStyle = '#080c10';
    ctx.fillRect(0, 0, w, h);
    const blobs = [
        { x: 0.6, y: 0.3, r: 180, c: 'rgba(13,40,90,0.9)' },
        { x: 0.85, y: 0.7, r: 140, c: 'rgba(8,25,65,0.8)' },
        { x: 0.3, y: 0.6, r: 160, c: 'rgba(6,18,50,0.7)' },
        { x: 0.1, y: 0.2, r: 120, c: 'rgba(10,30,70,0.6)' },
    ];
    blobs.forEach(b => {
        const g = ctx.createRadialGradient(b.x * w, b.y * h, 0, b.x * w, b.y * h, b.r);
        g.addColorStop(0, b.c); g.addColorStop(1, 'transparent');
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    });
    for (let i = 0; i < 90; i++) {
        const x = Math.random() * w, y = Math.random() * h;
        const size = Math.random() * 1.4 + 0.3;
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.55 + 0.1})`;
        ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fill();
    }
    const accent = ctx.createLinearGradient(w * 0.4, 0, w, h);
    accent.addColorStop(0, 'rgba(30,80,160,0.25)');
    accent.addColorStop(1, 'rgba(77,157,224,0.04)');
    ctx.fillStyle = accent; ctx.fillRect(0, 0, w, h);
}

function drawFeaturedBg(canvas) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.fillStyle = '#050d18'; ctx.fillRect(0, 0, w, h);
    const spots = [
        { x: 0.7, y: 0.3, r: 200, c: 'rgba(20,50,100,0.9)' },
        { x: 0.9, y: 0.8, r: 150, c: 'rgba(10,30,70,0.8)' },
    ];
    spots.forEach(s => {
        const g = ctx.createRadialGradient(s.x * w, s.y * h, 0, s.x * w, s.y * h, s.r);
        g.addColorStop(0, s.c); g.addColorStop(1, 'transparent');
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    });
    ctx.strokeStyle = 'rgba(77,157,224,0.07)'; ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
        ctx.beginPath(); ctx.moveTo(w * 0.45 + i * 60, 0); ctx.lineTo(w * 0.75 + i * 30, h); ctx.stroke();
    }
    for (let i = 0; i < 40; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.25 + 0.05})`;
        ctx.beginPath(); ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 1.1 + 0.3, 0, Math.PI * 2); ctx.fill();
    }
    const flash = ctx.createRadialGradient(w * 0.75, h * 0.4, 0, w * 0.75, h * 0.4, 260);
    flash.addColorStop(0, 'rgba(77,157,224,0.14)'); flash.addColorStop(1, 'transparent');
    ctx.fillStyle = flash; ctx.fillRect(0, 0, w, h);
}

function drawGameCard(canvas, hue, sat) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.fillStyle = `hsl(${hue},${sat}%,6%)`; ctx.fillRect(0, 0, w, h);
    const g = ctx.createRadialGradient(w * 0.7, h * 0.3, 0, w * 0.7, h * 0.3, w * 0.6);
    g.addColorStop(0, `hsla(${hue},${sat}%,22%,0.8)`); g.addColorStop(1, 'transparent');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    const g2 = ctx.createLinearGradient(0, 0, w, h);
    g2.addColorStop(0, `hsla(${hue + 20},${sat}%,15%,0.4)`);
    g2.addColorStop(1, `hsla(${hue - 20},${sat}%,8%,0.6)`);
    ctx.fillStyle = g2; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 18; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.12 + 0.03})`;
        ctx.beginPath(); ctx.arc(Math.random() * w, Math.random() * h, Math.random() + 0.5, 0, Math.PI * 2); ctx.fill();
    }
}

/* ── STYLES ── */
const s = {
    root: { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#080c10', color: '#c9d8e8', fontFamily: "'Inter', 'Helvetica Neue', sans-serif", fontSize: 13, overflowY: 'auto', scrollbarWidth: 'none' },
    hero: { position: 'relative', height: 220, overflow: 'hidden', flexShrink: 0 },
    heroCanvas: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' },
    heroFade: { position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,12,16,0) 0%, rgba(8,12,16,0.55) 55%, rgba(8,12,16,1) 100%)' },
    heroFadeSide: { position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(8,12,16,0.75) 0%, transparent 65%)' },
    topBar: { position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', padding: '8px 12px', gap: 10, zIndex: 2 },
    topBarLabel: { fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.15em' },
    heroContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 20px 18px', display: 'flex', alignItems: 'flex-end', gap: 16, zIndex: 2 },
    avatarWrap: { position: 'relative', flexShrink: 0 },
    avatar: { width: 76, height: 76, borderRadius: 12, border: '3px solid #4d9de0', display: 'block', objectFit: 'cover' },
    avatarFallback: { width: 76, height: 76, borderRadius: 12, border: '3px solid #4d9de0', background: 'linear-gradient(135deg,#0d2a45,#1a4f82)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 900, color: '#fff' },
    onlinePip: { position: 'absolute', bottom: -2, right: -2, width: 15, height: 15, borderRadius: '50%', border: '3px solid #080c10' },
    heroMeta: { paddingBottom: 4, flex: 1 },
    pname: { fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1.1, marginBottom: 3, textShadow: '0 2px 12px rgba(0,0,0,0.8)' },
    psub: { fontSize: 11, color: '#6e8898', marginBottom: 8, fontWeight: 500 },
    pbadges: { display: 'flex', gap: 6, flexWrap: 'wrap' },
    pb: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: '0.02em' },
    pbGreen: { background: 'rgba(63,185,80,0.15)', color: '#3fb950', border: '1px solid rgba(63,185,80,0.3)' },
    pbBlue: { background: 'rgba(77,157,224,0.15)', color: '#4d9de0', border: '1px solid rgba(77,157,224,0.3)' },
    pbDot: { width: 5, height: 5, borderRadius: '50%', background: 'currentColor', flexShrink: 0 },
    statsStrip: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 },
    sc: { padding: '13px 16px', display: 'flex', flexDirection: 'column', gap: 1 },
    scBorder: { borderRight: '1px solid rgba(255,255,255,0.06)' },
    sn: { fontSize: 19, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1 },
    sl: { fontSize: 10, fontWeight: 700, color: '#384c5a', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 },
    ss: { fontSize: 10, color: '#4a6070' },
    body: { flex: 1, overflowY: 'auto', scrollbarWidth: 'none' },
    section: { padding: '14px 16px 0' },
    secLabel: { fontSize: 10, fontWeight: 700, color: '#384c5a', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    secLink: { color: '#4d9de0', fontWeight: 600, textTransform: 'none', letterSpacing: 0, fontSize: 11, cursor: 'pointer' },

    featuredCard: { position: 'relative', height: 170, borderRadius: 12, overflow: 'hidden', marginBottom: 4, cursor: 'pointer' },
    featuredImg: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' },
    featuredOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(8,12,16,0.92) 0%, rgba(8,12,16,0.55) 55%, rgba(8,12,16,0) 100%)' },
    featuredContent: { position: 'absolute', inset: 0, padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
    fgEyebrow: { fontSize: 9, fontWeight: 700, color: '#4d9de0', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 4 },
    fgTitle: { fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1.1, marginBottom: 6 },
    fgHrs: { fontSize: 12, fontWeight: 700, color: '#c9d8e8', marginBottom: 2 },
    fgSub: { fontSize: 10, color: '#6e8898', marginBottom: 10 },
    fgBarWrap: { width: 130, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2 },
    fgBar: { height: 4, borderRadius: 2, background: '#4d9de0' },

    gamesGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 4 },
    gameCard: { borderRadius: 10, overflow: 'hidden', cursor: 'pointer', position: 'relative', height: 110 },
    gcImg: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' },
    gcOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 25%, rgba(8,12,16,0.95) 100%)' },
    gcContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 10px' },
    gcName: { fontSize: 11, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 2 },
    gcHrs: { fontSize: 10, color: '#4d9de0', fontWeight: 600 },

    mostPlayedList: { display: 'flex', flexDirection: 'column', gap: 1, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', marginBottom: 4 },
    mpRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: '#0e1419' },
    mpRank: { fontSize: 10, fontWeight: 700, color: '#384c5a', width: 18, flexShrink: 0 },
    mpThumb: { width: 48, height: 27, borderRadius: 4, objectFit: 'cover', flexShrink: 0 },
    mpInfo: { flex: 1, minWidth: 0 },
    mpName: { fontSize: 12, fontWeight: 600, color: '#c9d8e8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4 },
    mpBarWrap: { height: 3, background: '#21262d', borderRadius: 2 },
    mpBar: { height: 3, borderRadius: 2, background: '#4d9de0' },
    mpHrs: { fontSize: 11, color: '#4a6070', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' },

    achList: { display: 'flex', flexDirection: 'column', gap: 1, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', marginBottom: 16 },
    achRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#0e1419' },
    achIcon: { width: 40, height: 40, borderRadius: 8, flexShrink: 0, objectFit: 'cover' },
    achInfo: { flex: 1, minWidth: 0 },
    achName: { fontSize: 12, fontWeight: 700, color: '#e0eaf4', marginBottom: 1 },
    achDesc: { fontSize: 10, color: '#4a6070', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    achGame: { fontSize: 10, color: '#4d9de0', marginTop: 2, fontWeight: 600 },
};

const SteamWindow = WindowWrapper(Steam, "steam");
export default SteamWindow;