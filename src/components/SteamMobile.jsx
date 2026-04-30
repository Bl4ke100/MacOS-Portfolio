import React, { useEffect, useState } from 'react';
import { Gamepad2, Clock, Trophy, BadgeAlert, History } from 'lucide-react';

const SteamMobile = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/.netlify/functions/steam')
            .then(res => res.json())
            .then(json => { setData(json); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="w-full h-full bg-[#171a21] flex flex-col items-center justify-center text-[#c7d5e0]">
                <Gamepad2 className="animate-spin text-[#66c0f4]" size={48} />
                <p className="mt-4 font-bold tracking-widest text-sm text-[#66c0f4] uppercase">Loading Profile</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="w-full h-full bg-[#171a21] flex items-center justify-center text-[#c7d5e0]">
                <p className="font-bold">Failed to load Steam profile.</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-[#171a21] flex flex-col font-sans select-none overflow-y-auto custom-scrollbar pb-24 relative text-[#c7d5e0]">
            {/* Header / Hero */}
            <div className="w-full bg-gradient-to-b from-[#1b2838] to-[#171a21] border-b border-white/5 shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay"></div>
                
                {/* Decorative Canvas Background matching Desktop */}
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-0 -left-1/4 w-full h-full bg-radial-gradient from-[rgba(42,71,94,0.8)] to-transparent rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 -right-1/4 w-full h-full bg-radial-gradient from-[rgba(27,40,56,0.9)] to-transparent rounded-full blur-3xl"></div>
                </div>

                <div className="pt-20 pb-6 px-6 relative z-10 flex flex-col items-center">
                    <div className="relative">
                        {data.avatar ? (
                            <img src={data.avatar} alt="Avatar" className="w-28 h-28 rounded-2xl border-2 border-[#66c0f4] object-cover shadow-[0_10px_20px_rgba(0,0,0,0.5)]" />
                        ) : (
                            <div className="w-28 h-28 rounded-2xl border-2 border-[#66c0f4] bg-[#1b2838] flex items-center justify-center text-3xl font-black text-white">GS</div>
                        )}
                        <div className={`absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full border-4 border-[#171a21] ${data.status === 'Online' ? 'bg-[#90ba3c]' : 'bg-[#898989]'}`}></div>
                    </div>
                    
                    <h1 className="text-[28px] font-bold text-white mt-5 tracking-tight drop-shadow-md text-center">{data.personaname}</h1>
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[13px] text-[#8f98a0]">Steam Level</span>
                        <span className="border border-[#66c0f4] rounded-full px-2 py-0.5 text-[#66c0f4] font-bold text-[11px]">{data.level}</span>
                    </div>

                    <div className="mt-5 flex flex-wrap justify-center gap-3">
                        <span className={`text-[13px] font-bold ${data.status === 'Online' ? 'text-[#90ba3c]' : 'text-[#898989]'}`}>{data.status}</span>
                        {data.current_game && (
                            <span className="text-[13px] font-bold text-[#90ba3c] flex items-center gap-1.5 bg-[#90ba3c]/10 px-2.5 py-1 rounded-full border border-[#90ba3c]/20 shadow-sm">
                                <Gamepad2 size={14} /> In-Game: {data.current_game}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="px-5 py-6 shrink-0">
                <div className="grid grid-cols-2 gap-3">
                    <StatCard icon={<Clock size={20} color="#66c0f4" />} value={data.total_playtime} unit="hrs" label="Total Playtime" />
                    <StatCard icon={<Trophy size={20} color="#c6d4df" />} value={data.total_games} unit="games" label="In Library" />
                    <StatCard icon={<History size={20} color="#90ba3c" />} value={data.avg_playtime} unit="hrs" label="Avg Per Game" />
                    <StatCard icon={<BadgeAlert size={20} color="#b0c4de" />} value={data.account_age} unit="yrs" label="Account Age" />
                </div>
            </div>

            {/* Recent Activity */}
            {data.recent?.length > 0 && (
                <div className="px-5 py-2 shrink-0">
                    <div className="border-b border-[#2a475e] pb-2 mb-4 flex items-end gap-3">
                        <h2 className="text-white text-[15px] uppercase font-semibold tracking-wider">Recent Activity</h2>
                        <span className="text-[11px] text-[#8f98a0] pb-0.5 font-medium">{data.recent.length} games</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {data.recent.map((game, i) => (
                            <GameCard key={i} game={game} hue={[200, 210, 190, 220][i]} />
                        ))}
                    </div>
                </div>
            )}

            {/* Library Showcase */}
            {data.library?.length > 0 && (
                <div className="px-5 py-4 mt-2 shrink-0">
                    <div className="border-b border-[#2a475e] pb-2 mb-4">
                        <h2 className="text-white text-[15px] uppercase font-semibold tracking-wider">Most Played</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {data.library.slice(0, 4).map((game, i) => (
                            <GameCard key={i} game={game} hue={(200 + (i * 10)) % 360} />
                        ))}
                    </div>
                </div>
            )}
            
            {/* Achievements - Simplifed for Mobile */}
            {data.achievements?.length > 0 && (
                <div className="px-5 py-2 mt-2 shrink-0">
                    <div className="border-b border-[#2a475e] pb-2 mb-4 flex flex-col">
                        <h2 className="text-white text-[15px] uppercase font-semibold tracking-wider">Latest Unlocks</h2>
                        <span className="text-[11px] text-[#8f98a0] font-medium mt-0.5">{data.achievements[0]?.gameName}</span>
                    </div>
                    <div className="flex flex-col gap-3">
                        {data.achievements.map((ach, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-[#1b2838] rounded-xl border border-white/5 shadow-sm">
                                <img src={ach.icon} alt={ach.name} className="w-12 h-12 rounded bg-black/50 object-cover shadow-sm" />
                                <div className="flex-1 min-w-0">
                                    <div className="text-[13px] font-bold text-white truncate">{ach.name}</div>
                                    <div className="text-[11px] text-[#8f98a0] mt-0.5 leading-tight line-clamp-2">{ach.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ icon, value, unit, label }) => (
    <div className="bg-gradient-to-b from-[#1b2838] to-[#171a21] rounded-2xl p-4 border border-white/5 shadow-md flex flex-col items-center text-center">
        <div className="mb-2.5 bg-black/20 p-2.5 rounded-[12px]">{icon}</div>
        <div className="text-[22px] font-bold text-white leading-tight">
            {value} <span className="text-[11px] text-[#8f98a0] uppercase font-bold tracking-wide ml-0.5">{unit}</span>
        </div>
        <div className="text-[10px] text-[#66c0f4] uppercase font-extrabold tracking-widest mt-1.5">{label}</div>
    </div>
);

const GameCard = ({ game, hue }) => {
    return (
        <div className="rounded-[14px] overflow-hidden relative aspect-[2/3] shadow-lg border border-white/10 active:scale-95 transition-transform">
            {game.capsule ? (
                <img src={game.capsule} alt={game.name} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
            ) : (
                <div className="w-full h-full bg-[#1b2838] flex items-center justify-center p-3 text-center text-[13px] leading-snug font-bold text-white/90" style={{ background: `linear-gradient(to bottom, hsla(${hue}, 40%, 30%, 1), hsla(${hue}, 30%, 15%, 1))` }}>
                    {game.name}
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="text-[13px] font-extrabold text-white truncate drop-shadow-md tracking-wide">{game.name}</div>
                <div className="text-[11px] font-bold text-[#66c0f4] mt-0.5 tracking-wide">{game.playtime} {game.label}</div>
            </div>
        </div>
    );
};

export default SteamMobile;
