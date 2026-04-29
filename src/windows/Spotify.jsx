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
            style={{ background: '#000', fontFamily: "'Circular Std', 'Helvetica Neue', Helvetica, Arial, sans-serif" }}
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
                    style={{ width: 260 }}
                >
                    {/* Nav card */}
                    <div className="rounded-xl p-5 flex flex-col gap-1" style={{ background: '#121212' }}>
                        <NavItem icon={<Home size={24} />} label="Home" active={activeTab === 'live'} onClick={() => setActiveTab('live')} />
                        <NavItem icon={<Search size={24} />} label="Search" />
                    </div>

                    {/* Library card */}
                    <div className="rounded-xl flex flex-col flex-1 overflow-hidden" style={{ background: '#121212' }}>
                        <div className="flex items-center justify-between px-4 pt-4 pb-2">
                            <button className="flex items-center gap-3 text-sm font-bold hover:text-white transition-colors" style={{ color: '#b3b3b3' }}>
                                <Library size={24} />
                                <span>Blake's Library</span>
                            </button>
                            <button style={{ color: '#b3b3b3' }} className="hover:text-white transition-colors">
                                <PlusSquare size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1 custom-scrollbar">
                            {/* Liked Songs pinned */}
                            <div className="flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer hover:bg-white/10 transition-colors">
                                <div className="w-12 h-12 rounded flex items-center justify-center flex-shrink-0 shadow-md"
                                    style={{ background: 'linear-gradient(135deg,#450af5,#c4efd9)' }}>
                                    <Heart size={16} fill="white" color="white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-white truncate leading-tight">Liked Songs</p>
                                    <p className="text-xs truncate mt-0.5" style={{ color: '#b3b3b3' }}>Playlist</p>
                                </div>
                            </div>

                            {/* Top artists as "playlists" */}
                            {stats?.artists?.map((artist, i) => (
                                <div key={i} className="flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer hover:bg-white/10 transition-colors">
                                    <img src={artist.image} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0 shadow-sm" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-white truncate leading-tight">{artist.name}</p>
                                        <p className="text-xs truncate mt-0.5" style={{ color: '#b3b3b3' }}>Artist</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* ── Main Content ── */}
                <main
                    className="flex-1 rounded-xl overflow-hidden flex flex-col relative"
                    style={{ background: '#121212', minWidth: '600px' }}
                >
                    {/* Top nav bar inside main */}
                    <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 pt-4 pb-2 flex-shrink-0 bg-gradient-to-b from-black/50 to-transparent">
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
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="h-full flex items-center justify-center">
                                <Music className="w-12 h-12 animate-pulse" style={{ color: '#1db954' }} />
                            </div>
                        ) : activeTab === 'live' ? (
                            <LiveView liveTrack={liveTrack} stats={stats} />
                        ) : (
                            <StatsView stats={stats} />
                        )}
                    </div>
                </main>

                {/* ── Right Panel: Now Playing sidebar ── */}
                {liveTrack && (
                    <aside
                        className="flex-shrink-0 rounded-xl flex flex-col overflow-hidden"
                        style={{ width: 320, background: '#121212' }}
                    >
                        <NowPlayingPanel track={liveTrack} stats={stats} />
                    </aside>
                )}
            </div>

            {/* ── Now Playing Bar (bottom) ── */}
            <div
                className="flex-shrink-0 flex items-center justify-between px-4 mt-2"
                style={{ height: 90, background: '#000' }}
            >
                {/* Left: track info */}
                <div className="flex items-center gap-4 w-[30%] min-w-0">
                    {liveTrack ? (
                        <>
                            <img src={liveTrack.albumArt} alt="" className="w-14 h-14 rounded shadow-lg flex-shrink-0" />
                            <div className="min-w-0">
                                <a href={liveTrack.songUrl} target="_blank" rel="noreferrer"
                                    className="text-sm font-semibold text-white hover:underline truncate block leading-tight">{liveTrack.title}</a>
                                <p className="text-xs truncate mt-1 hover:underline cursor-pointer hover:text-white" style={{ color: '#b3b3b3' }}>{liveTrack.artist}</p>
                            </div>
                            <Heart size={18} style={{ color: '#1db954' }} className="flex-shrink-0 ml-2 hover:scale-105 cursor-pointer transition-transform fill-current" />
                        </>
                    ) : (
                        <p className="text-sm" style={{ color: '#b3b3b3' }}>Nothing playing</p>
                    )}
                </div>

                {/* Center: transport controls */}
                <div className="flex flex-col items-center gap-2 flex-1 max-w-[40%]">
                    <div className="flex items-center gap-6">
                        <Shuffle size={16} style={{ color: '#b3b3b3' }} className="cursor-pointer hover:text-white transition-colors" />
                        <SkipBack size={20} style={{ color: '#b3b3b3' }} className="cursor-pointer hover:text-white transition-colors fill-current" />
                        <button
                            className="w-9 h-9 rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform"
                            style={{ background: '#fff' }}
                        >
                            {liveTrack?.isPlaying
                                ? <Pause size={18} className="fill-black" />
                                : <Play size={18} className="fill-black ml-1" />}
                        </button>
                        <SkipForward size={20} style={{ color: '#b3b3b3' }} className="cursor-pointer hover:text-white transition-colors fill-current" />
                        <Repeat size={16} style={{ color: '#b3b3b3' }} className="cursor-pointer hover:text-white transition-colors" />
                    </div>
                    {/* Progress bar */}
                    <div className="flex items-center gap-3 w-full group cursor-pointer">
                        <span className="text-[11px]" style={{ color: '#b3b3b3' }}>0:00</span>
                        <div className="flex-1 h-1 rounded-full" style={{ background: '#535353' }}>
                            <div className="h-full rounded-full group-hover:bg-[#1db954] transition-colors relative" style={{ width: liveTrack?.isPlaying ? '35%' : '0%', background: '#fff' }}>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-md"></div>
                            </div>
                        </div>
                        <span className="text-[11px]" style={{ color: '#b3b3b3' }}>–:––</span>
                    </div>
                </div>

                {/* Right: volume + extras */}
                <div className="flex items-center gap-4 w-[30%] justify-end">
                    <Mic2 size={16} style={{ color: '#b3b3b3' }} className="cursor-pointer hover:text-white transition-colors" />
                    <ListMusic size={16} style={{ color: '#b3b3b3' }} className="cursor-pointer hover:text-white transition-colors" />
                    <MonitorSpeaker size={16} style={{ color: '#b3b3b3' }} className="cursor-pointer hover:text-white transition-colors" />
                    <div className="flex items-center gap-2 group cursor-pointer ml-1">
                        <Volume2 size={18} style={{ color: '#b3b3b3' }} className="hover:text-white transition-colors" />
                        <div className="w-24 h-1 rounded-full" style={{ background: '#535353' }}>
                            <div className="h-full w-3/4 rounded-full group-hover:bg-[#1db954] transition-colors relative" style={{ background: '#fff' }}>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-md"></div>
                            </div>
                        </div>
                    </div>
                    <Maximize2 size={16} style={{ color: '#b3b3b3' }} className="cursor-pointer hover:text-white transition-colors ml-1" />
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
        style={{ color: active ? '#fff' : '#b3b3b3' }}
    >
        <span className="group-hover:text-white transition-colors">{icon}</span>
        <span className="group-hover:text-white transition-colors" style={{ fontWeight: active ? 700 : 600, fontSize: 15 }}>{label}</span>
    </button>
);

const TabBtn = ({ children, active, onClick }) => (
    <button
        onClick={onClick}
        className="px-4 py-1.5 rounded-full text-sm font-bold transition-colors"
        style={{
            background: active ? '#fff' : 'rgba(255,255,255,0.1)',
            color: active ? '#000' : '#fff',
        }}
    >
        {children}
    </button>
);

const LiveView = ({ liveTrack, stats }) => {
    if (!liveTrack) return <div className="flex flex-col items-center justify-center h-full text-center py-32"><Music className="w-14 h-14 mb-4 text-[#535353]" /><p className="text-base font-bold text-white">Nothing playing</p></div>;

    return (
        /* Added h-full and overflow-y-auto here so this section scrolls! */
        <div className="h-full overflow-y-auto custom-scrollbar pb-32">

            {/* Shrunken Hero Banner */}
            <div className="relative flex flex-col px-6 pt-10 pb-5" style={{ background: 'linear-gradient(180deg,rgba(29,185,84,0.2) 0%,rgba(18,18,18,1) 100%)', minHeight: 240 }}>
                <div className="flex items-end gap-4 w-full">
                    {/* Image shrunk to 160px */}
                    <img
                        src={liveTrack.albumArt}
                        alt={liveTrack.title}
                        className="rounded shadow-2xl flex-shrink-0"
                        style={{ width: 160, height: 160, objectFit: 'cover' }}
                    />
                    <div className="pb-1 flex-1 min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white mb-1 opacity-80">Now Playing</p>
                        {/* Shrunken font sizes */}
                        <h1 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tighter mb-1 truncate w-full">
                            {liveTrack.title}
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <img src={liveTrack.albumArt} className="w-4 h-4 rounded-full object-cover" alt="" />
                            <p className="text-[12px] font-bold text-white hover:underline cursor-pointer truncate">{liveTrack.artist}</p>
                            <span className="text-[#b3b3b3] text-[11px]">• 2026</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tightened Action Row */}
            <div className="flex items-center gap-4 px-6 py-2">
                <button className="w-10 h-10 rounded-full flex items-center justify-center bg-[#1db954] hover:scale-105 transition-transform shadow-lg">
                    {liveTrack.isPlaying ? <Pause size={20} className="fill-black text-black" /> : <Play size={20} className="fill-black text-black ml-0.5" />}
                </button>
                <Heart size={24} className="text-[#b3b3b3] hover:text-white cursor-pointer transition-colors" />
            </div>

            {/* Recommended Section */}
            {stats?.tracks && (
                <div className="px-8 mt-6">
                    <h2 className="text-xl font-bold text-white mb-4 hover:underline cursor-pointer">Recommended for you</h2>
                    <div className="flex flex-col">
                        {stats.tracks.slice(0, 8).map((track, i) => (
                            <div key={i} className="group flex items-center py-2 px-3 hover:bg-white/10 transition-colors cursor-pointer rounded-md">
                                {/* Back to original 10w size */}
                                <div className="w-10 text-center flex items-center justify-center text-sm font-normal text-[#b3b3b3]">
                                    <span className="group-hover:hidden">{i + 1}</span>
                                    <Play size={14} className="hidden group-hover:block fill-white text-white" />
                                </div>
                                <div className="flex-1 min-w-0 pr-4">
                                    <div className="flex items-center gap-3">
                                        {/* Image restored to 10x10 */}
                                        <img src={track.cover} alt="" className="w-10 h-10 rounded shadow-sm flex-shrink-0 object-cover" />
                                        <div className="min-w-0">
                                            {/* Text restored to base and sm */}
                                            <p className="text-base font-medium text-white truncate">{track.title}</p>
                                            <p className="text-sm text-[#b3b3b3] truncate">{track.artist}</p>
                                        </div>
                                    </div>
                                </div>
                                <Heart size={16} className="text-[#b3b3b3] opacity-0 group-hover:opacity-100 hover:text-white transition-all mr-6" />
                                <div className="text-sm text-[#b3b3b3] text-right tabular-nums">
                                    3:42
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const StatsView = ({ stats }) => (
    <div className="pb-99"> {/* Increased padding so play bar doesn't overlap */}
        {/* Hero gradient header */}
        <div
            className="px-8 pt-20 pb-8"
            style={{ background: 'linear-gradient(180deg,rgba(80,56,160,0.5) 0%,transparent 100%)' }}
        >
            <p className="text-xs font-bold text-white mb-2 tracking-widest uppercase">Profile Overview</p>
            <h1 className="text-6xl font-black text-white tracking-tighter">Blake's Stats</h1>
        </div>

        <div className="px-8 space-y-12">

            {/* On Repeat */}
            <section>
                <SectionHeader>On Repeat</SectionHeader>
                <div className="w-full">
                    <div className="flex text-[#b3b3b3] text-xs font-bold uppercase tracking-wider border-b border-white/10 pb-2 mb-3 px-2">
                        <div className="w-10 text-center">#</div>
                        <div className="flex-1">Title</div>
                        <div className="w-32 text-left hidden sm:block">Artist</div>
                        <div className="w-12 text-right"><Clock size={16} className="inline" /></div>
                    </div>
                    <div className="flex flex-col">
                        {stats?.tracks?.slice(0, 5).map((track, i) => (
                            <div key={i} className="group flex items-center py-2 px-2 hover:bg-white/10 transition-colors cursor-pointer rounded-md">
                                <div className="w-10 text-center flex items-center justify-center text-sm font-normal text-[#b3b3b3]">
                                    <span className="group-hover:hidden">{i + 1}</span>
                                    <Play size={14} className="hidden group-hover:block fill-white text-white" />
                                </div>
                                <div className="flex-1 min-w-0 pr-4">
                                    <a href={track.url} target="_blank" rel="noreferrer" className="flex items-center gap-3">
                                        <img src={track.cover} alt="" className="w-10 h-10 rounded shadow-sm flex-shrink-0 object-cover" />
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-white truncate">{track.title}</p>
                                            <p className="text-xs text-[#b3b3b3] truncate sm:hidden block">{track.artist}</p>
                                        </div>
                                    </a>
                                </div>
                                <div className="w-32 text-sm text-[#b3b3b3] truncate hover:underline hover:text-white transition-colors hidden sm:block">
                                    {track.artist}
                                </div>
                                <div className="w-12 text-sm text-[#b3b3b3] text-right tabular-nums">
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {stats?.artists?.slice(0, 4).map((artist, i) => (
                        <a key={i} href={artist.url} target="_blank" rel="noreferrer"
                            className="flex flex-col gap-2 p-4 rounded-lg cursor-pointer bg-[#181818] hover:bg-[#282828] transition-all group shadow-md">
                            <div className="relative w-full aspect-square mb-2">
                                <img src={artist.image} alt="" className="rounded-full shadow-2xl object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                                <div className="absolute bottom-1 right-1 w-10 h-10 bg-[#1db954] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-xl">
                                    <Play size={16} className="fill-black text-black ml-1" />
                                </div>
                            </div>
                            <div className="flex flex-col min-w-0">
                                <p className="text-sm font-bold text-white truncate w-full pb-0.5">{artist.name}</p>
                                <p className="text-xs font-semibold text-[#b3b3b3]">Artist</p>
                            </div>
                        </a>
                    ))}
                </div>
            </section>

            {/* Recently Played */}
            <section>
                <SectionHeader>Recently Played</SectionHeader>
                <div className="grid grid-cols-2 gap-4">
                    {stats?.recentlyPlayed?.slice(0, 4).map((track, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 rounded-md overflow-hidden cursor-pointer group hover:bg-white/20 transition-colors"
                            style={{ background: 'rgba(255,255,255,0.1)' }}
                        >
                            <img src={track.cover} alt="" className="w-16 h-16 object-cover flex-shrink-0" />
                            <div className="min-w-0 flex-1 pr-4 py-2">
                                <p className="text-base font-bold text-white truncate group-hover:text-white">{track.title}</p>
                                <p className="text-sm truncate mt-0.5" style={{ color: '#b3b3b3' }}>{track.artist}</p>
                            </div>
                            <div className="mr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg" style={{ background: '#1db954' }}>
                                    <Play size={18} className="fill-black text-black ml-1" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    </div>
);

const SectionHeader = ({ children }) => (
    <div className="flex items-end justify-between mb-4 px-2">
        <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer tracking-tight">{children}</h2>
        <button className="text-xs font-bold text-[#b3b3b3] hover:underline hover:text-white transition-colors uppercase tracking-wider">
            Show all
        </button>
    </div>
);

const NowPlayingPanel = ({ track, stats }) => {
    // Dynamically find artist image, fallback to album art
    const artistMatch = stats?.artists?.find(a => a.name.toLowerCase() === track.artist.toLowerCase());
    const artistImg = artistMatch ? artistMatch.image : track.albumArt;

    return (
        <div className="flex flex-col h-full bg-[#121212]">
            <div className="px-5 pt-5 pb-3 flex items-center justify-between flex-shrink-0">
                <p className="text-base font-bold text-white hover:underline cursor-pointer">Now Playing</p>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 flex flex-col gap-6 pb-32">
                <img src={track.albumArt} alt={track.title} className="w-full rounded-xl shadow-2xl" style={{ aspectRatio: '1/1', objectFit: 'cover' }} />
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <a href={track.songUrl} target="_blank" rel="noreferrer"
                            className="font-bold text-white hover:underline truncate block text-2xl leading-tight pb-1">{track.title}</a>
                        <p className="text-base truncate hover:underline cursor-pointer" style={{ color: '#b3b3b3' }}>{track.artist}</p>
                    </div>
                    <Heart size={24} style={{ color: '#1db954' }} className="flex-shrink-0 hover:scale-105 cursor-pointer transition-transform mt-1 fill-current" />
                </div>

                {/* Dynamic About the Artist Card */}
                <div className="rounded-xl overflow-hidden bg-[#242424] cursor-pointer hover:bg-[#2a2a2a] transition-colors relative group mt-2 flex-shrink-0 shadow-lg">
                    <img src={artistImg} className="w-full h-56 object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" alt="Artist Background" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-5 flex flex-col justify-end">
                        <p className="text-base font-bold text-white mb-1">About the artist</p>
                        <p className="text-sm font-bold text-white truncate mb-1">{track.artist}</p>
                        <p className="text-xs line-clamp-2" style={{ color: '#b3b3b3' }}>1,245,678 monthly listeners. Check out more from {track.artist} in this curated collection.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SpotifyWindow = WindowWrapper(Spotify, "spotify");
export default SpotifyWindow;