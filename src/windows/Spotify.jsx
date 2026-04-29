import React, { useEffect, useState } from 'react';
import WindowWrapper from '#hoc/WindowWrapper';
import WindowControls from '#components/WindowControls';
import {
    Play, Pause, SkipBack, SkipForward, Music,
    BarChart2, Volume2, Shuffle, Repeat, Heart,
    Home, Search, Library, PlusSquare, Mic2,
    ListMusic, Maximize2, MonitorSpeaker
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
            className="w-full h-full flex flex-col overflow-hidden select-none"
            style={{ background: '#000', fontFamily: "'Circular Std', 'Helvetica Neue', Helvetica, Arial, sans-serif" }}
        >
            {/* ── Window drag bar ── */}
            <div
                id="window-header"
                className="flex items-center px-3 py-2 flex-shrink-0"
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
                    <div className="rounded-xl p-4 flex flex-col gap-2" style={{ background: '#121212' }}>
                        <NavItem icon={<Home size={24} />} label="Home" active={activeTab === 'live'} onClick={() => setActiveTab('live')} />
                        <NavItem icon={<Search size={24} />} label="Search" active={false} />
                    </div>

                    {/* Library card */}
                    <div className="rounded-xl flex flex-col flex-1 overflow-hidden" style={{ background: '#121212' }}>
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
                            {/* Liked Songs pinned */}
                            <div className="flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer hover:bg-white/10 transition-colors">
                                <div className="w-12 h-12 rounded flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'linear-gradient(135deg,#450af5,#c4efd9)' }}>
                                    <Heart size={16} fill="white" color="white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-white truncate leading-tight">Liked Songs</p>
                                    <p className="text-xs text-[#b3b3b3] truncate mt-0.5">Playlist • {stats?.tracks?.length * 12 || 42} songs</p>
                                </div>
                            </div>

                            {/* Top artists as "playlists" */}
                            {stats?.artists?.map((artist, i) => (
                                <div key={i} className="flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer hover:bg-white/10 transition-colors group">
                                    <img src={artist.image} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0 shadow-md group-hover:scale-105 transition-transform" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-white truncate leading-tight">{artist.name}</p>
                                        <p className="text-xs text-[#b3b3b3] truncate mt-0.5">Artist</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* ── Main Content ── */}
                <main
                    className="flex-1 min-w-0 rounded-xl overflow-hidden flex flex-col relative"
                    style={{ background: '#121212' }}
                >
                    {/* Top nav bar inside main */}
                    <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 flex-shrink-0 z-10 bg-gradient-to-b from-black/60 to-transparent">
                        <div className="flex items-center gap-2">
                            <TabBtn active={activeTab === 'live'} onClick={() => setActiveTab('live')}>
                                Now Playing
                            </TabBtn>
                            <TabBtn active={activeTab === 'stats'} onClick={() => setActiveTab('stats')}>
                                Stats
                            </TabBtn>
                        </div>
                    </div>

                    {/* Scrollable content */}
                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        {loading ? (
                            <div className="h-full flex items-center justify-center">
                                <Music className="w-10 h-10 animate-pulse text-[#1db954]" />
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
                        className="flex-shrink-0 rounded-xl flex flex-col overflow-hidden border-l border-white/5"
                        style={{ width: 280, background: '#121212' }}
                    >
                        <NowPlayingPanel track={liveTrack} />
                    </aside>
                )}
            </div>

            {/* ── Now Playing Bar (bottom) ── */}
            <div
                className="flex-shrink-0 flex items-center justify-between px-4 z-20"
                style={{ height: 90, background: '#000' }}
            >
                {/* Left: track info */}
                <div className="flex items-center gap-4 w-[30%] min-w-0">
                    {liveTrack ? (
                        <>
                            <div className="relative group flex-shrink-0 cursor-pointer">
                                <img src={liveTrack.albumArt} alt="" className="w-14 h-14 rounded shadow-lg object-cover" />
                                <button className="absolute top-1 right-1 bg-black/50 hover:bg-black/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Maximize2 size={12} className="text-white" />
                                </button>
                            </div>
                            <div className="min-w-0 flex flex-col justify-center">
                                <a href={liveTrack.songUrl} target="_blank" rel="noreferrer"
                                    className="text-sm font-semibold text-white hover:underline truncate block">{liveTrack.title}</a>
                                <p className="text-xs text-[#b3b3b3] hover:text-white hover:underline cursor-pointer truncate mt-0.5">{liveTrack.artist}</p>
                            </div>
                            <Heart size={16} className="text-[#1db954] flex-shrink-0 ml-2 cursor-pointer hover:scale-105 transition-transform fill-current" />
                        </>
                    ) : (
                        <p className="text-xs text-[#b3b3b3]">Nothing playing</p>
                    )}
                </div>

                {/* Center: transport controls */}
                <div className="flex flex-col items-center gap-2 max-w-[40%] flex-1">
                    <div className="flex items-center gap-6">
                        <Shuffle size={16} className="text-[#1db954] cursor-pointer hover:text-white transition-colors" />
                        <SkipBack size={20} className="text-[#b3b3b3] cursor-pointer hover:text-white transition-colors fill-current" />
                        <button
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-white text-black hover:scale-105 transition-transform shadow-md"
                        >
                            {liveTrack?.isPlaying
                                ? <Pause size={16} className="fill-black" />
                                : <Play size={16} className="fill-black ml-1" />}
                        </button>
                        <SkipForward size={20} className="text-[#b3b3b3] cursor-pointer hover:text-white transition-colors fill-current" />
                        <Repeat size={16} className="text-[#b3b3b3] cursor-pointer hover:text-white transition-colors" />
                    </div>
                    {/* Progress bar */}
                    <div className="flex items-center gap-2 w-full group cursor-pointer">
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
                <div className="flex items-center gap-3 w-[30%] justify-end pr-2">
                    <Mic2 size={16} className="text-[#b3b3b3] cursor-pointer hover:text-white transition-colors" />
                    <ListMusic size={16} className="text-[#b3b3b3] cursor-pointer hover:text-white transition-colors" />
                    <MonitorSpeaker size={16} className="text-[#b3b3b3] cursor-pointer hover:text-white transition-colors" />
                    <div className="flex items-center gap-2 w-24 group cursor-pointer ml-1">
                        <Volume2 size={16} className="text-[#b3b3b3] flex-shrink-0 hover:text-white transition-colors" />
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
        className="flex items-center gap-4 px-2 py-2 w-full rounded transition-colors group"
    >
        <span className={active ? 'text-white' : 'text-[#b3b3b3] group-hover:text-white transition-colors'}>{icon}</span>
        <span className={active ? 'text-white font-bold' : 'text-[#b3b3b3] font-semibold group-hover:text-white transition-colors'} style={{ fontSize: 15 }}>{label}</span>
    </button>
);

const TabBtn = ({ children, active, onClick }) => (
    <button
        onClick={onClick}
        className="px-4 py-1.5 rounded-full text-sm font-bold transition-all"
        style={{
            background: active ? '#fff' : 'rgba(0,0,0,0.5)',
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
                <p className="text-base font-semibold text-[#b3b3b3]">Nothing playing right now</p>
                <p className="text-sm mt-1 text-[#535353]">Start listening on any device</p>
            </div>
        );
    }

    return (
        <div>
            {/* Hero banner */}
            <div
                className="relative flex flex-col px-6 pt-20 pb-6 shadow-xl"
                style={{
                    background: 'linear-gradient(180deg,rgba(29,185,84,0.3) 0%,rgba(18,18,18,1) 100%)',
                    minHeight: 340
                }}
            >
                {liveTrack.isPlaying && (
                    <div className="flex items-center gap-2 mb-6">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#1db954]"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1db954]"></span>
                        </span>
                        <p className="text-xs font-bold uppercase tracking-widest text-[#1db954]">Now Playing</p>
                    </div>
                )}

                <div className="flex items-end gap-6 mt-auto">
                    <a href={liveTrack.songUrl} target="_blank" rel="noreferrer" className="flex-shrink-0">
                        <img
                            src={liveTrack.albumArt}
                            alt={liveTrack.title}
                            className="rounded shadow-2xl hover:scale-105 transition-transform duration-300 object-cover"
                            style={{ width: 232, height: 232 }}
                        />
                    </a>
                    <div className="pb-2">
                        <p className="text-xs font-bold uppercase mb-2 text-white">Song</p>
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter mb-4 truncate max-w-2xl">{liveTrack.title}</h1>
                        <div className="flex items-center gap-2">
                            <img src={liveTrack.albumArt} className="w-6 h-6 rounded-full object-cover" alt="" />
                            <p className="text-sm font-bold text-white hover:underline cursor-pointer">{liveTrack.artist}</p>
                            <span className="text-[#b3b3b3] text-sm">• 2026</span>
                            <span className="text-[#b3b3b3] text-sm">• 3:42</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action row */}
            <div className="flex items-center gap-6 px-6 py-6 bg-gradient-to-b from-[#121212] to-transparent">
                <button
                    className="w-14 h-14 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg bg-[#1db954]"
                >
                    {liveTrack.isPlaying
                        ? <Pause size={24} className="fill-black text-black" />
                        : <Play size={24} className="fill-black text-black ml-1" />}
                </button>
                <Heart size={36} className="text-[#1db954] cursor-pointer hover:scale-105 transition-transform fill-current" />
            </div>
        </div>
    );
};

const StatsView = ({ stats }) => (
    <div>
        {/* Hero gradient header */}
        <div
            className="px-6 pt-24 pb-8"
            style={{ background: 'linear-gradient(180deg,rgba(80,56,160,0.6) 0%,rgba(18,18,18,1) 100%)' }}
        >
            <p className="text-sm font-bold text-white mb-2">Profile Overview</p>
            <h1 className="text-7xl font-black text-white tracking-tighter">Stats</h1>
        </div>

        <div className="px-6 pb-24 space-y-12">

            {/* On Repeat */}
            <section>
                <SectionHeader>On Repeat</SectionHeader>
                <div className="w-full">
                    <div className="flex text-[#b3b3b3] text-xs font-semibold uppercase tracking-wider border-b border-white/10 pb-2 mb-2 px-4">
                        <div className="w-12 text-center">#</div>
                        <div className="flex-1">Title</div>
                        <div className="w-48 text-left">Artist</div>
                        <div className="w-16 text-right"><Clock size={16} className="inline" /></div>
                    </div>
                    <div className="flex flex-col">
                        {stats?.tracks?.slice(0, 5).map((track, i) => (
                            <div
                                key={i}
                                className="group flex items-center py-2 px-4 hover:bg-white/10 transition-colors cursor-pointer rounded-md"
                            >
                                <div className="w-12 text-center flex items-center justify-center text-sm font-medium text-[#b3b3b3]">
                                    <span className="group-hover:hidden">{i + 1}</span>
                                    <Play size={14} className="hidden group-hover:block fill-white text-white" />
                                </div>
                                <div className="flex-1 min-w-0 pr-4">
                                    <a href={track.url} target="_blank" rel="noreferrer" className="flex items-center gap-4">
                                        <img src={track.cover} alt="" className="w-10 h-10 rounded shadow-sm flex-shrink-0 object-cover" />
                                        <div className="min-w-0">
                                            <p className="text-base font-normal text-white truncate">{track.title}</p>
                                        </div>
                                    </a>
                                </div>
                                <div className="w-48 text-sm text-[#b3b3b3] truncate hover:underline hover:text-white transition-colors">
                                    {track.artist}
                                </div>
                                <div className="w-16 text-sm text-[#b3b3b3] text-right font-variant-numeric tabular-nums">
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {stats?.artists?.slice(0, 5).map((artist, i) => (
                        <a
                            key={i}
                            href={artist.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex flex-col p-4 rounded-lg cursor-pointer bg-[#181818] hover:bg-[#282828] transition-all group shadow-md"
                        >
                            <div className="relative w-full aspect-square mb-4">
                                <img
                                    src={artist.image}
                                    alt=""
                                    className="rounded-full shadow-2xl object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute bottom-1 right-1 w-12 h-12 bg-[#1db954] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-lg">
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
            <p className="text-sm font-bold text-white hover:underline cursor-pointer">Now Playing</p>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4 flex flex-col gap-5">
            <img src={track.albumArt} alt={track.title} className="w-full rounded-lg shadow-2xl" style={{ aspectRatio: '1/1', objectFit: 'cover' }} />
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex flex-col gap-1">
                    <a href={track.songUrl} target="_blank" rel="noreferrer"
                        className="text-2xl font-bold text-white hover:underline truncate block leading-tight">{track.title}</a>
                    <p className="text-base text-[#b3b3b3] hover:text-white hover:underline cursor-pointer truncate">{track.artist}</p>
                </div>
                <Heart size={24} className="text-[#1db954] flex-shrink-0 cursor-pointer hover:scale-105 transition-transform fill-current mt-1" />
            </div>

            {/* Mock About the Artist Card */}
            <div className="rounded-lg overflow-hidden bg-[#242424] cursor-pointer hover:bg-[#2a2a2a] transition-colors relative group">
                <img src={track.albumArt} className="w-full h-48 object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" alt="Artist Background" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent p-4 flex flex-col justify-end">
                    <p className="text-sm font-bold text-white">About the artist</p>
                    <p className="text-[#b3b3b3] text-xs line-clamp-2 mt-1">Check out more from {track.artist} and similar artists in this curated collection.</p>
                </div>
            </div>

        </div>
    </div>
);

const SpotifyWindow = WindowWrapper(Spotify, "spotify");
export default SpotifyWindow;