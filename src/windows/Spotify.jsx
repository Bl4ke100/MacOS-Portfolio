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
        fontFamily: "'Circular Std', 'Helvetica Neue', Helvetica, Arial, sans-serif"
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
          style={{ width: 260 }}
        >
          {/* Nav card */}
          <div className="rounded-xl p-4 flex flex-col gap-2" style={{ background: '#121212' }}>
            <NavItem icon={<Home size={24} />} label="Home" active={activeTab === 'live'} onClick={() => setActiveTab('live')} />
            <NavItem icon={<Search size={24} />} label="Search" />
          </div>

          {/* Library card */}
          <div className="rounded-xl flex flex-col flex-1 overflow-hidden" style={{ background: '#121212' }}>
            <div className="flex items-center justify-between px-4 pt-4 pb-3">
              <button className="flex items-center gap-3 text-base font-bold hover:text-white transition-colors" style={{ color: '#b3b3b3' }}>
                <Library size={24} />
                <span>Your Library</span>
              </button>
              <button style={{ color: '#b3b3b3' }} className="hover:text-white transition-colors">
                <PlusSquare size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1 custom-scrollbar">
              <div className="flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded flex items-center justify-center flex-shrink-0 shadow-md"
                  style={{ background: 'linear-gradient(135deg,#450af5,#c4efd9)' }}>
                  <Heart size={16} fill="white" color="white" />
                </div>
                <div className="min-w-0">
                  <p className="text-base font-bold text-white truncate">Liked Songs</p>
                  <p className="text-sm truncate mt-0.5" style={{ color: '#b3b3b3' }}>Playlist • {stats?.tracks?.length * 12 || 42} songs</p>
                </div>
              </div>

              {stats?.artists?.map((artist, i) => (
                <div key={i} className="flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer hover:bg-white/10 transition-colors">
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
          className="flex-1 min-w-0 rounded-xl overflow-hidden flex flex-col relative"
          style={{ background: '#121212' }}
        >
          {/* Sticky Top nav bar */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 flex-shrink-0 bg-[#121212]/90 backdrop-blur-sm border-b border-transparent">
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
            style={{ width: 280, background: '#121212' }}
          >
            <NowPlayingPanel track={liveTrack} />
          </aside>
        )}
      </div>

      {/* ── Now Playing Bar (bottom) ── */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 mt-2"
        style={{ height: 90, background: '#000' }}
      >
        {/* Left: track info */}
        <div className="flex items-center gap-3 w-[30%] min-w-0">
          {liveTrack ? (
            <>
              <img src={liveTrack.albumArt} alt="" className="w-14 h-14 rounded shadow-lg flex-shrink-0" />
              <div className="min-w-0">
                <a href={liveTrack.songUrl} target="_blank" rel="noreferrer"
                  className="text-sm font-bold text-white hover:underline truncate block leading-tight">{liveTrack.title}</a>
                <p className="text-xs truncate mt-1 hover:underline cursor-pointer hover:text-white" style={{ color: '#b3b3b3' }}>{liveTrack.artist}</p>
              </div>
              <Heart size={16} style={{ color: '#1db954' }} className="flex-shrink-0 ml-2 hover:scale-105 cursor-pointer transition-transform fill-current" />
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
              className="w-8 h-8 rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform"
              style={{ background: '#fff' }}
            >
              {liveTrack?.isPlaying
                ? <Pause size={16} className="fill-black" />
                : <Play size={16} className="fill-black ml-1" />}
            </button>
            <SkipForward size={20} style={{ color: '#b3b3b3' }} className="cursor-pointer hover:text-white transition-colors fill-current" />
            <Repeat size={16} style={{ color: '#b3b3b3' }} className="cursor-pointer hover:text-white transition-colors" />
          </div>
          {/* Progress bar */}
          <div className="flex items-center gap-3 w-full group cursor-pointer">
            <span className="text-xs" style={{ color: '#b3b3b3' }}>0:00</span>
            <div className="flex-1 h-1 rounded-full" style={{ background: '#535353' }}>
              <div className="h-full rounded-full group-hover:bg-[#1db954] transition-colors relative" style={{ width: liveTrack?.isPlaying ? '35%' : '0%', background: '#fff' }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-md"></div>
              </div>
            </div>
            <span className="text-xs" style={{ color: '#b3b3b3' }}>–:––</span>
          </div>
        </div>

        {/* Right: volume + extras */}
        <div className="flex items-center gap-4 w-[30%] justify-end">
          <Mic2 size={16} style={{ color: '#b3b3b3' }} className="cursor-pointer hover:text-white transition-colors" />
          <ListMusic size={16} style={{ color: '#b3b3b3' }} className="cursor-pointer hover:text-white transition-colors" />
          <MonitorSpeaker size={16} style={{ color: '#b3b3b3' }} className="cursor-pointer hover:text-white transition-colors" />
          <div className="flex items-center gap-2 group cursor-pointer ml-1">
            <Volume2 size={16} style={{ color: '#b3b3b3' }} className="hover:text-white transition-colors" />
            <div className="w-20 h-1 rounded-full" style={{ background: '#535353' }}>
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

const LiveView = ({ liveTrack }) => {
  if (!liveTrack) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-40">
        <Music className="w-16 h-16 mb-4" style={{ color: '#535353' }} />
        <p className="text-lg font-bold" style={{ color: '#fff' }}>Nothing playing right now</p>
        <p className="text-sm mt-2" style={{ color: '#b3b3b3' }}>Start listening on any device</p>
      </div>
    );
  }

  return (
    <div className="relative w-full flex flex-col min-h-[400px]">
      {/* Blurred Hero Background */}
      <div className="absolute top-0 left-0 right-0 h-80 overflow-hidden pointer-events-none rounded-t-xl z-0">
        <img src={liveTrack.albumArt} className="w-full h-full object-cover blur-[60px] opacity-50 scale-150 saturate-150" alt="" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#121212]/80 to-[#121212]"></div>
      </div>

      {/* Content Foreground */}
      <div className="relative z-10 px-6 pt-8 pb-6 flex flex-col mt-auto w-full">
        <div className="flex items-end gap-6 mt-12 w-full">
          <a href={liveTrack.songUrl} target="_blank" rel="noreferrer" className="flex-shrink-0">
            <img
              src={liveTrack.albumArt}
              alt={liveTrack.title}
              className="rounded-lg shadow-2xl hover:scale-105 transition-transform duration-300 object-cover"
              style={{ width: 180, height: 180 }}
            />
          </a>
          <div className="pb-2 flex flex-col gap-2 min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-white drop-shadow-md">Song</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tighter mb-1 break-words line-clamp-2 drop-shadow-lg">
                {liveTrack.title}
            </h1>
            <div className="flex items-center gap-2 mt-1">
                <img src={liveTrack.albumArt} className="w-6 h-6 rounded-full object-cover shadow-md flex-shrink-0" alt="" />
                <span className="text-sm font-bold text-white hover:underline cursor-pointer truncate">{liveTrack.artist}</span>
                <span className="text-[#b3b3b3] text-sm font-medium flex-shrink-0">• 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action controls under Hero */}
      <div className="relative z-10 px-6 py-4 flex items-center gap-5">
        <button
          className="w-14 h-14 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-xl bg-[#1db954]"
        >
          {liveTrack.isPlaying
            ? <Pause size={24} className="fill-black text-black" />
            : <Play size={24} className="fill-black text-black ml-1" />}
        </button>
        <Heart size={32} className="text-[#1db954] cursor-pointer hover:scale-105 transition-transform fill-current" />
      </div>
    </div>
  );
};

const StatsView = ({ stats }) => (
  <div>
    <div className="px-6 pt-10 pb-6" style={{ background: 'linear-gradient(180deg,rgba(80,56,160,0.4) 0%,rgba(18,18,18,1) 100%)' }}>
      <p className="text-xs font-bold text-white mb-2 tracking-widest uppercase">Profile Overview</p>
      <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">Your Stats</h1>
    </div>

    <div className="px-6 pb-20 space-y-10">
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
    </div>
  </div>
);

const SectionHeader = ({ children }) => (
  <div className="flex items-end justify-between mb-4 px-2">
    <h2 className="text-xl font-bold text-white hover:underline cursor-pointer tracking-tight">{children}</h2>
    <button className="text-xs font-bold text-[#b3b3b3] hover:underline hover:text-white transition-colors">
      Show all
    </button>
  </div>
);

const NowPlayingPanel = ({ track }) => (
  <div className="flex flex-col h-full bg-[#121212]">
    <div className="px-4 pt-4 pb-2 flex items-center justify-between flex-shrink-0">
      <p className="text-sm font-bold text-white hover:underline cursor-pointer">Now Playing</p>
    </div>
    <div className="flex-1 overflow-y-auto scrollbar-hide p-4 flex flex-col gap-4">
      <img src={track.albumArt} alt={track.title} className="w-full rounded-lg shadow-xl" style={{ aspectRatio: '1/1', objectFit: 'cover' }} />
      <div className="flex items-start justify-between gap-2 mt-1">
        <div className="min-w-0 flex flex-col gap-0.5">
          <a href={track.songUrl} target="_blank" rel="noreferrer"
            className="text-xl font-bold text-white hover:underline truncate block leading-tight">{track.title}</a>
          <p className="text-sm text-[#b3b3b3] hover:text-white hover:underline cursor-pointer truncate">{track.artist}</p>
        </div>
        <Heart size={20} className="text-[#1db954] flex-shrink-0 cursor-pointer hover:scale-105 transition-transform fill-current mt-1" />
      </div>

      <div className="rounded-lg overflow-hidden bg-[#242424] cursor-pointer hover:bg-[#2a2a2a] transition-colors relative group mt-3 shadow-md">
         <img src={track.albumArt} className="w-full h-40 object-cover opacity-40 group-hover:scale-105 transition-transform duration-500" alt="" />
         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col justify-end">
            <p className="text-sm font-bold text-white">About the artist</p>
            <p className="text-[#b3b3b3] text-xs line-clamp-2 mt-1">Check out more from {track.artist} and similar artists in this curated collection.</p>
         </div>
      </div>
    </div>
  </div>
);

const SpotifyWindow = WindowWrapper(Spotify, "spotify");
export default SpotifyWindow;