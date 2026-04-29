import React, { useEffect, useState } from 'react';
import WindowWrapper from '#hoc/WindowWrapper';
import WindowControls from '#components/WindowControls';
import {
    Play, Pause, SkipBack, SkipForward, Music,
    BarChart2, Volume2, Shuffle, Repeat, Heart,
    Home, Search, Library, PlusSquare, Mic2,
    ListMusic, Maximize2, MonitorSpeaker, Clock
} from 'lucide-react';

const Spotify = () => {
    const [activeTab, setActiveTab] = useState('live');
    const [liveTrack, setLiveTrack] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const statsRes = await fetch('/.netlify/functions/spotify-stats');
                const statsData = await statsRes.json();
                if (statsData && statsData.tracks) setStats(statsData);
            } catch (error) {
                console.error("Stats Error", error);
            }
            setLoading(false);
        };
        fetchStats();
    }, []);

    return (
        <div
            className="w-full h-full flex flex-col overflow-hidden shadow-2xl rounded-xl"
            style={{
                background: '#000',
                fontFamily: "'Circular Std', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                width: '1200px',
                height: '750px'
            }}
        >
            {/* ── Window drag bar ── */}
            <div
                id="window-header"
                className="flex items-center px-3 py-2 flex-shrink-0"
                style={{ background: '#000', WebkitAppRegion: 'drag' }}
            >
                <WindowControls target="spotify" />
            </div>

            {/* ── App Body ── */}
            <div className="flex flex-1 gap-1.5 px-1.5 overflow-hidden" style={{ paddingBottom: 0 }}>

                {/* ── Left Sidebar (Condensed) ── */}
                <aside className="flex flex-col gap-1.5 flex-shrink-0" style={{ width: 210 }}>
                    <div className="rounded-lg p-3.5 flex flex-col gap-1" style={{ background: '#121212' }}>
                        <NavItem icon={<Home size={20} />} label="Home" active={activeTab === 'live'} onClick={() => setActiveTab('live')} />
                        <NavItem icon={<Search size={20} />} label="Search" />
                    </div>

                    <div className="rounded-lg flex flex-col flex-1 overflow-hidden" style={{ background: '#121212' }}>
                        <div className="flex items-center justify-between px-4 pt-3 pb-2">
                            <button className="flex items-center gap-2 text-xs font-bold hover:text-white transition-colors" style={{ color: '#b3b3b3' }}>
                                <Library size={20} />
                                <span>Library</span>
                            </button>
                            <PlusSquare size={16} className="text-[#b3b3b3] cursor-pointer hover:text-white" />
                        </div>

                        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1 custom-scrollbar">
                            <div className="flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-white/10 transition-colors cursor-pointer">
                                <div className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0 shadow-md"
                                    style={{ background: 'linear-gradient(135deg,#450af5,#c4efd9)' }}>
                                    <Heart size={14} fill="white" color="white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[13px] font-bold text-white truncate">Liked Songs</p>
                                    <p className="text-[11px] text-[#b3b3b3] truncate">Playlist</p>
                                </div>
                            </div>

                            {stats?.artists?.map((artist, i) => (
                                <div key={i} className="flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-white/10 transition-colors cursor-pointer">
                                    <img src={artist.image} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0 shadow-sm" />
                                    <div className="min-w-0">
                                        <p className="text-[13px] font-bold text-white truncate">{artist.name}</p>
                                        <p className="text-[11px] text-[#b3b3b3] truncate">Artist</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* ── Main Content ── */}
                <main className="flex-1 rounded-lg overflow-hidden flex flex-col relative" style={{ background: '#121212' }}>
                    <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 pt-3 pb-2 flex-shrink-0 bg-gradient-to-b from-black/50 to-transparent">
                        <div className="flex items-center gap-2">
                            <TabBtn active={activeTab === 'live'} onClick={() => setActiveTab('live')}>Now Playing</TabBtn>
                            <TabBtn active={activeTab === 'stats'} onClick={() => setActiveTab('stats')}>Stats</TabBtn>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="h-full flex items-center justify-center">
                                <Music className="w-10 h-10 animate-pulse text-[#1db954]" />
                            </div>
                        ) : activeTab === 'live' ? (
                            <LiveView liveTrack={liveTrack} stats={stats} />
                        ) : (
                            <StatsView stats={stats} />
                        )}
                    </div>
                </main>

                {/* ── Right Panel (Condensed) ── */}
                {liveTrack && (
                    <aside className="flex-shrink-0 rounded-lg flex flex-col overflow-hidden" style={{ width: 260, background: '#121212' }}>
                        <NowPlayingPanel track={liveTrack} stats={stats} />
                    </aside>
                )}
            </div>

            {/* ── Bottom Play Bar (Condensed) ── */}
            <div className="flex-shrink-0 flex items-center justify-between px-4" style={{ height: 76, background: '#000' }}>
                <div className="flex items-center gap-3 w-[28%] min-w-0">
                    {liveTrack && (
                        <>
                            <img src={liveTrack.albumArt} alt="" className="w-12 h-12 rounded shadow-lg flex-shrink-0" />
                            <div className="min-w-0">
                                <a href={liveTrack.songUrl} target="_blank" rel="noreferrer" className="text-[13px] font-bold text-white hover:underline truncate block">{liveTrack.title}</a>
                                <p className="text-[11px] truncate text-[#b3b3b3] hover:underline cursor-pointer">{liveTrack.artist}</p>
                            </div>
                            <Heart size={15} className="text-[#1db954] flex-shrink-0 ml-2 hover:scale-105 cursor-pointer fill-current" />
                        </>
                    )}
                </div>

                <div className="flex flex-col items-center gap-1.5 flex-1 max-w-[40%]">
                    <div className="flex items-center gap-5">
                        <Shuffle size={14} className="text-[#b3b3b3] cursor-pointer hover:text-white" />
                        <SkipBack size={18} className="text-[#b3b3b3] cursor-pointer hover:text-white fill-current" />
                        <button className="w-8 h-8 rounded-full flex items-center justify-center text-black bg-white hover:scale-105 transition-transform">
                            {liveTrack?.isPlaying ? <Pause size={16} className="fill-black" /> : <Play size={16} className="fill-black ml-1" />}
                        </button>
                        <SkipForward size={18} className="text-[#b3b3b3] cursor-pointer hover:text-white fill-current" />
                        <Repeat size={14} className="text-[#b3b3b3] cursor-pointer hover:text-white" />
                    </div>
                    <div className="flex items-center gap-2.5 w-full group cursor-pointer">
                        <span className="text-[10px] text-[#b3b3b3]">1:24</span>
                        <div className="flex-1 h-1 rounded-full bg-[#535353]">
                            <div className="h-full rounded-full bg-white group-hover:bg-[#1db954] relative" style={{ width: liveTrack?.isPlaying ? '35%' : '0%' }}>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-md"></div>
                            </div>
                        </div>
                        <span className="text-[10px] text-[#b3b3b3]">3:42</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-[28%] justify-end">
                    <Mic2 size={14} className="text-[#b3b3b3] cursor-pointer hover:text-white" />
                    <ListMusic size={14} className="text-[#b3b3b3] cursor-pointer hover:text-white" />
                    <MonitorSpeaker size={14} className="text-[#b3b3b3] cursor-pointer hover:text-white" />
                    <Volume2 size={15} className="text-[#b3b3b3]" />
                    <div className="w-20 h-1 rounded-full bg-[#535353]">
                        <div className="h-full w-3/4 rounded-full bg-white group-hover:bg-[#1db954]" />
                    </div>
                    <Maximize2 size={14} className="text-[#b3b3b3] cursor-pointer hover:text-white" />
                </div>
            </div>
        </div>
    );
};

/* ── Sub-components ── */

const NavItem = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className="flex items-center gap-3.5 px-2 py-1.5 w-full rounded transition-colors group" style={{ color: active ? '#fff' : '#b3b3b3' }}>
        <span className="group-hover:text-white">{icon}</span>
        <span className="group-hover:text-white text-sm" style={{ fontWeight: active ? 700 : 600 }}>{label}</span>
    </button>
);

const TabBtn = ({ children, active, onClick }) => (
    <button onClick={onClick} className="px-3.5 py-1 rounded-full text-[13px] font-bold transition-colors" style={{ background: active ? '#fff' : 'rgba(255,255,255,0.1)', color: active ? '#000' : '#fff' }}>
        {children}
    </button>
);

const LiveView = ({ liveTrack, stats }) => {
    if (!liveTrack) return <div className="flex flex-col items-center justify-center h-full text-center py-32"><Music className="w-14 h-14 mb-4 text-[#535353]" /><p className="text-base font-bold text-white">Nothing playing</p></div>;

    return (
        <div className="pb-24">
            <div className="relative flex flex-col px-6 pt-16 pb-6" style={{ background: 'linear-gradient(180deg,rgba(29,185,84,0.25) 0%,rgba(18,18,18,1) 100%)', minHeight: 300 }}>
                <div className="flex items-end gap-5 w-full">
                    <img src={liveTrack.albumArt} alt={liveTrack.title} className="rounded-md shadow-2xl flex-shrink-0" style={{ width: 190, height: 190, objectFit: 'cover' }} />
                    <div className="pb-1 flex-1 min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-white mb-1">Song</p>
                        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tighter mb-2 truncate w-full">{liveTrack.title}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <img src={liveTrack.albumArt} className="w-5 h-5 rounded-full object-cover" alt="" />
                            <p className="text-[13px] font-bold text-white hover:underline cursor-pointer truncate">{liveTrack.artist}</p>
                            <span className="text-[#b3b3b3] text-xs">• 2026</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-5 px-6 py-3">
                <button className="w-12 h-12 rounded-full flex items-center justify-center bg-[#1db954] hover:scale-105 transition-transform shadow-lg">
                    {liveTrack.isPlaying ? <Pause size={24} className="fill-black text-black" /> : <Play size={24} className="fill-black text-black ml-1" />}
                </button>
                <Heart size={28} className="text-[#b3b3b3] hover:text-white cursor-pointer transition-colors" />
            </div>

            {stats?.tracks && (
                <div className="px-6 mt-4">
                    <h2 className="text-lg font-bold text-white mb-3 hover:underline cursor-pointer">Recommended</h2>
                    <div className="flex flex-col gap-0.5">
                        {stats.tracks.slice(0, 5).map((track, i) => (
                            <div key={i} className="group flex items-center py-1.5 px-2 hover:bg-white/10 transition-colors cursor-pointer rounded">
                                <div className="w-8 text-center text-xs text-[#b3b3b3] group-hover:hidden">{i + 1}</div>
                                <Play size={12} className="w-8 hidden group-hover:block fill-white text-white" />
                                <div className="flex-1 min-w-0 pr-4">
                                    <div className="flex items-center gap-2.5">
                                        <img src={track.cover} className="w-8 h-8 rounded object-cover" alt="" />
                                        <div className="min-w-0">
                                            <p className="text-[13px] font-medium text-white truncate">{track.title}</p>
                                            <p className="text-[11px] text-[#b3b3b3] truncate">{track.artist}</p>
                                        </div>
                                    </div>
                                </div>
                                <Heart size={14} className="text-[#b3b3b3] opacity-0 group-hover:opacity-100 mr-4" />
                                <div className="text-[11px] text-[#b3b3b3] tabular-nums">3:42</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const StatsView = ({ stats }) => (
    <div className="pb-32">
        <div className="px-6 pt-16 pb-6" style={{ background: 'linear-gradient(180deg,rgba(80,56,160,0.4) 0%,rgba(18,18,18,1) 100%)' }}>
            <p className="text-[11px] font-bold text-white mb-1 tracking-widest uppercase">Overview</p>
            <h1 className="text-5xl font-black text-white tracking-tighter">Your Stats</h1>
        </div>

        <div className="px-6 space-y-10">
            <section>
                <div className="flex text-[#b3b3b3] text-[10px] font-bold uppercase tracking-wider border-b border-white/10 pb-2 mb-2 px-2">
                    <div className="w-8 text-center">#</div>
                    <div className="flex-1">Title</div>
                    <div className="w-32 text-left hidden sm:block">Artist</div>
                    <div className="w-10 text-right"><Clock size={14} /></div>
                </div>
                {stats?.tracks?.slice(0, 5).map((track, i) => (
                    <div key={i} className="group flex items-center py-1.5 px-2 hover:bg-white/10 cursor-pointer rounded">
                        <div className="w-8 text-center text-xs text-[#b3b3b3] group-hover:hidden">{i + 1}</div>
                        <Play size={12} className="w-8 hidden group-hover:block fill-white text-white" />
                        <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center gap-3">
                                <img src={track.cover} className="w-8 h-8 rounded object-cover" alt="" />
                                <div className="min-w-0">
                                    <p className="text-[13px] font-semibold text-white truncate">{track.title}</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-32 text-[12px] text-[#b3b3b3] truncate hidden sm:block">{track.artist}</div>
                        <div className="w-10 text-[11px] text-[#b3b3b3] text-right tabular-nums">3:24</div>
                    </div>
                ))}
            </section>

            <section>
                <h2 className="text-lg font-bold text-white mb-3 px-2">Top Artists</h2>
                <div className="grid grid-cols-4 lg:grid-cols-5 gap-3">
                    {stats?.artists?.slice(0, 5).map((artist, i) => (
                        <div key={i} className="flex flex-col gap-2 p-3 rounded-md bg-[#181818] hover:bg-[#282828] transition-all group">
                            <div className="relative w-full aspect-square mb-1">
                                <img src={artist.image} className="rounded-full object-cover w-full h-full shadow-lg" alt="" />
                                <div className="absolute bottom-1 right-1 w-8 h-8 bg-[#1db954] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 transition-all shadow-xl">
                                    <Play size={14} className="fill-black text-black ml-0.5" />
                                </div>
                            </div>
                            <p className="text-[12px] font-bold text-white truncate">{artist.name}</p>
                            <p className="text-[10px] text-[#b3b3b3]">Artist</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    </div>
);

const SectionHeader = ({ children }) => (
    <div className="flex items-end justify-between mb-3 px-2">
        <h2 className="text-lg font-bold text-white tracking-tight">{children}</h2>
        <button className="text-[10px] font-bold text-[#b3b3b3] hover:text-white transition-colors uppercase">Show all</button>
    </div>
);

const NowPlayingPanel = ({ track, stats }) => {
    const artistMatch = stats?.artists?.find(a => a.name.toLowerCase() === track.artist.toLowerCase());
    const artistImg = artistMatch ? artistMatch.image : track.albumArt;

    return (
        <div className="flex flex-col h-full">
            <div className="px-4 py-3 flex items-center justify-between flex-shrink-0">
                <p className="text-[13px] font-bold text-white">Now Playing</p>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-4 pb-20">
                <img src={track.albumArt} alt={track.title} className="w-full rounded-lg shadow-xl" style={{ aspectRatio: '1/1', objectFit: 'cover' }} />
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <a href={track.songUrl} target="_blank" rel="noreferrer" className="font-bold text-white hover:underline truncate block text-lg leading-tight">{track.title}</a>
                        <p className="text-[13px] text-[#b3b3b3] hover:underline cursor-pointer truncate">{track.artist}</p>
                    </div>
                    <Heart size={18} className="text-[#1db954] flex-shrink-0 mt-1 fill-current" />
                </div>

                <div className="rounded-lg overflow-hidden bg-[#242424] relative group mt-1 shadow-md">
                    <img src={artistImg} className="w-full h-36 object-cover opacity-50 transition-transform duration-500" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 to-transparent p-3.5 flex flex-col justify-end">
                        <p className="text-[12px] font-bold text-white mb-0.5">About the artist</p>
                        <p className="text-[11px] text-[#b3b3b3] line-clamp-2">1,245,678 monthly listeners. Check out more from {track.artist}.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SpotifyWindow = WindowWrapper(Spotify, "spotify");
export default SpotifyWindow;