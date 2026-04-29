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
            className="w-full h-full flex flex-col overflow-hidden select-none text-white shadow-2xl"
            style={{
                background: '#000',
                fontFamily: "'Circular Std', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                minWidth: '1000px', // Forces the window to be wide enough for 3 columns
                minHeight: '650px'
            }}
        >
            {/* ── Window drag bar ── */}
            <div
                id="window-header"
                className="flex items-center px-4 py-3 flex-shrink-0"
                style={{ background: '#000', WebkitAppRegion: 'drag' }}
            >
                <WindowControls target="spotify" />
            </div>

            {/* ── App Body (sidebar + main) ── */}
            <div className="flex flex-1 gap-2 px-2 overflow-hidden" style={{ paddingBottom: 0 }}>

                {/* ── Left Sidebar ── */}
                <aside
                    className="flex flex-col gap-2 flex-shrink-0"
                    style={{ width: 280 }}
                >
                    {/* Nav card */}
                    <div className="rounded-xl p-4 flex flex-col gap-2 bg-[#121212]">
                        <NavItem icon={<Home size={24} />} label="Home" active={activeTab === 'live'} onClick={() => setActiveTab('live')} />
                        <NavItem icon={<Search size={24} />} label="Search" active={false} />
                    </div>

                    {/* Library card */}
                    <div className="rounded-xl flex flex-col flex-1 overflow-hidden bg-[#121212]">
                        <div className="flex items-center justify-between px-4 pt-4 pb-4 flex-shrink-0 shadow-sm">
                            <button className="flex items-center gap-3 text-sm font-bold text-[#b3b3b3] hover:text-white transition-colors">
                                <Library size={24} />
                                <span>Your Library</span>
                            </button>
                            <button className="text-[#b3b3b3] hover:text-white transition-colors">
                                <PlusSquare size={18} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1 scrollbar-hide">
                            <div className="flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer hover:bg-white/10 transition-colors">
                                <div className="w-12 h-12 rounded flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'linear-gradient(135deg,#450af5,#c4efd9)' }}>
                                    <Heart size={16} fill="white" color="white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-base font-bold text-white truncate leading-tight">Liked Songs</p>
                                    <p className="text-xs text-[#b3b3b3] truncate mt-0.5">Playlist • {stats?.tracks?.length * 12 || 42} songs</p>
                                </div>
                            </div>

                            {stats?.artists?.map((artist, i) => (
                                <div key={i} className="flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer hover:bg-white/10 transition-colors group">
                                    <img src={artist.image} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0 shadow-md group-hover:scale-105 transition-transform" />
                                    <div className="min-w-0">
                                        <p className="text-base font-bold text-white truncate leading-tight">{artist.name}</p>
                                        <p className="text-xs text-[#b3b3b3] truncate mt-0.5">Artist</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* ── Main Content ── */}
                <main
                    className="flex-1 min-w-[400px] rounded-xl overflow-hidden flex flex-col relative bg-[#121212]"
                >
                    {/* Sticky Top Nav to fix switching bug */}
                    <div className="sticky top-0 z-20 flex items-center gap-3 px-6 py-4 bg-[#121212]/80 backdrop-blur-md border-b border-transparent">
                        <TabBtn active={activeTab === 'live'} onClick={() => setActiveTab('live')}>
                            Now Playing
                        </TabBtn>
                        <TabBtn active={activeTab === 'stats'} onClick={() => setActiveTab('stats')}>
                            Stats
                        </TabBtn>
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-hide pb-10">
                        {loading ? (
                            <div className="h-full flex items-center justify-center">
                                <Music className="w-12 h-12 animate-pulse text-[#1db954]" />
                            </div>
                        ) : activeTab === 'live' ? (
                            <LiveView liveTrack={liveTrack} />
                        ) : (
                            <StatsView stats={stats} />
                        )}
                    </div>
                </main>

                {/* ── Right Panel: Now Playing sidebar ── */}
                {liveTrack && (
                    <aside
                        className="flex-shrink-0 rounded-xl flex flex-col overflow-hidden bg-[#121212]"
                        style={{ width: 320 }}
                    >
                        <NowPlayingPanel track={liveTrack} />
                    </aside>
                )}
            </div>

            {/* ── Now Playing Bar (bottom) ── */}
            <div
                className="flex-shrink-0 flex items-center justify-between px-4 z-20 bg-black"
                style={{ height: 90 }}
            >
                {/* Left: track info */}
                <div className="flex items-center gap-4 w-[30%] min-w-0">
                    {liveTrack ? (
                        <>
                            <div className="relative group flex-shrink-0 cursor-pointer">
                                <img src={liveTrack.albumArt} alt="" className="w-14 h-14 rounded shadow-lg object-cover" />
                                <button className="absolute top-1 right-1 bg-black/60 hover:bg-black/90 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Maximize2 size={12} className="text-white" />
                                </button>
                            </div>
                            <div className="min-w-0 flex flex-col justify-center">
                                <a href={liveTrack.songUrl} target="_blank" rel="noreferrer"
                                    className="text-sm font-bold text-white hover:underline truncate block">{liveTrack.title}</a>
                                <p className="text-xs text-[#b3b3b3] hover:text-white hover:underline cursor-pointer truncate mt-0.5">{liveTrack.artist}</p>
                            </div>
                            <Heart size={18} className="text-[#1db954] flex-shrink-0 ml-2 cursor-pointer hover:scale-105 transition-transform fill-current" />
                        </>
                    ) : (
                        <p className="text-xs text-[#b3b3b3]">Nothing playing</p>
                    )}
                </div>

                {/* Center: transport controls */}
                <div className="flex flex-col items-center gap-2 max-w-[45%] flex-1">
                    <div className="flex items-center gap-6">
                        <Shuffle size={18} className="text-[#1db954] cursor-pointer hover:text-white transition-colors" />
                        <SkipBack size={22} className="text-[#b3b3b3] cursor-pointer hover:text-white transition-colors fill-current" />
                        <button
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-white text-black hover:scale-105 transition-transform shadow-md"
                        >
                            {liveTrack?.isPlaying
                                ? <Pause size={16} className="fill-black" />
                                : <Play size={16} className="fill-black ml-1" />}
                        </button>
                        <SkipForward size={22} className="text-[#b3b3b3] cursor-pointer hover:text-white transition-colors fill-current" />
                        <Repeat size={18} className="text-[#b3b3b3] cursor-pointer hover:text-white transition-colors" />
                    </div>
                    <div className="flex items-center gap-2 w-full max-w-[500px] group cursor-pointer">
                        <span className="text-[11px] text-[#b3b3b3] w-8 text-right font-medium">1:24</span>
                        <div className="flex-1 h-1 rounded-full bg-[#4d4d4d] group-hover:h-1.5 transition-all flex items-center">
                            <div className="h-full rounded-full bg-white group-hover:bg-[#1db954] transition-colors relative" style={{ width: liveTrack?.isPlaying ? '35%' : '0%' }}>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-md"></div>
                            </div>
                        </div>
                        <span className="text-[11px] text-[#b3b3b3] w-8 font-medium">3:42</span>
                    </div>
                </div>

                {/* Right: volume + extras */}
                <div className="flex items-center gap-4 w-[30%] justify-end pr-2">
                    <Mic2 size={16} className="text-[#b3b3b3] cursor-pointer hover:text-white transition-colors" />
                    <ListMusic size={16} className="text-[#b3b3b3] cursor-pointer hover:text-white transition-colors" />
                    <MonitorSpeaker size={16} className="text-[#b3b3b3] cursor-pointer hover:text-white transition-colors" />
                    <div className="flex items-center gap-2 w-24 group cursor-pointer ml-1">
                        <Volume2 size={18} className="text-[#b3b3b3] flex-shrink-0 hover:text-white transition-colors" />
                        <div className="flex-1 h-1 rounded-full bg-[#4d4d4d] group-hover:h-1.5 transition-all flex items-center">
                            <div className="h-full w-3/4 rounded-full bg-white group-hover:bg-[#1db954] transition-colors relative">
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-md"></div>
                            </div>
                        </div>
                    </div>
                    <Maximize2 size={16} className="text-[#b3b3b3] cursor-pointer hover:text-white transition-colors ml-2" />
                </div>
            </div>
        </div>
    );
};

/* ── Sub-components ── */

const NavItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-4 px-3 py-2.5 w-full rounded transition-colors group"
    >
        <span className={active ? 'text-white' : 'text-[#b3b3b3] group-hover:text-white transition-colors'}>{icon}</span>
        <span className={active ? 'text-white font-bold' : 'text-[#b3b3b3] font-bold group-hover:text-white transition-colors'} style={{ fontSize: 15 }}>{label}</span>
    </button>
);

const TabBtn = ({ children, active, onClick }) => (
    <button
        onClick={onClick}
        className="px-4 py-1.5 rounded-full text-sm font-bold transition-all"
        style={{
            background: active ? '#fff' : '#242424',
            color: active ? '#000' : '#fff',
        }}
    >
        {children}
    </button>
);

const LiveView = ({ liveTrack }) => {
    if (!liveTrack) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center py-32">
                <Music className="w-16 h-16 mb-4 text-[#535353]" />
                <p className="text-lg font-bold text-white">Nothing playing right now</p>
                <p className="text-sm mt-2 text-[#b3b3b3]">Start listening on any device</p>
            </div>
        );
    }

    return (
        <div className="relative w-full flex flex-col min-h-[500px]">
            {/* Massive Blurred Hero Background */}
            <div className="absolute top-0 left-0 right-0 h-96 overflow-hidden pointer-events-none rounded-t-xl z-0">
                <img src={liveTrack.albumArt} className="w-full h-full object-cover blur-[80px] opacity-40 scale-150 saturate-150" alt="" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#121212]/80 to-[#121212]"></div>
            </div>

            {/* Content Foreground */}
            <div className="relative z-10 px-8 pt-12 pb-6 flex flex-col mt-auto">
                <div className="flex items-end gap-6 mt-20">
                    <img
                        src={liveTrack.albumArt}
                        alt={liveTrack.title}
                        className="rounded-lg shadow-2xl object-cover"
                        style={{ width: 220, height: 220 }}
                    />
                    <div className="flex flex-col gap-2 pb-2">
                        <span className="text-sm font-bold uppercase tracking-widest text-white drop-shadow-md">Song</span>
                        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none mb-2 drop-shadow-lg">{liveTrack.title}</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <img src={liveTrack.albumArt} className="w-6 h-6 rounded-full object-cover shadow-md" alt="" />
                            <span className="text-sm font-bold text-white hover:underline cursor-pointer">{liveTrack.artist}</span>
                            <span className="text-[#b3b3b3] text-sm font-medium">• 2026</span>
                            <span className="text-[#b3b3b3] text-sm font-medium">• 3:42</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action controls under Hero */}
            <div className="relative z-10 px-8 py-4 flex items-center gap-6">
                <button
                    className="w-16 h-16 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-xl bg-[#1db954]"
                >
                    {liveTrack.isPlaying
                        ? <Pause size={28} className="fill-black text-black" />
                        : <Play size={28} className="fill-black text-black ml-1" />}
                </button>
                <Heart size={40} className="text-[#1db954] cursor-pointer hover:scale-105 transition-transform fill-current" />
            </div>
        </div>
    );
};

const StatsView = ({ stats }) => (
    <div>
        <div className="px-8 pt-10 pb-8">
            <p className="text-sm font-bold text-white mb-2">Profile Overview</p>
            <h1 className="text-7xl font-black text-white tracking-tighter">Your Stats</h1>
        </div>

        <div className="px-8 pb-24 space-y-14">
            {/* On Repeat */}
            <section>
                <SectionHeader>On Repeat</SectionHeader>
                <div className="w-full">
                    <div className="flex text-[#b3b3b3] text-xs font-bold uppercase tracking-wider border-b border-white/10 pb-2 mb-3 px-4">
                        <div className="w-12 text-center">#</div>
                        <div className="flex-1">Title</div>
                        <div className="w-48 text-left">Artist</div>
                        <div className="w-16 text-right"><Clock size={16} className="inline" /></div>
                    </div>
                    <div className="flex flex-col">
                        {stats?.tracks?.slice(0, 5).map((track, i) => (
                            <div key={i} className="group flex items-center py-2 px-4 hover:bg-white/10 transition-colors cursor-pointer rounded-md">
                                <div className="w-12 text-center flex items-center justify-center text-base font-normal text-[#b3b3b3]">
                                    <span className="group-hover:hidden">{i + 1}</span>
                                    <Play size={16} className="hidden group-hover:block fill-white text-white" />
                                </div>
                                <div className="flex-1 min-w-0 pr-4">
                                    <a href={track.url} target="_blank" rel="noreferrer" className="flex items-center gap-4">
                                        <img src={track.cover} alt="" className="w-12 h-12 rounded shadow-sm flex-shrink-0 object-cover" />
                                        <div className="min-w-0">
                                            <p className="text-base font-normal text-white truncate">{track.title}</p>
                                        </div>
                                    </a>
                                </div>
                                <div className="w-48 text-sm text-[#b3b3b3] truncate hover:underline hover:text-white transition-colors">
                                    {track.artist}
                                </div>
                                <div className="w-16 text-sm text-[#b3b3b3] text-right tabular-nums">
                                    {3 + i}:{(i * 12 + 15).toString().padStart(2, '0')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Top Artists */}
            <section>
                <SectionHeader>Top Artists</SectionHeader>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {stats?.artists?.slice(0, 4).map((artist, i) => (
                        <a key={i} href={artist.url} target="_blank" rel="noreferrer"
                            className="flex flex-col p-4 rounded-lg cursor-pointer bg-[#181818] hover:bg-[#282828] transition-all group shadow-md"
                        >
                            <div className="relative w-full aspect-square mb-4">
                                <img src={artist.image} alt="" className="rounded-full shadow-2xl object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                                <div className="absolute bottom-2 right-2 w-12 h-12 bg-[#1db954] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-xl">
                                    <Play size={20} className="fill-black text-black ml-1" />
                                </div>
                            </div>
                            <div className="flex flex-col min-w-0">
                                <p className="text-base font-bold text-white truncate w-full pb-1">{artist.name}</p>
                                <p className="text-sm font-semibold text-[#b3b3b3]">Artist</p>
                            </div>
                        </a>
                    ))}
                </div>
            </section>
        </div>
    </div>
);

const SectionHeader = ({ children }) => (
    <div className="flex items-end justify-between mb-6 px-4">
        <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer tracking-tight">{children}</h2>
        <button className="text-sm font-bold text-[#b3b3b3] hover:underline hover:text-white transition-colors">
            Show all
        </button>
    </div>
);

const NowPlayingPanel = ({ track }) => (
    <div className="flex flex-col h-full bg-[#121212]">
        <div className="px-4 pt-4 pb-2 flex items-center justify-between flex-shrink-0">
            <p className="text-base font-bold text-white hover:underline cursor-pointer">Now Playing</p>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4 flex flex-col gap-6">
            <img src={track.albumArt} alt={track.title} className="w-full rounded-lg shadow-2xl" style={{ aspectRatio: '1/1', objectFit: 'cover' }} />
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex flex-col gap-1">
                    <a href={track.songUrl} target="_blank" rel="noreferrer"
                        className="text-2xl font-bold text-white hover:underline truncate block leading-tight">{track.title}</a>
                    <p className="text-base text-[#b3b3b3] hover:text-white hover:underline cursor-pointer truncate">{track.artist}</p>
                </div>
                <Heart size={24} className="text-[#1db954] flex-shrink-0 cursor-pointer hover:scale-105 transition-transform fill-current mt-1" />
            </div>

            {/* About the Artist Card */}
            <div className="rounded-lg overflow-hidden bg-[#242424] cursor-pointer hover:bg-[#2a2a2a] transition-colors relative group mt-2 shadow-lg">
                <img src={track.albumArt} className="w-full h-56 object-cover opacity-50 group-hover:scale-105 transition-transform duration-500" alt="Artist Background" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 flex flex-col justify-end">
                    <p className="text-base font-bold text-white">About the artist</p>
                    <p className="text-[#b3b3b3] text-sm line-clamp-2 mt-1">Check out more from {track.artist} and similar artists in this curated collection.</p>
                </div>
            </div>

        </div>
    </div>
);

const SpotifyWindow = WindowWrapper(Spotify, "spotify");
export default SpotifyWindow;