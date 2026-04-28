import React, { useEffect, useState } from 'react';
import WindowWrapper from '#hoc/WindowWrapper';
import WindowControls from '#components/WindowControls';
import { Play, Pause, SkipBack, SkipForward, Music, BarChart2 } from 'lucide-react';

const Spotify = () => {
    const [activeTab, setActiveTab] = useState('live');
    const [liveTrack, setLiveTrack] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. Fetch Live Music (Loops every 15s)
    useEffect(() => {
        const fetchLive = async () => {
            try {
                const liveRes = await fetch('/.netlify/functions/spotify');
                const liveData = await liveRes.json();
                setLiveTrack(liveData.isPlaying ? liveData : null);
            } catch (error) {
                console.error("Live Track Error", error);
            }
        };

        fetchLive();
        const interval = setInterval(fetchLive, 15000);
        return () => clearInterval(interval);
    }, []);

    // 2. Fetch Stats (Only runs ONCE when the component loads)
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const statsRes = await fetch('/.netlify/functions/spotify-stats');
                const statsData = await statsRes.json();
                if (statsData && statsData.tracks) {
                    setStats(statsData);
                }
            } catch (error) {
                console.error("Stats Error", error);
            }
            setLoading(false);
        };

        fetchStats();
    }, []);

    return (
        <div className="w-[380px] h-[550px] flex flex-col bg-[#121212] rounded-xl overflow-hidden shadow-2xl border border-gray-800">
            <div id='window-header' className="flex items-center px-4 py-2 bg-[#181818] border-b border-[#282828] justify-between">
                <div className="flex items-center">
                    <WindowControls target="spotify" />
                    <p className="ml-4 text-xs font-bold text-gray-400 tracking-widest uppercase">Spotify</p>
                </div>
                <div className="flex gap-3 text-gray-400">
                    <Music
                        size={16}
                        className={`cursor-pointer hover:text-white transition-colors ${activeTab === 'live' && 'text-green-500'}`}
                        onClick={() => setActiveTab('live')}
                    />
                    <BarChart2
                        size={16}
                        className={`cursor-pointer hover:text-white transition-colors ${activeTab === 'stats' && 'text-green-500'}`}
                        onClick={() => setActiveTab('stats')}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-[#282828] to-[#121212] text-white custom-scrollbar relative">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <Music className="w-10 h-10 animate-pulse text-green-500" />
                    </div>
                ) : activeTab === 'live' ? (
                    <div className="flex flex-col items-center h-full">
                        {liveTrack ? (
                            <>
                                <a href={liveTrack.songUrl} target="_blank" rel="noreferrer" className="w-56 h-56 mt-4 mb-8 shadow-2xl rounded-md overflow-hidden group">
                                    <img src={liveTrack.albumArt} alt={liveTrack.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </a>
                                <div className="w-full text-center mb-8">
                                    <h3 className="text-2xl font-bold truncate text-white">{liveTrack.title}</h3>
                                    <p className="text-base text-gray-400 truncate">{liveTrack.artist}</p>
                                </div>
                                <div className="flex items-center gap-8 mt-auto mb-6">
                                    <SkipBack className="w-7 h-7 text-gray-400 hover:text-white cursor-pointer" />
                                    <div className="w-14 h-14 flex items-center justify-center bg-white rounded-full hover:scale-105 transition-transform cursor-pointer text-black">
                                        {liveTrack.isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 ml-1 fill-current" />}
                                    </div>
                                    <SkipForward className="w-7 h-7 text-gray-400 hover:text-white cursor-pointer" />
                                </div>
                                {liveTrack.isPlaying && (
                                    <div className="absolute top-4 right-4 flex items-center gap-2">
                                        <span className="flex h-2 w-2 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                        <p className="text-[10px] uppercase font-bold text-green-500 tracking-wider">Live</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <Music className="w-12 h-12 text-gray-600 mb-4" />
                                <p className="text-gray-400 text-sm">Not playing anything right now.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
                        <div className="flex flex-wrap gap-2 justify-center">
                            {stats?.topGenres?.map(genre => (
                                <span key={genre} className="px-3 py-1 bg-white/10 text-xs text-white rounded-full uppercase tracking-wider font-semibold border border-white/5">
                                    {genre}
                                </span>
                            ))}
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">On Repeat</h4>
                            <div className="flex flex-col gap-3">
                                {stats?.tracks?.map((track, i) => (
                                    <a key={i} href={track.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 group hover:bg-white/5 p-2 rounded-md transition-colors">
                                        <img src={track.cover} alt="Cover" className="w-10 h-10 rounded shadow-sm" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-white truncate group-hover:text-green-400 transition-colors">{track.title}</p>
                                            <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="pb-4">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Top Artists</h4>
                            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                                {stats?.artists?.map((artist, i) => (
                                    <a key={i} href={artist.url} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 min-w-[72px] group">
                                        <img src={artist.image} alt={artist.name} className="w-16 h-16 rounded-full object-cover shadow-md group-hover:scale-105 transition-transform" />
                                        <p className="text-[10px] text-gray-300 font-medium text-center truncate w-full group-hover:text-green-400">{artist.name}</p>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Recently Played */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Recently Played</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {stats?.recentlyPlayed?.map((track, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-white/5 p-2 rounded-md">
                                        <img src={track.cover} className="w-8 h-8 rounded" alt="" />
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold truncate">{track.title}</p>
                                            <p className="text-[9px] text-gray-500 truncate">{track.artist}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Public Playlists */}
                        <div className="pb-8">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">My Collections</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {stats?.playlists?.map((p, i) => (
                                    <a key={i} href={p.url} target="_blank" rel="noreferrer" className="group">
                                        <div className="relative aspect-square mb-2 overflow-hidden rounded-lg shadow-lg">
                                            <img src={p.cover} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" alt="" />
                                        </div>
                                        <p className="text-[11px] font-bold truncate">{p.name}</p>
                                        <p className="text-[9px] text-gray-500">{p.tracks} songs</p>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const SpotifyWindow = WindowWrapper(Spotify, "spotify");
export default SpotifyWindow;