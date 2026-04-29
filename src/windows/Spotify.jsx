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
            className="w-full h-full flex flex-col overflow-hidden"
            style={{ background: '#000', fontFamily: "'Circular Std', 'Helvetica Neue', Helvetica, Arial, sans-serif", width: '1000px', }}
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
                    style={{ width: 240 }}
                >
                    {/* Nav card */}
                    <div className="rounded-xl p-5 flex flex-col gap-1" style={{ background: '#121212' }}>
                        <NavItem icon={<Home size={24} />} label="Home" active={activeTab === 'live'} onClick={() => setActiveTab('live')} />
                        <NavItem icon={<Search size={24} />} label="Search" />
                    </div>

                    {/* Library card */}
                    <div className="rounded-xl flex flex-col flex-1 overflow-hidden" style={{ background: '#121212' }}>
                        <div className="flex items-center justify-between px-4 pt-4 pb-2">
                            <button className="flex items-center gap-2 text-sm font-bold" style={{ color: '#b3b3b3' }}>
                                <Library size={24} />
                                <span>Your Library</span>
                            </button>
                            <button style={{ color: '#b3b3b3' }} className="hover:text-white transition-colors">
                                <PlusSquare size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1 custom-scrollbar">
                            {/* Liked Songs pinned */}
                            <div className="flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer hover:bg-white/10 transition-colors">
                                <div className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'linear-gradient(135deg,#450af5,#c4efd9)' }}>
                                    <Heart size={14} fill="white" color="white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-white truncate">Liked Songs</p>
                                    <p className="text-xs truncate" style={{ color: '#b3b3b3' }}>Playlist</p>
                                </div>
                            </div>

                            {/* Top artists as "playlists" */}
                            {stats?.artists?.map((artist, i) => (
                                <div key={i} className="flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer hover:bg-white/10 transition-colors">
                                    <img src={artist.image} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-white truncate">{artist.name}</p>
                                        <p className="text-xs truncate" style={{ color: '#b3b3b3' }}>Artist</p>
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
                    <div className="flex items-center justify-between px-6 pt-4 pb-2 flex-shrink-0" style={{ background: 'transparent' }}>
                        <div className="flex items-center gap-2">
                            <TabBtn active={activeTab === 'live'} onClick={() => setActiveTab('live')}>
                                <Music size={14} className="inline mr-1" />Now Playing
                            </TabBtn>
                            <TabBtn active={activeTab === 'stats'} onClick={() => setActiveTab('stats')}>
                                <BarChart2 size={14} className="inline mr-1" />Stats
                            </TabBtn>
                        </div>
                    </div>

                    {/* Scrollable content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="h-full flex items-center justify-center">
                                <Music className="w-10 h-10 animate-pulse" style={{ color: '#1db954' }} />
                            </div>
                        ) : activeTab === 'live' ? (
                            <LiveView liveTrack={liveTrack} />
                        ) : (
                            <StatsView stats={stats} />
                        )}
                    </div>
                </main>

                {/* ── Right Panel: Now Playing sidebar (Spotify desktop style) ── */}
                {liveTrack && (
                    <aside
                        className="flex-shrink-0 rounded-xl flex flex-col overflow-hidden"
                        style={{ width: 280, background: '#121212' }}
                    >
                        <NowPlayingPanel track={liveTrack} />
                    </aside>
                )}
            </div>

            {/* ── Now Playing Bar (bottom) ── */}
            <div
                className="flex-shrink-0 flex items-center justify-between px-4"
                style={{ height: 90, background: '#181818', borderTop: '1px solid #282828' }}
            >
                {/* Left: track info */}
                <div className="flex items-center gap-3 w-64 min-w-0">
                    {liveTrack ? (
                        <>
                            <img src={liveTrack.albumArt} alt="" className="w-14 h-14 rounded shadow-lg flex-shrink-0" />
                            <div className="min-w-0">
                                <a href={liveTrack.songUrl} target="_blank" rel="noreferrer"
                                    className="text-sm font-semibold text-white hover:underline truncate block">{liveTrack.title}</a>
                                <p className="text-xs truncate" style={{ color: '#b3b3b3' }}>{liveTrack.artist}</p>
                            </div>
                            <Heart size={16} style={{ color: '#b3b3b3' }} className="flex-shrink-0 ml-2 hover:text-white cursor-pointer transition-colors" />
                        </>
                    ) : (
                        <p className="text-xs" style={{ color: '#b3b3b3' }}>Nothing playing</p>
                    )}
                </div>

                {/* Center: transport controls */}
                <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="flex items-center gap-5">
                        <Shuffle size={16} style={{ color: '#b3b3b3' }} className="cursor-pointer hover:text-white transition-colors" />
                        <SkipBack size={20} style={{ color: '#b3b3b3' }} className="cursor-pointer hover:text-white transition-colors" />
                        <button
                            className="w-8 h-8 rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform"
                            style={{ background: '#fff' }}
                        >
                            {liveTrack?.isPlaying
                                ? <Pause size={16} className="fill-black" />
                                : <Play size={16} className="fill-black ml-0.5" />}
                        </button>
                        <SkipForward size={20} style={{ color: '#b3b3b3' }} className="cursor-pointer hover:text-white transition-colors" />
                        <Repeat size={16} style={{ color: '#b3b3b3' }} className="cursor-pointer hover:text-white transition-colors" />
                    </div>
                    {/* Progress bar */}
                    <div className="flex items-center gap-2 w-full max-w-sm">
                        <span className="text-[10px]" style={{ color: '#b3b3b3' }}>0:00</span>
                        <div className="flex-1 h-1 rounded-full" style={{ background: '#535353' }}>
                            <div className="h-full rounded-full" style={{ width: liveTrack?.isPlaying ? '35%' : '0%', background: '#fff' }} />
                        </div>
                        <span className="text-[10px]" style={{ color: '#b3b3b3' }}>–:––</span>
                    </div>
                </div>

                {/* Right: volume + extras */}
                <div className="flex items-center gap-3 w-64 justify-end">
                    <Mic2 size={16} style={{ color: '#b3b3b3' }} className="cursor-pointer hover:text-white transition-colors" />
                    <ListMusic size={16} style={{ color: '#b3b3b3' }} className="cursor-pointer hover:text-white transition-colors" />
                    <MonitorSpeaker size={16} style={{ color: '#b3b3b3' }} className="cursor-pointer hover:text-white transition-colors" />
                    <Volume2 size={16} style={{ color: '#b3b3b3' }} />
                    <div className="w-24 h-1 rounded-full" style={{ background: '#535353' }}>
                        <div className="h-full w-3/4 rounded-full" style={{ background: '#fff' }} />
                    </div>
                    <Maximize2 size={16} style={{ color: '#b3b3b3' }} className="cursor-pointer hover:text-white transition-colors" />
                </div>
            </div>
        </div>
    );
};

/* ── Sub-components ── */

const NavItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-4 px-1 py-2 w-full rounded transition-colors"
        style={{ color: active ? '#fff' : '#b3b3b3', fontWeight: active ? 700 : 500, fontSize: 14 }}
    >
        <span style={{ color: active ? '#fff' : '#b3b3b3' }}>{icon}</span>
        {label}
    </button>
);

const TabBtn = ({ children, active, onClick }) => (
    <button
        onClick={onClick}
        className="px-4 py-1.5 rounded-full text-sm font-bold transition-colors"
        style={{
            background: active ? '#fff' : 'transparent',
            color: active ? '#000' : '#b3b3b3',
        }}
    >
        {children}
    </button>
);

const LiveView = ({ liveTrack }) => {
    if (!liveTrack) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center py-32">
                <Music className="w-16 h-16 mb-4" style={{ color: '#535353' }} />
                <p className="text-base font-semibold" style={{ color: '#b3b3b3' }}>Nothing playing right now</p>
                <p className="text-sm mt-1" style={{ color: '#535353' }}>Start listening on any device</p>
            </div>
        );
    }

    return (
        <div>
            {/* Hero banner */}
            <div
                className="relative flex flex-col px-6 pt-8 pb-6"
                style={{
                    background: 'linear-gradient(180deg,rgba(29,185,84,0.35) 0%,transparent 100%)',
                    minHeight: 340
                }}
            >
                {liveTrack.isPlaying && (
                    <div className="flex items-center gap-2 mb-6">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#1db954' }}></span>
                            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#1db954' }}></span>
                        </span>
                        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#1db954' }}>Now Playing</p>
                    </div>
                )}

                <div className="flex items-end gap-6">
                    <a href={liveTrack.songUrl} target="_blank" rel="noreferrer">
                        <img
                            src={liveTrack.albumArt}
                            alt={liveTrack.title}
                            className="rounded shadow-2xl hover:scale-105 transition-transform duration-300"
                            style={{ width: 232, height: 232, objectFit: 'cover' }}
                        />
                    </a>
                    <div className="pb-2">
                        <p className="text-xs font-bold uppercase mb-1" style={{ color: '#b3b3b3' }}>Single</p>
                        <h1 className="text-5xl font-black text-white leading-tight mb-2">{liveTrack.title}</h1>
                        <p className="text-base font-semibold" style={{ color: '#b3b3b3' }}>{liveTrack.artist}</p>
                    </div>
                </div>
            </div>

            {/* Action row */}
            <div className="flex items-center gap-6 px-6 py-4">
                <button
                    className="w-14 h-14 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                    style={{ background: '#1db954' }}
                >
                    {liveTrack.isPlaying
                        ? <Pause size={24} className="fill-black text-black" />
                        : <Play size={24} className="fill-black text-black ml-1" />}
                </button>
                <Heart size={32} style={{ color: '#b3b3b3' }} className="hover:text-white cursor-pointer transition-colors" />
            </div>
        </div>
    );
};

const StatsView = ({ stats }) => (
    <div>
        {/* Hero gradient header */}
        <div
            className="px-6 pt-8 pb-6"
            style={{ background: 'linear-gradient(180deg,rgba(80,56,160,0.5) 0%,transparent 100%)' }}
        >
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#b3b3b3' }}>Your Listening</p>
            <h1 className="text-5xl font-black text-white">Stats</h1>
        </div>

        <div className="px-6 pb-24 space-y-10">

            {/* On Repeat */}
            <section>
                <SectionHeader>On Repeat</SectionHeader>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b" style={{ borderColor: '#282828' }}>
                            <th className="text-left pb-2 w-8 text-xs font-bold" style={{ color: '#b3b3b3' }}>#</th>
                            <th className="text-left pb-2 text-xs font-bold" style={{ color: '#b3b3b3' }}>Title</th>
                            <th className="text-right pb-2 text-xs font-bold pr-2" style={{ color: '#b3b3b3' }}>Artist</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats?.tracks?.slice(0, 5).map((track, i) => (
                            <tr
                                key={i}
                                className="group hover:bg-white/10 transition-colors cursor-pointer rounded-md"
                            >
                                <td className="py-2 pl-2 text-sm w-8 rounded-l-md" style={{ color: '#b3b3b3' }}>
                                    <span className="group-hover:hidden">{i + 1}</span>
                                    <Play size={14} className="hidden group-hover:block fill-white text-white" />
                                </td>
                                <td className="py-2">
                                    <a href={track.url} target="_blank" rel="noreferrer" className="flex items-center gap-3">
                                        <img src={track.cover} alt="" className="w-10 h-10 rounded shadow flex-shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-white truncate group-hover:text-white">{track.title}</p>
                                        </div>
                                    </a>
                                </td>
                                <td className="py-2 pr-4 text-sm text-right rounded-r-md" style={{ color: '#b3b3b3' }}>
                                    <span className="truncate">{track.artist}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* Top Artists */}
            <section>
                <SectionHeader>Top Artists</SectionHeader>
                <div className="grid grid-cols-3 gap-4">
                    {stats?.artists?.slice(0, 6).map((artist, i) => (
                        <a
                            key={i}
                            href={artist.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex flex-col items-center gap-3 p-4 rounded-lg cursor-pointer hover:bg-white/10 transition-colors group text-center"
                        >
                            <img
                                src={artist.image}
                                alt=""
                                className="rounded-full shadow-xl object-cover group-hover:scale-105 transition-transform duration-300"
                                style={{ width: 96, height: 96 }}
                            />
                            <div>
                                <p className="text-sm font-bold text-white truncate w-full">{artist.name}</p>
                                <p className="text-xs" style={{ color: '#b3b3b3' }}>Artist</p>
                            </div>
                        </a>
                    ))}
                </div>
            </section>

            {/* Recently Played */}
            <section>
                <SectionHeader>Recently Played</SectionHeader>
                <div className="grid grid-cols-2 gap-3">
                    {stats?.recentlyPlayed?.slice(0, 4).map((track, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 rounded-md overflow-hidden cursor-pointer group hover:bg-white/20 transition-colors"
                            style={{ background: 'rgba(255,255,255,0.1)' }}
                        >
                            <img src={track.cover} alt="" className="w-14 h-14 object-cover flex-shrink-0" />
                            <div className="min-w-0 flex-1 pr-3">
                                <p className="text-sm font-bold text-white truncate group-hover:text-white">{track.title}</p>
                                <p className="text-xs truncate" style={{ color: '#b3b3b3' }}>{track.artist}</p>
                            </div>
                            <div className="mr-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg" style={{ background: '#1db954' }}>
                                    <Play size={14} className="fill-black text-black ml-0.5" />
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
    <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-black text-white">{children}</h2>
        <button className="text-xs font-bold uppercase tracking-wider hover:underline" style={{ color: '#b3b3b3' }}>
            Show all
        </button>
    </div>
);

const NowPlayingPanel = ({ track }) => (
    <div className="flex flex-col h-full">
        <div className="px-4 pt-4 pb-2 flex items-center justify-between flex-shrink-0">
            <p className="text-sm font-bold text-white">Now Playing</p>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-4">
            <img src={track.albumArt} alt={track.title} className="w-full rounded-xl shadow-2xl" style={{ aspectRatio: '1/1', objectFit: 'cover' }} />
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <a href={track.songUrl} target="_blank" rel="noreferrer"
                        className="font-bold text-white hover:underline truncate block text-base">{track.title}</a>
                    <p className="text-sm truncate" style={{ color: '#b3b3b3' }}>{track.artist}</p>
                </div>
                <Heart size={20} style={{ color: '#b3b3b3' }} className="flex-shrink-0 hover:text-white cursor-pointer transition-colors mt-0.5" />
            </div>
            {track.isPlaying && (
                <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#1db954' }}></span>
                        <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#1db954' }}></span>
                    </span>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#1db954' }}>Live</p>
                </div>
            )}
        </div>
    </div>
);

const SpotifyWindow = WindowWrapper(Spotify, "spotify");
export default SpotifyWindow;