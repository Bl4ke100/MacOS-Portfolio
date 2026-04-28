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
        <div className="w-full h-full flex flex-col bg-[#ffffff] rounded-xl overflow-hidden shadow-2xl border border-gray-200">
            <div id='window-header' className="flex items-center px-4 py-2 bg-[#f3f3f3] border-b border-gray-300 justify-between">
                <div className="flex items-center">
                    <WindowControls target="spotify" />
                    <p className="ml-4 text-xs font-bold text-gray-500 tracking-widest uppercase">Spotify</p>
                </div>
                <div className="flex gap-3 text-gray-400">
                    <Music
                        size={16}
                        className={`cursor-pointer hover:text-black transition-colors ${activeTab === 'live' && 'text-[#1DB954]'}`}
                        onClick={() => setActiveTab('live')}
                    />
                    <BarChart2
                        size={16}
                        className={`cursor-pointer hover:text-black transition-colors ${activeTab === 'stats' && 'text-[#1DB954]'}`}
                        onClick={() => setActiveTab('stats')}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-[#f9f9f9] to-[#ffffff] text-black custom-scrollbar relative">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <Music className="w-10 h-10 animate-pulse text-[#1DB954]" />
                    </div>
                ) : activeTab === 'live' ? (
                    <div className="flex flex-col items-center h-full w-full">
                        {liveTrack ? (
                            <>
                                <a href={liveTrack.songUrl} target="_blank" rel="noreferrer" className="w-56 h-56 mt-4 mb-8 shadow-xl rounded-md overflow-hidden group border border-gray-100">
                                    <img src={liveTrack.albumArt} alt={liveTrack.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </a>
                                <div className="w-full text-center mb-8">
                                    <h3 className="text-2xl font-bold truncate text-gray-900 px-4">{liveTrack.title}</h3>
                                    <p className="text-base text-gray-500 truncate px-4">{liveTrack.artist}</p>
                                </div>
                                <div className="flex items-center gap-8 mt-auto mb-6">
                                    <SkipBack className="w-7 h-7 text-gray-400 hover:text-black cursor-pointer" />
                                    <div className="w-14 h-14 flex items-center justify-center bg-black rounded-full hover:scale-105 transition-transform cursor-pointer text-white shadow-lg">
                                        {liveTrack.isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 ml-1 fill-current" />}
                                    </div>
                                    <SkipForward className="w-7 h-7 text-gray-400 hover:text-black cursor-pointer" />
                                </div>
                                {liveTrack.isPlaying && (
                                    <div className="absolute top-4 right-4 flex items-center gap-2">
                                        <span className="flex h-2 w-2 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1DB954]"></span>
                                        </span>
                                        <p className="text-[10px] uppercase font-bold text-[#1DB954] tracking-wider">Live</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <Music className="w-12 h-12 text-gray-300 mb-4" />
                                <p className="text-gray-400 text-sm">Not playing anything right now.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-8 animate-in fade-in duration-300 w-full">

                        {/* Genres (Light) */}
                        <div className="flex flex-wrap gap-2 justify-center w-full">
                            {stats?.topGenres?.map(genre => (
                                <span key={genre} className="px-3 py-1 bg-gray-100 text-[10px] text-gray-600 rounded-full uppercase tracking-wider font-semibold border border-gray-200">
                                    {genre}
                                </span>
                            ))}
                        </div>

                        {/* TWO COLUMN SECTION: On Repeat & Top Artists */}
                        <div className="flex gap-8 w-full">
                            {/* On Repeat (Left Column) */}
                            <div className="flex-1">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">On Repeat</h4>
                                <div className="flex flex-col gap-2">
                                    {stats?.tracks?.map((track, i) => (
                                        <a key={i} href={track.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 group hover:bg-gray-50 p-2 rounded-md transition-colors border border-transparent hover:border-gray-100">
                                            <img src={track.cover} alt="" className="w-12 h-12 rounded shadow-sm flex-shrink-0" />
                                            <div className="flex-1 min-w-0 text-left">
                                                <p className="text-sm font-bold text-gray-900 truncate group-hover:text-[#1DB954] transition-colors">{track.title}</p>
                                                <p className="text-xs text-gray-500 truncate">{track.artist}</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Top Artists (Right Column) */}
                            <div className="w-[120px]">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Artists</h4>
                                <div className="flex flex-col gap-4">
                                    {stats?.artists?.map((artist, i) => (
                                        <div key={i} className="flex flex-col items-center gap-1 group">
                                            <img src={artist.image} className="w-14 h-14 rounded-full object-cover shadow-sm border border-gray-200 group-hover:border-[#1DB954] transition-colors" alt="" />
                                            <p className="text-[9px] text-gray-500 font-medium text-center truncate w-full">{artist.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Recently Played Grid */}
                        <div className="w-full">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Recently Played</h4>
                            <div className="grid grid-cols-2 gap-3 w-full">
                                {stats?.recentlyPlayed?.map((track, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-gray-50 p-2 rounded-md border border-gray-100">
                                        <img src={track.cover} className="w-10 h-10 rounded flex-shrink-0" alt="" />
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold text-gray-800 truncate">{track.title}</p>
                                            <p className="text-[9px] text-gray-500 truncate">{track.artist}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* My Collections Grid */}
                        <div className="pb-8 w-full">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Collections</h4>
                            <div className="grid grid-cols-3 gap-4 w-full">
                                {stats?.playlists?.map((p, i) => (
                                    <a key={i} href={p.url} target="_blank" rel="noreferrer" className="group block w-full text-center">
                                        <div className="relative aspect-square mb-2 overflow-hidden rounded-lg shadow-md border border-gray-200">
                                            <img src={p.cover} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" alt="" />
                                        </div>
                                        <p className="text-[10px] font-bold truncate text-gray-800 group-hover:text-[#1DB954] transition-colors">{p.name}</p>
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