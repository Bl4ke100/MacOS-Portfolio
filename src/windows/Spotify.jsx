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
      className="w-full h-full flex flex-col overflow-hidden shadow-2xl rounded-xl"
      style={{ 
        background: '#000', 
        fontFamily: "'Circular Std', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        minWidth: '1150px', // Forces layout to stay wide and breathable
        minHeight: '750px' 
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
      {/* Increased gap between columns to 4 and edge padding to 4 */}
      <div className="flex flex-1 gap-4 px-4 overflow-hidden" style={{ paddingBottom: 0 }}>

        {/* ── Left Sidebar ── */}
        <aside
          className="flex flex-col gap-4 flex-shrink-0"
          style={{ width: 280 }} // Increased from 240
        >
          {/* Nav card */}
          <div className="rounded-xl p-6 flex flex-col gap-2" style={{ background: '#121212' }}>
            <NavItem icon={<Home size={26} />} label="Home" active={activeTab === 'live'} onClick={() => setActiveTab('live')} />
            <NavItem icon={<Search size={26} />} label="Search" />
          </div>

          {/* Library card */}
          <div className="rounded-xl flex flex-col flex-1 overflow-hidden" style={{ background: '#121212' }}>
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <button className="flex items-center gap-3 text-base font-bold hover:text-white transition-colors" style={{ color: '#b3b3b3' }}>
                <Library size={26} />
                <span>Your Library</span>
              </button>
              <button style={{ color: '#b3b3b3' }} className="hover:text-white transition-colors">
                <PlusSquare size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 custom-scrollbar">
              {/* Liked Songs pinned */}
              <div className="flex items-center gap-4 px-2 py-2 rounded-md cursor-pointer hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded flex items-center justify-center flex-shrink-0 shadow-md"
                  style={{ background: 'linear-gradient(135deg,#450af5,#c4efd9)' }}>
                  <Heart size={18} fill="white" color="white" />
                </div>
                <div className="min-w-0">
                  <p className="text-base font-bold text-white truncate">Liked Songs</p>
                  <p className="text-sm truncate mt-0.5" style={{ color: '#b3b3b3' }}>Playlist</p>
                </div>
              </div>

              {/* Top artists as "playlists" */}
              {stats?.artists?.map((artist, i) => (
                <div key={i} className="flex items-center gap-4 px-2 py-2 rounded-md cursor-pointer hover:bg-white/10 transition-colors">
                  <img src={artist.image} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0 shadow-md" />
                  <div className="min-w-0">
                    <p className="text-base font-bold text-white truncate">{artist.name}</p>
                    <p className="text-sm truncate mt-0.5" style={{ color: '#b3b3b3' }}>Artist</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main
          className="flex-1 min-w-[500px] rounded-xl overflow-hidden flex flex-col relative"
          style={{ background: '#121212' }}
        >
          {/* Sticky Top nav bar */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-5 flex-shrink-0 bg-[#121212]/90 backdrop-blur-sm border-b border-transparent">
            <div className="flex items-center gap-3">
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
              <LiveView liveTrack={liveTrack} />
            ) : (
              <StatsView stats={stats} />
            )}
          </div>
        </main>

        {/* ── Right Panel: Now Playing sidebar ── */}
        {liveTrack && (
          <aside
            className="flex-shrink-0 rounded-xl flex flex-col overflow-hidden"
            style={{ width: 320, background: '#121212' }} // Increased from 280
          >
            <NowPlayingPanel track={liveTrack} />
          </aside>
        )}
      </div>

      {/* ── Now Playing Bar (bottom) ── */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-6 mt-4"
        style={{ height: 100, background: '#181818', borderTop: '1px solid #282828' }} // Taller for breathing room
      >
        {/* Left: track info */}
        <div className="flex items-center gap-4 w-[30%] min-w-0">
          {liveTrack ? (
            <>
              <img src={liveTrack.albumArt} alt="" className="w-16 h-16 rounded shadow-lg flex-shrink-0" />
              <div className="min-w-0">
                <a href={liveTrack.songUrl} target="_blank" rel="noreferrer"
                  className="text-base font-semibold text-white hover:underline truncate block leading-tight">{liveTrack.title}</a>
                <p className="text-sm truncate mt-1 hover:underline cursor-pointer hover:text-white" style={{ color: '#b3b3b3' }}>{liveTrack.artist}</p>
              </div>
              <Heart size={20} style={{ color: '#b3b3b3' }} className="flex-shrink-0 ml-4 hover:text-white cursor-pointer transition-colors" />
            </>
          ) : (
            <p className="text-sm" style={{ color: '#b3b3b3' }}>Nothing playing</p>
          )}
        </div>

        {/* Center: transport controls */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-[40%]">
          <div className="flex items-center gap-6">
            <Shuffle size={18} style={{ color: '#b3b3b3' }} className="cursor-pointer hover:text-white transition-colors" />
            <SkipBack size={24} style={{ color: '#b3b3b3' }} className="cursor-pointer hover:text-white transition-colors fill-current" />
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform"
              style={{ background: '#fff' }}
            >
              {liveTrack?.isPlaying
                ? <Pause size={20} className="fill-black" />
                : <Play size={20} className="fill-black ml-1" />}
            </button>
            <SkipForward size={24} style={{ color: '#b3b3b3' }} className="cursor-pointer hover:text-white transition-colors fill-current" />
            <Repeat size={18} style={{ color: '#b3b3b3' }} className="cursor-pointer hover:text-white transition-colors" />
          </div>
          {/* Progress bar */}
          <div className="flex items-center gap-3 w-full group cursor-pointer">
            <span className="text-xs" style={{ color: '#b3b3b3' }}>0:00</span>
            <div className="flex-1 h-1.5 rounded-full" style={{ background: '#535353' }}>
              <div className="h-full rounded-full group-hover:bg-[#1db954] transition-colors relative" style={{ width: liveTrack?.isPlaying ? '35%' : '0%', background: '#fff' }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-md"></div>
              </div>
            </div>
            <span className="text-xs" style={{ color: '#b3b3b3' }}>–:––</span>
          </div>
        </div>

        {/* Right: volume + extras */}
        <div className="flex items-center gap-4 w-[30%] justify-end">
          <Mic2 size={18} style={{ color: '#b3b3b3' }} className="cursor-pointer hover:text-white transition-colors" />
          <ListMusic size={18} style={{ color: '#b3b3b3' }} className="cursor-pointer hover:text-white transition-colors" />
          <MonitorSpeaker size={18} style={{ color: '#b3b3b3' }} className="cursor-pointer hover:text-white transition-colors" />
          <div className="flex items-center gap-2 group cursor-pointer ml-2">
            <Volume2 size={18} style={{ color: '#b3b3b3' }} className="hover:text-white transition-colors" />
            <div className="w-24 h-1.5 rounded-full" style={{ background: '#535353' }}>
              <div className="h-full w-3/4 rounded-full group-hover:bg-[#1db954] transition-colors relative" style={{ background: '#fff' }}>
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-md"></div>
              </div>
            </div>
          </div>
          <Maximize2 size={18} style={{ color: '#b3b3b3' }} className="cursor-pointer hover:text-white transition-colors ml-2" />
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
    <span className="group-hover:text-white transition-colors" style={{ fontWeight: active ? 700 : 600, fontSize: 16 }}>{label}</span>
  </button>
);

const TabBtn = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className="px-5 py-2 rounded-full text-sm font-bold transition-colors"
    style={{
      background: active ? '#fff' : 'rgba(255,255,255,0.1)',
      color: active ? '#000' : '#fff',
    }}
  >
    {children}
  </button>
);

const LiveView = ({ liveTrack }) => {
  if (!liveTrack) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-40">
        <Music className="w-20 h-20 mb-6" style={{ color: '#535353' }} />
        <p className="text-xl font-bold" style={{ color: '#fff' }}>Nothing playing right now</p>
        <p className="text-base mt-2" style={{ color: '#b3b3b3' }}>Start listening on any device</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero banner */}
      <div
        className="relative flex flex-col px-8 pt-10 pb-8"
        style={{
          background: 'linear-gradient(180deg,rgba(29,185,84,0.3) 0%,rgba(18,18,18,1) 100%)',
          minHeight: 400
        }}
      >
        {liveTrack.isPlaying && (
          <div className="flex items-center gap-3 mb-8 mt-4">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#1db954' }}></span>
              <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: '#1db954' }}></span>
            </span>
            <p className="text-sm font-bold uppercase tracking-widest" style={{ color: '#1db954' }}>Now Playing</p>
          </div>
        )}

        <div className="flex items-end gap-8 mt-auto">
          <a href={liveTrack.songUrl} target="_blank" rel="noreferrer" className="flex-shrink-0">
            <img
              src={liveTrack.albumArt}
              alt={liveTrack.title}
              className="rounded-lg shadow-2xl hover:scale-105 transition-transform duration-300"
              style={{ width: 260, height: 260, objectFit: 'cover' }}
            />
          </a>
          <div className="pb-2 flex flex-col gap-2">
            <p className="text-sm font-bold uppercase tracking-widest" style={{ color: '#b3b3b3' }}>Single</p>
            <h1 className="text-6xl lg:text-8xl font-black text-white leading-none tracking-tighter mb-2">{liveTrack.title}</h1>
            <div className="flex items-center gap-2 mt-2">
               <img src={liveTrack.albumArt} className="w-8 h-8 rounded-full object-cover shadow-sm" alt="" />
               <p className="text-lg font-bold text-white hover:underline cursor-pointer">{liveTrack.artist}</p>
               <span className="text-[#b3b3b3] text-lg font-medium mx-1">• 2026</span>
               <span className="text-[#b3b3b3] text-lg font-medium">• 3:42</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action row */}
      <div className="flex items-center gap-8 px-8 py-6">
        <button
          className="w-16 h-16 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-xl"
          style={{ background: '#1db954' }}
        >
          {liveTrack.isPlaying
            ? <Pause size={28} className="fill-black text-black" />
            : <Play size={28} className="fill-black text-black ml-1" />}
        </button>
        <Heart size={36} style={{ color: '#b3b3b3' }} className="hover:text-white cursor-pointer transition-colors" />
      </div>
    </div>
  );
};

const StatsView = ({ stats }) => (
  <div>
    {/* Hero gradient header */}
    <div
      className="px-8 pt-10 pb-8"
      style={{ background: 'linear-gradient(180deg,rgba(80,56,160,0.5) 0%,rgba(18,18,18,1) 100%)' }}
    >
      <p className="text-sm font-bold text-white mb-2 tracking-widest">PROFILE OVERVIEW</p>
      <h1 className="text-7xl font-black text-white tracking-tighter">Your Stats</h1>
    </div>

    <div className="px-8 pb-24 space-y-12">

      {/* On Repeat */}
      <section>
        <SectionHeader>On Repeat</SectionHeader>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b" style={{ borderColor: '#282828' }}>
              <th className="text-left pb-3 pl-2 w-12 text-sm font-medium" style={{ color: '#b3b3b3' }}>#</th>
              <th className="text-left pb-3 text-sm font-medium" style={{ color: '#b3b3b3' }}>Title</th>
              <th className="text-right pb-3 text-sm font-medium pr-4" style={{ color: '#b3b3b3' }}>Artist</th>
            </tr>
          </thead>
          <tbody>
            {stats?.tracks?.slice(0, 5).map((track, i) => (
              <tr
                key={i}
                className="group hover:bg-white/10 transition-colors cursor-pointer rounded-md"
              >
                <td className="py-3 pl-2 text-base w-12 rounded-l-md" style={{ color: '#b3b3b3' }}>
                  <span className="group-hover:hidden">{i + 1}</span>
                  <Play size={16} className="hidden group-hover:block fill-white text-white" />
                </td>
                <td className="py-3">
                  <a href={track.url} target="_blank" rel="noreferrer" className="flex items-center gap-4">
                    <img src={track.cover} alt="" className="w-12 h-12 rounded shadow flex-shrink-0 object-cover" />
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-white truncate">{track.title}</p>
                    </div>
                  </a>
                </td>
                <td className="py-3 pr-4 text-base text-right rounded-r-md hover:underline" style={{ color: '#b3b3b3' }}>
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {stats?.artists?.slice(0, 5).map((artist, i) => (
            <a
              key={i}
              href={artist.url}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col gap-3 p-5 rounded-lg cursor-pointer transition-all group shadow-sm"
              style={{ background: '#181818' }}
            >
              <div className="relative w-full aspect-square mb-2">
                 <img
                   src={artist.image}
                   alt=""
                   className="rounded-full shadow-2xl object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                 />
                 <div className="absolute bottom-2 right-2 w-14 h-14 bg-[#1db954] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-xl">
                    <Play size={24} className="fill-black text-black ml-1" />
                 </div>
              </div>
              <div className="flex flex-col w-full text-left">
                <p className="text-lg font-bold text-white truncate w-full pb-1">{artist.name}</p>
                <p className="text-sm font-semibold" style={{ color: '#b3b3b3' }}>Artist</p>
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
  <div className="flex items-end justify-between mb-6">
    <h2 className="text-3xl font-bold text-white tracking-tight hover:underline cursor-pointer">{children}</h2>
    <button className="text-sm font-bold hover:underline transition-colors" style={{ color: '#b3b3b3' }}>
      Show all
    </button>
  </div>
);

const NowPlayingPanel = ({ track }) => (
  <div className="flex flex-col h-full bg-[#121212]">
    <div className="px-5 pt-5 pb-3 flex items-center justify-between flex-shrink-0">
      <p className="text-base font-bold text-white hover:underline cursor-pointer">Now Playing</p>
    </div>
    <div className="flex-1 overflow-y-auto custom-scrollbar p-5 flex flex-col gap-6">
      <img src={track.albumArt} alt={track.title} className="w-full rounded-xl shadow-2xl" style={{ aspectRatio: '1/1', objectFit: 'cover' }} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <a href={track.songUrl} target="_blank" rel="noreferrer"
            className="font-bold text-white hover:underline truncate block text-2xl leading-tight pb-1">{track.title}</a>
          <p className="text-base truncate hover:underline cursor-pointer" style={{ color: '#b3b3b3' }}>{track.artist}</p>
        </div>
        <Heart size={24} style={{ color: '#1db954' }} className="flex-shrink-0 hover:scale-105 cursor-pointer transition-transform mt-1 fill-current" />
      </div>
      
      {/* About the artist mockup */}
      <div className="rounded-lg overflow-hidden bg-[#242424] cursor-pointer hover:bg-[#2a2a2a] transition-colors relative group mt-2">
         <img src={track.albumArt} className="w-full h-56 object-cover opacity-50 group-hover:scale-105 transition-transform duration-500" alt="Artist Background" />
         <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent p-5 flex flex-col justify-end">
            <p className="text-base font-bold text-white">About the artist</p>
            <p className="text-sm line-clamp-2 mt-1" style={{ color: '#b3b3b3' }}>Check out more from {track.artist} and similar artists in this curated collection.</p>
         </div>
      </div>
    </div>
  </div>
);

const SpotifyWindow = WindowWrapper(Spotify, "spotify");
export default SpotifyWindow;