import React, { useEffect, useState } from 'react';
import WindowWrapper from '#hoc/WindowWrapper';
import WindowControls from '#components/WindowControls';
import { Gamepad2, Clock, Trophy, Target } from 'lucide-react';

const Steam = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/.netlify/functions/steam')
            .then(res => res.json())
            .then(json => { setData(json); setLoading(false); });
    }, []);

    if (loading) return <div className="h-full flex items-center justify-center bg-[#171a21]"><Gamepad2 className="animate-spin text-[#66c0f4]" size={40} /></div>;

    return (
        <div className="w-full h-full flex flex-col bg-[#171a21] text-[#c7d5e0] font-sans">
            <div id='window-header' className="flex items-center px-4 py-2 bg-[#1b2838] border-b border-black/50">
                <WindowControls target="steam" />
                <p className="ml-4 text-[10px] font-bold uppercase tracking-widest text-[#66c0f4]">Steam Cloud Profile</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">

                {/* Profile Hero */}
                <div className="flex items-center gap-6 mb-8 bg-gradient-to-r from-[#1b2838] to-[#2a475e] p-6 rounded-2xl shadow-xl border border-white/5">
                    <div className="relative">
                        <img src={data.avatar} className="w-24 h-24 rounded-md border-[3px] border-[#66c0f4] shadow-2xl" alt="" />
                        <div className="absolute -bottom-3 -right-3 bg-[#66c0f4] text-black text-[10px] font-black px-2 py-1 rounded-full border-2 border-[#1b2838]">
                            LVL {data.level}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tight">{data.personaname}</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${data.status === 'Online' ? 'bg-[#a3cc26] text-[#a3cc26]' : 'bg-gray-500 text-gray-500'}`}></span>
                            <p className="text-xs font-bold uppercase tracking-widest">{data.status}</p>
                        </div>
                        {data.current_game && (
                            <p className="mt-2 text-xs font-bold text-[#a3cc26] uppercase tracking-widest">In-Game: {data.current_game}</p>
                        )}
                    </div>
                </div>

                {/* Lifetime Stats */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="bg-[#1b2838] p-4 rounded-xl border border-white/5 flex flex-col gap-1 shadow-lg">
                        <div className="flex items-center gap-2 text-[#66c0f4] mb-2"><Clock size={16} /><p className="text-[10px] uppercase font-bold tracking-widest">Time Wasted</p></div>
                        <p className="text-2xl font-black text-white">{data.total_playtime} <span className="text-sm font-bold text-gray-500">HRS</span></p>
                    </div>
                    <div className="bg-[#1b2838] p-4 rounded-xl border border-white/5 flex flex-col gap-1 shadow-lg">
                        <div className="flex items-center gap-2 text-[#66c0f4] mb-2"><Trophy size={16} /><p className="text-[10px] uppercase font-bold tracking-widest">Library Size</p></div>
                        <p className="text-2xl font-black text-white">{data.total_games} <span className="text-sm font-bold text-gray-500">GAMES</span></p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    {/* Recently Played - Vertical Posters */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1 border-b border-white/10 pb-2">Recent Ops</h4>
                        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                            {data.recent.map((game, i) => (
                                <div key={i} className="flex flex-col gap-2 min-w-[100px] group">
                                    <div className="w-[100px] h-[150px] rounded-lg overflow-hidden shadow-xl border border-white/10 relative">
                                        <img src={game.capsule} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" alt={game.name} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#171a21] to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                            <p className="text-[10px] font-bold text-white leading-tight drop-shadow-md">{game.playtime_2weeks}h past 2 weeks</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hall of Fame - Horizontal Banners */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1 border-b border-white/10 pb-2">All-Time Greats</h4>
                        <div className="flex flex-col gap-3">
                            {data.most_played.map((game, i) => (
                                <div key={i} className="relative h-16 rounded-lg overflow-hidden shadow-lg group border border-white/5">
                                    <img src={game.banner} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#171a21] via-[#171a21]/80 to-transparent p-3 flex flex-col justify-center">
                                        <p className="text-xs font-bold text-white truncate max-w-[70%] drop-shadow-lg">{game.name}</p>
                                        <p className="text-[10px] font-bold text-[#66c0f4] drop-shadow-md">{game.playtime} hrs</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

const SteamWindow = WindowWrapper(Steam, "steam");
export default SteamWindow;