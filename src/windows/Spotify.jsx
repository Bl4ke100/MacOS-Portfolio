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
        <div className="w-full h-full flex flex-col bg-[#121212] rounded-xl overflow-hidden shadow-2xl border border-gray-800">
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
                    <div className="flex flex-col items-center h-full w-full">
                        {liveTrack ? (
                            <>
                                <a href={liveTrack.songUrl} target="_blank" rel="noreferrer" className="w-64 h-64 mt-4 mb-8 shadow-2xl rounded-md overflow-hidden group">
                                    <img src={liveTrack.albumArt} alt={liveTrack.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </a>
                                <div className="w-full text-center mb-8 px-4">
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
                                <p className="text-gray-400 text-sm font-medium">Not playing anything right now.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-10 animate-in fade-in duration-300 w-full">
                        {/* Header Genres */}
                        <div className="flex flex-wrap gap-2">
                            {stats?.topGenres?.map(genre => (
                                <span key={genre} className="px-3 py-1 bg-white/10 text-[10px] text-white rounded-full uppercase tracking-widest font-bold border border-white/5 shadow-sm">
                                    {genre}
                                </span>
                            ))}
                        </div>

                        {/* Main Content Grid: Tracks (Left) & Artists (Right) */}
                        <div className="grid grid-cols-5 gap-8 w-full">
                            {/* On Repeat (3/5 width) */}
                            <div className="col-span-3">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">On Repeat</h4>
                                <div className="flex flex-col gap-2">
                                    {stats?.tracks?.map((track, i) => (
                                        <a key={i} href={track.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 group hover:bg-white/5 p-2 rounded-md transition-all w-full">
                                            <img src={track.cover} alt="" className="w-12 h-12 rounded shadow-md flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-white truncate group-hover:text-green-400 transition-colors">{track.title}</p>
                                                <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Top Artists Column (2/5 width) */}
                            <div className="col-span-2">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Top Artists</h4>
                                <div className="flex flex-col gap-4">
                                    {stats?.artists?.slice(0, 5).map((artist, i) => (
                                        <div key={i} className="flex items-center gap-3 group">
                                            <img src={artist.image} className="w-12 h-12 rounded-full object-cover shadow-lg border border-white/10 group-hover:scale-105 transition-transform" alt="" />
                                            <p className="text-xs text-gray-300 font-bold truncate group-hover:text-white transition-colors">{artist.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Recently Played - Grid Layout */}
                        <div className="w-full">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Recently Played</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {stats?.recentlyPlayed?.slice(0, 4).map((track, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-white/5 p-2 rounded-lg border border-white/5 hover:bg-white/10 transition-colors cursor-default">
                                        <img src={track.cover} className="w-10 h-10 rounded shadow-sm" alt="" />
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold text-white truncate">{track.title}</p>
                                            <p className="text-[9px] text-gray-500 truncate">{track.artist}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* My Collections */}
                        <div className="pb-12 w-full">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">My Collections</h4>
                            <div className="grid grid-cols-2 gap-6 w-full">
                                {stats?.playlists?.map((p, i) => (
                                    <a key={i} href={p.url} target="_blank" rel="noreferrer" className="group block w-full">
                                        <div className="relative aspect-square mb-3 overflow-hidden rounded-xl shadow-xl bg-[#282828]">
                                            <img src={p.cover} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-in-out" alt={p.name} />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                                        </div>
                                        <p className="text-[12px] font-bold truncate text-white group-hover:text-green-400 transition-colors">{p.name}</p>
                                        <p className="text-[10px] text-gray-500 font-medium">{p.tracks} tracks</p>
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