import React, { useEffect, useState } from 'react';
import WindowWrapper from '#hoc/WindowWrapper';
import WindowControls from '#components/WindowControls';
import { Gamepad2, Clock, Trophy } from 'lucide-react';

const Steam = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/.netlify/functions/steam')
            .then(res => res.json())
            .then(json => { setData(json); setLoading(false); });
    }, []);

    if (loading) return <div className="h-full flex items-center justify-center bg-[#1b2838]"><Gamepad2 className="animate-spin text-blue-400" /></div>;

    return (
        <div className="w-full h-full flex flex-col bg-[#1b2838] text-[#c7d5e0] font-sans">
            <div id='window-header' className="flex items-center px-4 py-2 bg-[#171a21]">
                <WindowControls target="steam" />
                <p className="ml-4 text-[10px] font-bold uppercase tracking-widest text-blue-400">Steam Cloud Profile</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                {/* Profile Header */}
                <div className="flex items-center gap-6 mb-10 bg-[#2a475e]/30 p-6 rounded-2xl border border-white/5">
                    <img src={data.avatar} className="w-24 h-24 rounded-full border-4 border-blue-500/50 shadow-2xl" alt="" />
                    <div>
                        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">{data.personaname}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`w-2 h-2 rounded-full ${data.status === 'Online' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                            <p className="text-xs font-bold uppercase text-gray-400">{data.status}</p>
                        </div>
                        {data.current_game && (
                            <p className="mt-2 text-sm font-bold text-blue-400 animate-pulse">Playing: {data.current_game}</p>
                        )}
                    </div>
                </div>

                {/* The "Milk" Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="bg-[#171a21] p-4 rounded-xl border border-white/5 flex items-center gap-4">
                        <Clock className="text-blue-400" size={32} />
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-500">Total Playtime</p>
                            <p className="text-xl font-black text-white">{data.total_playtime} hrs</p>
                        </div>
                    </div>
                    <div className="bg-[#171a21] p-4 rounded-xl border border-white/5 flex items-center gap-4">
                        <Trophy className="text-yellow-500" size={32} />
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-500">Games Owned</p>
                            <p className="text-xl font-black text-white">{data.total_games}</p>
                        </div>
                    </div>
                </div>

                {/* Most Played Masterpieces */}
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 px-1">Hall of Fame (Most Played)</h4>
                <div className="flex flex-col gap-3">
                    {data.most_played.map((game, i) => (
                        <div key={i} className="flex items-center justify-between bg-[#171a21]/50 p-4 rounded-xl border border-white/5 group hover:bg-[#2a475e]/50 transition-all">
                            <div className="flex items-center gap-4">
                                <span className="text-lg font-black text-gray-700 w-4 italic">{i + 1}</span>
                                <p className="font-bold text-white group-hover:text-blue-400 transition-colors">{game.name}</p>
                            </div>
                            <p className="text-xs font-bold text-gray-400">{game.playtime} hrs</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const SteamWindow = WindowWrapper(Steam, "steam");
export default SteamWindow;