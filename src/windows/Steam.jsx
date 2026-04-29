import React, { useEffect, useState } from 'react';
import WindowWrapper from '#hoc/WindowWrapper';
import WindowControls from '#components/WindowControls';
import { Gamepad2, Clock, Trophy, BadgeAlert, Coins, Cpu, Monitor, Zap } from 'lucide-react';

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

            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide relative">

                {/* Profile Hero */}
                <div className="flex items-center gap-6 mb-8 bg-gradient-to-r from-[#1b2838] to-[#2a475e] p-6 rounded-2xl shadow-xl border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                        <Gamepad2 size={120} />
                    </div>
                    <div className="relative z-10">
                        <img src={data.avatar} className="w-24 h-24 rounded-md border-[3px] border-[#66c0f4] shadow-2xl" alt="" />
                        <div className="absolute -bottom-3 -right-3 bg-gradient-to-br from-[#66c0f4] to-[#1b2838] text-white text-[10px] font-black px-3 py-1 rounded-full border-2 border-[#1b2838] shadow-lg">
                            LVL {data.level}
                        </div>
                    </div>
                    <div className="z-10">
                        <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md">{data.personaname}</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${data.status === 'Online' ? 'bg-[#a3cc26] text-[#a3cc26]' : 'bg-gray-500 text-gray-500'}`}></span>
                            <p className="text-xs font-bold uppercase tracking-widest">{data.status}</p>
                        </div>
                        {data.current_game && (
                            <p className="mt-2 text-[11px] font-bold text-[#a3cc26] uppercase tracking-widest bg-[#a3cc26]/10 px-2 py-1 rounded-md inline-block border border-[#a3cc26]/20">In-Game: {data.current_game}</p>
                        )}
                    </div>
                </div>

                {/* The "Milked" Metric Grid */}
                <div className="grid grid-cols-4 gap-3 mb-10">
                    <div className="bg-[#1b2838] p-3 rounded-xl border border-white/5 flex flex-col justify-between shadow-lg">
                        <Clock size={16} className="text-[#66c0f4] mb-2" />
                        <p className="text-xl font-black text-white leading-none">{data.total_playtime} <span className="text-[10px] text-gray-500 font-bold">HRS</span></p>
                        <p className="text-[9px] uppercase font-bold tracking-widest text-gray-400 mt-1">Playtime</p>
                    </div>
                    <div className="bg-[#1b2838] p-3 rounded-xl border border-white/5 flex flex-col justify-between shadow-lg">
                        <Trophy size={16} className="text-[#a3cc26] mb-2" />
                        <p className="text-xl font-black text-white leading-none">{data.total_games} <span className="text-[10px] text-gray-500 font-bold">OWNED</span></p>
                        <p className="text-[9px] uppercase font-bold tracking-widest text-gray-400 mt-1">Library</p>
                    </div>
                    <div className="bg-[#1b2838] p-3 rounded-xl border border-white/5 flex flex-col justify-between shadow-lg">
                        <Coins size={16} className="text-yellow-500 mb-2" />
                        <p className="text-xl font-black text-white leading-none"><span className="text-[12px] text-gray-500">$</span>{data.estimated_value}</p>
                        <p className="text-[9px] uppercase font-bold tracking-widest text-gray-400 mt-1">Est. Value</p>
                    </div>
                    <div className="bg-[#1b2838] p-3 rounded-xl border border-white/5 flex flex-col justify-between shadow-lg">
                        <BadgeAlert size={16} className="text-purple-400 mb-2" />
                        <p className="text-xl font-black text-white leading-none">{data.account_age} <span className="text-[10px] text-gray-500 font-bold">YRS</span></p>
                        <p className="text-[9px] uppercase font-bold tracking-widest text-gray-400 mt-1">Acct Age</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-10">
                    {/* Recently Played - Vertical Posters */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1 border-b border-white/10 pb-2">Active Duty</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {data.recent.map((game, i) => (
                                <div key={i} className="flex flex-col gap-1 group">
                                    <div className="w-full aspect-[2/3] rounded-lg overflow-hidden shadow-xl border border-white/10 relative">
                                        <img src={game.capsule} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" alt={game.name} />
                                        <div className="absolute top-0 right-0 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-bl-lg">
                                            <p className="text-[9px] font-bold text-[#66c0f4]">{game.playtime_2weeks}h</p>
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-300 truncate mt-1 px-1">{game.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hall of Fame - Horizontal Banners */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1 border-b border-white/10 pb-2">Hall of Fame</h4>
                        <div className="flex flex-col gap-3">
                            {data.most_played.map((game, i) => (
                                <div key={i} className="relative h-16 rounded-lg overflow-hidden shadow-lg group border border-white/5">
                                    <img src={game.banner} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#171a21] via-[#171a21]/90 to-transparent p-3 flex flex-col justify-center">
                                        <p className="text-xs font-bold text-white truncate max-w-[80%] drop-shadow-lg">{game.name}</p>
                                        <p className="text-[10px] font-bold text-[#66c0f4] drop-shadow-md">{game.playtime} hrs on record</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Custom Rig Showcase */}
                <div className="w-full bg-[#1b2838]/50 p-5 rounded-xl border border-white/5">
                    <h4 className="text-[10px] font-bold text-[#66c0f4] uppercase tracking-[0.2em] mb-4">Hardware Config</h4>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Cpu className="text-gray-400" size={20} />
                            <div>
                                <p className="text-xs font-bold text-white">Intel Core i7-14650HX</p>
                                <p className="text-[9px] text-gray-500 uppercase tracking-widest">Processor</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Zap className="text-green-500" size={20} />
                            <div>
                                <p className="text-xs font-bold text-white">NVIDIA RTX 5060</p>
                                <p className="text-[9px] text-gray-500 uppercase tracking-widest">Graphics</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Monitor className="text-gray-400" size={20} />
                            <div>
                                <p className="text-xs font-bold text-white">MSI MAG 1440p</p>
                                <p className="text-[9px] text-gray-500 uppercase tracking-widest">Display</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

const SteamWindow = WindowWrapper(Steam, "steam");
export default SteamWindow;