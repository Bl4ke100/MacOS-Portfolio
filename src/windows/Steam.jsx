import React, { useEffect, useState, useRef } from 'react';
import WindowWrapper from '#hoc/WindowWrapper';
import WindowControls from '#components/WindowControls';
import { Gamepad2, Cpu, Zap, Monitor } from 'lucide-react';

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
        <div className="h-full flex items-center justify-center" style={{ background: '#080c10' }}>
            <Gamepad2 className="animate-spin" size={36} style={{ color: '#4d9de0' }} />
        </div>
    );

    return (
        <div style={s.root}>
            {/* ── HERO BANNER ── */}
            <div style={s.hero}>
                <canvas ref={heroBgRef} width={680} height={220} style={s.heroCanvas} />
                <div style={s.heroFade} />
                <div style={s.heroFadeSide} />

                <div style={s.topBar}>
                    <WindowControls target="steam" />
                    <span style={s.topBarLabel}>Steam Cloud</span>
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
                                <span style={s.pbDot} />{data.status}
                            </span>
                            {data.current_game && (
                                <span style={{ ...s.pb, ...s.pbGreen }}>
                                    <span style={s.pbDot} />Playing {data.current_game}
                                </span>
                            )}
                            <span style={{ ...s.pb, ...s.pbBlue }}>
                                {data.total_playtime} hrs total
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MILKED STATS STRIP ── */}
            <div style={s.statsStrip}>
                {[
                    { n: data.total_playtime, l: 'Hours', s: 'Total Playtime' },
                    { n: data.total_games, l: 'Games', s: 'Library Size' },
                    { n: data.avg_playtime, l: 'Avg Hrs', s: 'Per Game' },
                    { n: `$${data.estimated_value}`, l: 'Value', s: 'Estimated Account' },
                ].map((item, i) => (
                    <div key={i} style={{ ...s.sc, ...(i < 3 ? s.scBorder : {}) }}>
                        <div style={s.sn}>{item.n}</div>
                        <div style={s.sl}>{item.l}</div>
                        <div style={s.ss}>{item.s}</div>
                    </div>
                ))}
            </div>

            <div style={s.body}>

                {/* ── HARDWARE RIG ── */}
                <div style={s.section}>
                    <div style={s.hwBlock}>
                        <div style={s.hwItem}>
                            <Cpu size={20} color="#6e8898" />
                            <div style={s.hwTextWrap}>
                                <div style={s.hwTitle}>Core i7-14650HX</div>
                                <div style={s.hwSub}>Processor</div>
                            </div>
                        </div>
                        <div style={s.hwItem}>
                            <Zap size={20} color="#3fb950" />
                            <div style={s.hwTextWrap}>
                                <div style={s.hwTitle}>NVIDIA RTX 5060</div>
                                <div style={s.hwSub}>Graphics</div>
                            </div>
                        </div>
                        <div style={s.hwItem}>
                            <Monitor size={20} color="#6e8898" />
                            <div style={s.hwTextWrap}>
                                <div style={s.hwTitle}>MSI MAG 1440p</div>
                                <div style={s.hwSub}>Display</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RECENTLY PLAYED ── */}
                {data.recent?.length > 0 && (
                    <div style={s.section}>
                        <div style={s.secLabel}>
                            <span>Active Duty (Recent)</span>
                        </div>
                        <div style={s.gamesGrid}>
                            {data.recent.map((game, i) => (
                                <GameCard key={i} game={game} hue={[30, 280, 140, 200][i]} />
                            ))}
                        </div>
                    </div>
                )}

                {/* ── ACHIEVEMENTS ── */}
                {data.achievements?.length > 0 && (
                    <div style={s.section}>
                        <div style={s.secLabel}>
                            <span>Latest Unlocks</span>
                            <span style={s.secLink}>{data.achievements[0]?.gameName}</span>
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
                        <div style={s.secLabel}>
                            <span>The Vault (Top {data.library.length})</span>
                        </div>
                        <div style={{ ...s.gamesGrid, marginBottom: 32 }}>
                            {data.library.map((game, i) => (
                                <GameCard key={i} game={game} hue={(i * 35) % 360} />
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

/* ── PORTRAIT GAME CARD ── */
const GameCard = ({ game, hue }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!game.capsule && canvasRef.current) {
            drawGameCard(canvasRef.current, hue, 55, game.name);
        }
    }, [game, hue]);

    return (
        <div style={s.gameCard}>
            {game.capsule
                ? <img src={game.capsule} style={s.gcImg} alt={game.name} onError={(e) => e.target.style.display = 'none'} />
                : <canvas ref={canvasRef} width={140} height={210} style={s.gcImg} />
            }
            {/* Fallback canvas sits underneath the image. If image errors/hides, canvas shows. */}
            <canvas ref={canvasRef} width={140} height={210} style={{ ...s.gcImg, zIndex: -1 }} />

            <div style={s.gcOverlay} />
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
    ctx.fillStyle = '#080c10';
    ctx.fillRect(0, 0, w, h);
    const blobs = [
        { x: 0.6, y: 0.3, r: 180, c: 'rgba(13,40,90,0.9)' },
        { x: 0.85, y: 0.7, r: 140, c: 'rgba(8,25,65,0.8)' },
        { x: 0.3, y: 0.6, r: 160, c: 'rgba(6,18,50,0.7)' },
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
}

function drawGameCard(canvas, hue, sat, name) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.fillStyle = `hsl(${hue},${sat}%,10%)`; ctx.fillRect(0, 0, w, h);

    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, `hsla(${hue + 20},${sat}%,25%,0.8)`);
    g.addColorStop(1, `hsla(${hue - 20},${sat}%,5%,0.9)`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.5)`;
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Wrap text logic
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
    root: { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#080c10', color: '#c9d8e8', fontFamily: "'Inter', sans-serif", fontSize: 13, overflowY: 'auto', scrollbarWidth: 'none' },
    hero: { position: 'relative', height: 220, overflow: 'hidden', flexShrink: 0 },
    heroCanvas: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' },
    heroFade: { position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,12,16,0) 0%, rgba(8,12,16,0.55) 55%, rgba(8,12,16,1) 100%)' },
    heroFadeSide: { position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(8,12,16,0.75) 0%, transparent 65%)' },
    topBar: { position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', padding: '8px 12px', gap: 10, zIndex: 2 },
    topBarLabel: { fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.15em' },
    heroContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 20px 18px', display: 'flex', alignItems: 'flex-end', gap: 16, zIndex: 2 },
    avatarWrap: { position: 'relative', flexShrink: 0 },
    avatar: { width: 76, height: 76, borderRadius: 12, border: '3px solid #4d9de0', display: 'block', objectFit: 'cover' },
    avatarFallback: { width: 76, height: 76, borderRadius: 12, border: '3px solid #4d9de0', background: '#0d2a45', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 900, color: '#fff' },
    onlinePip: { position: 'absolute', bottom: -2, right: -2, width: 15, height: 15, borderRadius: '50%', border: '3px solid #080c10' },
    heroMeta: { paddingBottom: 4, flex: 1 },
    pname: { fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1.1, marginBottom: 3, textShadow: '0 2px 12px rgba(0,0,0,0.8)' },
    psub: { fontSize: 11, color: '#6e8898', marginBottom: 8, fontWeight: 500 },
    pbadges: { display: 'flex', gap: 6, flexWrap: 'wrap' },
    pb: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700 },
    pbGreen: { background: 'rgba(63,185,80,0.15)', color: '#3fb950', border: '1px solid rgba(63,185,80,0.3)' },
    pbBlue: { background: 'rgba(77,157,224,0.15)', color: '#4d9de0', border: '1px solid rgba(77,157,224,0.3)' },
    pbDot: { width: 5, height: 5, borderRadius: '50%', background: 'currentColor', flexShrink: 0 },

    statsStrip: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 },
    sc: { padding: '13px 16px', display: 'flex', flexDirection: 'column', gap: 1 },
    scBorder: { borderRight: '1px solid rgba(255,255,255,0.06)' },
    sn: { fontSize: 19, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' },
    sl: { fontSize: 10, fontWeight: 700, color: '#384c5a', textTransform: 'uppercase', letterSpacing: '0.1em' },
    ss: { fontSize: 10, color: '#4a6070' },

    body: { flex: 1, overflowY: 'auto', scrollbarWidth: 'none' },
    section: { padding: '14px 16px 0' },
    secLabel: { fontSize: 10, fontWeight: 700, color: '#384c5a', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12, display: 'flex', justifyContent: 'space-between' },
    secLink: { color: '#4d9de0', fontWeight: 600, textTransform: 'none', letterSpacing: 0, fontSize: 11 },

    hwBlock: { background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: 16, display: 'flex', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.05)', marginBottom: 4 },
    hwItem: { display: 'flex', alignItems: 'center', gap: 10 },
    hwTextWrap: { display: 'flex', flexDirection: 'column' },
    hwTitle: { fontSize: 11, fontWeight: 700, color: '#fff' },
    hwSub: { fontSize: 9, textTransform: 'uppercase', color: '#6e8898', letterSpacing: '0.1em' },

    gamesGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 4 },
    gameCard: { borderRadius: 8, overflow: 'hidden', cursor: 'pointer', position: 'relative', aspectRatio: '2/3', border: '1px solid rgba(255,255,255,0.05)' },
    gcImg: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' },
    gcOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(8,12,16,0.95) 100%)' },
    gcContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px' },
    gcName: { fontSize: 10, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 2 },
    gcHrs: { fontSize: 9, color: '#4d9de0', fontWeight: 600 },

    achList: { display: 'flex', flexDirection: 'column', gap: 1, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', marginBottom: 8 },
    achRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#0e1419' },
    achIcon: { width: 36, height: 36, borderRadius: 6, flexShrink: 0, objectFit: 'cover' },
    achInfo: { flex: 1, minWidth: 0 },
    achName: { fontSize: 11, fontWeight: 700, color: '#e0eaf4', marginBottom: 1 },
    achDesc: { fontSize: 10, color: '#4a6070', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
};

const SteamWindow = WindowWrapper(Steam, "steam");
export default SteamWindow;