import React, { useEffect, useState, useRef } from 'react';
import WindowWrapper from '#hoc/WindowWrapper';
import WindowControls from '#components/WindowControls';
import { Gamepad2, Clock, Trophy, BadgeAlert, History } from 'lucide-react';

const Steam = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const heroBgRef = useRef(null);

    useEffect(() => {
        fetch('/.netlify/functions/steam')
            .then(res => res.json())
            .then(json => { setData(json); setLoading(false); });
    }, []);

    useEffect(() => {
        if (!data) return;
        if (heroBgRef.current) drawHeroBg(heroBgRef.current);
    }, [data]);

    if (loading) return (
        <div className="h-full flex items-center justify-center" style={{ background: '#171a21' }}>
            <Gamepad2 className="animate-spin" size={40} style={{ color: '#66c0f4' }} />
        </div>
    );

    return (
        <div style={s.root}>
            {/* ── DRAG HEADER (FIXED) ── */}
            <div style={s.topBar}>
                <WindowControls target="steam" />
                <span style={s.topBarLabel}>STEAM</span>
            </div>

            {/* ── FULLY SCROLLABLE AREA ── */}
            <div style={s.scrollArea} className="custom-scrollbar">

                {/* ── HERO BANNER ── */}
                <div style={s.hero}>
                    <canvas ref={heroBgRef} width={800} height={280} style={s.heroCanvas} />
                    <div style={s.heroFade} />

                    <div style={s.heroContent}>
                        <div style={s.avatarWrap}>
                            {data.avatar
                                ? <img src={data.avatar} style={s.avatar} alt="" />
                                : <div style={s.avatarFallback}>GS</div>
                            }
                            <div style={{
                                ...s.onlinePip,
                                background: data.status === 'Online' ? '#90ba3c' : '#898989'
                            }} />
                        </div>
                        <div style={s.heroMeta}>
                            <div style={s.pname}>{data.personaname}</div>
                            <div style={s.psub}>Steam Level <span style={s.levelBadge}>{data.level}</span></div>

                            <div style={s.pbadges}>
                                <span style={{ ...s.pb, color: data.status === 'Online' ? '#90ba3c' : '#898989' }}>
                                    {data.status}
                                </span>
                                {data.current_game && (
                                    <span style={{ ...s.pb, color: '#90ba3c', fontWeight: 800 }}>
                                        <Gamepad2 size={12} className="inline mr-1" />
                                        In-Game: {data.current_game}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={s.body}>

                    {/* ── STAT CARDS ── */}
                    <div style={s.statsGrid}>
                        <div style={s.statCard}>
                            <Clock size={20} color="#66c0f4" style={{ marginBottom: 8 }} />
                            <div style={s.scValue}>{data.total_playtime} <span style={s.scUnit}>hrs</span></div>
                            <div style={s.scLabel}>Total Playtime</div>
                        </div>
                        <div style={s.statCard}>
                            <Trophy size={20} color="#c6d4df" style={{ marginBottom: 8 }} />
                            <div style={s.scValue}>{data.total_games} <span style={s.scUnit}>games</span></div>
                            <div style={s.scLabel}>Library Size</div>
                        </div>
                        <div style={s.statCard}>
                            <History size={20} color="#90ba3c" style={{ marginBottom: 8 }} />
                            <div style={s.scValue}>{data.avg_playtime} <span style={s.scUnit}>hrs</span></div>
                            <div style={s.scLabel}>Avg Per Game</div>
                        </div>
                        <div style={s.statCard}>
                            <BadgeAlert size={20} color="#b0c4de" style={{ marginBottom: 8 }} />
                            <div style={s.scValue}>{data.account_age} <span style={s.scUnit}>yrs</span></div>
                            <div style={s.scLabel}>Account Age</div>
                        </div>
                    </div>

                    {/* ── RECENTLY PLAYED ── */}
                    {data.recent?.length > 0 && (
                        <div style={s.section}>
                            <div style={s.secHeader}>
                                <h2>Recent Activity</h2>
                                <span style={s.secSub}>{data.recent.length} games this week</span>
                            </div>
                            <div style={s.gamesGrid}>
                                {data.recent.map((game, i) => (
                                    <GameCard key={i} game={game} hue={[200, 210, 190, 220][i]} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── ACHIEVEMENTS ── */}
                    {data.achievements?.length > 0 && (
                        <div style={s.section}>
                            <div style={s.secHeader}>
                                <h2>Latest Unlocks</h2>
                                <span style={s.secSub}>{data.achievements[0]?.gameName}</span>
                            </div>
                            <div style={s.achList}>
                                {data.achievements.map((ach, i) => (
                                    <div key={i} style={s.achRow}>
                                        <img src={ach.icon} style={s.achIcon} alt="" />
                                        <div style={s.achInfo}>
                                            <div style={s.achName}>{ach.name}</div>
                                            <div style={s.achDesc}>{ach.description}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── FULL LIBRARY SHOWCASE ── */}
                    {data.library?.length > 0 && (
                        <div style={s.section}>
                            <div style={s.secHeader}>
                                <h2>All Games</h2>
                                <span style={s.secSub}>Sorted by playtime</span>
                            </div>
                            <div style={{ ...s.gamesGrid, marginBottom: 32 }}>
                                {data.library.map((game, i) => (
                                    <GameCard key={i} game={game} hue={(200 + (i * 10)) % 360} />
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

/* ── PORTRAIT GAME CARD ── */
const GameCard = ({ game, hue }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!game.capsule && canvasRef.current) {
            drawGameCard(canvasRef.current, hue, 40, game.name);
        }
    }, [game, hue]);

    return (
        <div style={s.gameCard}>
            {game.capsule
                ? <img src={game.capsule} style={s.gcImg} alt={game.name} onError={(e) => e.target.style.display = 'none'} />
                : <canvas ref={canvasRef} width={140} height={210} style={s.gcImg} />
            }
            <canvas ref={canvasRef} width={140} height={210} style={{ ...s.gcImg, zIndex: -1 }} />

            <div style={s.gcOverlay} className="group-hover:opacity-100" />
            <div style={s.gcContent}>
                <div style={s.gcName}>{game.name}</div>
                <div style={s.gcHrs}>{game.playtime} {game.label}</div>
            </div>
        </div>
    );
};

/* ── CANVAS PAINTERS ── */
function drawHeroBg(canvas) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;

    // Steam classic deep blue background
    ctx.fillStyle = '#171a21';
    ctx.fillRect(0, 0, w, h);

    const blobs = [
        { x: 0.8, y: 0.2, r: 250, c: 'rgba(42,71,94,0.8)' },
        { x: 0.2, y: 0.8, r: 200, c: 'rgba(27,40,56,0.9)' },
        { x: 0.5, y: 0.5, r: 300, c: 'rgba(33,54,75,0.6)' },
    ];
    blobs.forEach(b => {
        const g = ctx.createRadialGradient(b.x * w, b.y * h, 0, b.x * w, b.y * h, b.r);
        g.addColorStop(0, b.c); g.addColorStop(1, 'transparent');
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    });

    // Add a subtle grid/scanline effect for that gamer desktop feel
    ctx.strokeStyle = 'rgba(255,255,255,0.02)';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 20) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
    for (let i = 0; i < h; i += 20) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }
}

function drawGameCard(canvas, hue, sat, name) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;

    ctx.fillStyle = `#1b2838`; ctx.fillRect(0, 0, w, h);

    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, `hsla(${hue},${sat}%,30%,0.8)`);
    g.addColorStop(1, `hsla(${hue},${sat}%,15%,0.9)`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = `rgba(255,255,255,0.8)`;
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const words = name?.split(' ') || [];
    let line = '';
    let y = h / 2 - 10;
    words.forEach(word => {
        let testLine = line + word + ' ';
        if (ctx.measureText(testLine).width > w - 20) {
            ctx.fillText(line, w / 2, y);
            line = word + ' ';
            y += 20;
        } else {
            line = testLine;
        }
    });
    ctx.fillText(line, w / 2, y);
}

/* ── STYLES ── */
const s = {
    root: { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#171a21', color: '#c7d5e0', fontFamily: "'Motiva Sans', 'Inter', sans-serif", fontSize: 13, overflow: 'hidden' },

    topBar: { display: 'flex', alignItems: 'center', padding: '10px 16px', gap: 12, zIndex: 10, background: '#171a21', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 },
    topBarLabel: { fontSize: 12, fontWeight: 700, color: '#c7d5e0', letterSpacing: '0.1em' },

    scrollArea: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' },

    hero: { position: 'relative', height: 260, flexShrink: 0, borderBottom: '1px solid rgba(0,0,0,0.5)' },
    heroCanvas: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' },
    heroFade: { position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, #171a21 100%)' },
    heroContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 32px 24px', display: 'flex', alignItems: 'flex-end', gap: 24, zIndex: 2 },

    avatarWrap: { position: 'relative', flexShrink: 0, padding: 4, background: 'rgba(0,0,0,0.3)', borderRadius: 6 },
    avatar: { width: 110, height: 110, borderRadius: 4, border: '2px solid #66c0f4', display: 'block', objectFit: 'cover' },
    avatarFallback: { width: 110, height: 110, borderRadius: 4, border: '2px solid #66c0f4', background: '#1b2838', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 900, color: '#fff' },
    onlinePip: { position: 'absolute', bottom: 0, right: -4, width: 18, height: 18, borderRadius: '50%', border: '4px solid #171a21' },

    heroMeta: { paddingBottom: 6, flex: 1 },
    pname: { fontSize: 32, fontWeight: 400, color: '#fff', lineHeight: 1.1, marginBottom: 8, textShadow: '0 2px 4px rgba(0,0,0,0.8)' },
    psub: { fontSize: 13, color: '#8f98a0', marginBottom: 12, textShadow: '0 1px 2px rgba(0,0,0,0.8)' },
    levelBadge: { border: '1px solid #66c0f4', borderRadius: 12, padding: '2px 8px', color: '#66c0f4', fontWeight: 700, marginLeft: 6 },

    pbadges: { display: 'flex', gap: 16, flexWrap: 'wrap' },
    pb: { display: 'inline-flex', alignItems: 'center', fontSize: 13, textShadow: '0 1px 2px rgba(0,0,0,0.8)' },

    body: { padding: '32px', display: 'flex', flexDirection: 'column', gap: 32 },

    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 },
    statCard: { background: 'linear-gradient(to bottom, #1b2838, #171a21)', borderRadius: 8, padding: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' },
    scValue: { fontSize: 24, fontWeight: 300, color: '#fff', lineHeight: 1.2 },
    scUnit: { fontSize: 12, color: '#8f98a0', fontWeight: 600, marginLeft: 2 },
    scLabel: { fontSize: 11, textTransform: 'uppercase', color: '#66c0f4', letterSpacing: '0.05em', marginTop: 4, fontWeight: 600 },

    section: { display: 'flex', flexDirection: 'column' },
    secHeader: { borderBottom: '1px solid #2a475e', paddingBottom: 8, marginBottom: 16, display: 'flex', alignItems: 'flex-end', gap: 16 },
    secHeaderTitle: { margin: 0 },
    secSub: { fontSize: 12, color: '#8f98a0', paddingBottom: 2 },

    gamesGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 },
    gameCard: { borderRadius: 4, overflow: 'hidden', cursor: 'pointer', position: 'relative', aspectRatio: '2/3', boxShadow: '0 4px 8px rgba(0,0,0,0.3)', transition: 'transform 0.2s ease', '&:hover': { transform: 'scale(1.02)' } },
    gcImg: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' },
    gcOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.9) 100%)', opacity: 0.8, transition: 'opacity 0.2s ease' },
    gcContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px' },
    gcName: { fontSize: 12, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4, textShadow: '0 1px 2px #000' },
    gcHrs: { fontSize: 10, color: '#66c0f4', fontWeight: 600 },

    achList: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 },
    achRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px', background: '#1b2838', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)' },
    achIcon: { width: 48, height: 48, borderRadius: 4, flexShrink: 0, objectFit: 'cover', boxShadow: '0 2px 4px rgba(0,0,0,0.5)' },
    achInfo: { flex: 1, minWidth: 0 },
    achName: { fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 },
    achDesc: { fontSize: 11, color: '#8f98a0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
};

// Required for the H2 headers inside secHeader to style correctly
const globalStyles = `
    h2 { font-size: 16px; font-weight: 400; color: #fff; text-transform: uppercase; letter-spacing: 0.05em; margin: 0; }
`;

const SteamWindow = WindowWrapper(Steam, "steam");
export default SteamWindow;