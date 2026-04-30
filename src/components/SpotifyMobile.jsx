import React from 'react';
import useSpotifyData from '#hooks/useSpotifyData';
import { Heart, Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, ListMusic, Music } from 'lucide-react';

const SpotifyMobile = () => {
    const { liveTrack, stats, loading } = useSpotifyData();

    if (loading) {
        return (
            <div className="w-full h-full bg-[#121212] flex items-center justify-center text-white">
                <Music className="w-10 h-10 animate-pulse text-[#1db954]" />
            </div>
        );
    }

    if (!liveTrack) {
        return (
            <div className="w-full h-full bg-[#121212] flex flex-col items-center justify-center text-white">
                <Music size={48} className="text-gray-500 mb-4" />
                <p className="text-lg font-bold">Nothing playing</p>
            </div>
        );
    }

    const upNextData = (liveTrack.upNext && liveTrack.upNext.length > 0)
        ? liveTrack.upNext
        : (stats?.tracks ? stats.tracks.slice(0, 5) : []);

    return (
        <div className="w-full h-full bg-gradient-to-b from-zinc-800 to-[#121212] flex flex-col font-sans select-none overflow-y-auto custom-scrollbar pb-10 relative">
            {/* Header */}
            <div className="w-full pt-14 pb-4 px-6 flex items-center justify-center shrink-0">
                <p className="text-white/80 text-xs font-bold tracking-widest uppercase">Now Playing</p>
            </div>

            {/* Hero Album Art */}
            <div className="w-full px-8 py-4 flex justify-center shrink-0">
                <img 
                    src={liveTrack.albumArt} 
                    alt={liveTrack.title} 
                    className="w-full aspect-square rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.5)] object-cover" 
                />
            </div>

            {/* Track Info */}
            <div className="w-full px-8 flex justify-between items-center mt-6 shrink-0">
                <div className="flex-1 min-w-0 pr-4">
                    <h1 className="text-white text-2xl font-bold truncate leading-tight">{liveTrack.title}</h1>
                    <p className="text-[#b3b3b3] text-lg truncate mt-1">{liveTrack.artist}</p>
                </div>
                <button className="shrink-0 active:scale-90 transition-transform">
                    <Heart size={28} className="text-[#1db954] fill-current" />
                </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full px-8 mt-8 flex flex-col gap-2 shrink-0">
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-white rounded-full" 
                        style={{ width: liveTrack.isPlaying ? '35%' : '0%' }}
                    />
                </div>
                <div className="flex justify-between text-xs text-[#b3b3b3] font-medium tracking-wide">
                    <span>0:00</span>
                    <span>-:-</span>
                </div>
            </div>

            {/* Controls */}
            <div className="w-full px-8 mt-6 flex justify-between items-center shrink-0">
                <button className="active:scale-90 transition-transform"><Shuffle size={24} className="text-white/70" /></button>
                <button className="active:scale-90 transition-transform"><SkipBack size={36} className="text-white fill-current" /></button>
                <button className="w-[72px] h-[72px] bg-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                    {liveTrack.isPlaying 
                        ? <Pause size={32} className="text-black fill-current" /> 
                        : <Play size={32} className="text-black fill-current ml-1" />
                    }
                </button>
                <button className="active:scale-90 transition-transform"><SkipForward size={36} className="text-white fill-current" /></button>
                <button className="active:scale-90 transition-transform"><Repeat size={24} className="text-white/70" /></button>
            </div>

            {/* Up Next */}
            {upNextData.length > 0 && (
                <div className="w-full px-6 mt-10 flex-1 pb-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-white font-bold text-lg">Up Next</h2>
                        <ListMusic size={20} className="text-white/70" />
                    </div>
                    <div className="flex flex-col gap-4">
                        {upNextData.map((track, i) => (
                            <div key={i} className="flex items-center gap-3 w-full">
                                <img src={track.cover || track.albumArt} alt="" className="w-12 h-12 rounded object-cover shadow-sm" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-base font-bold truncate">{track.title}</p>
                                    <p className="text-[#b3b3b3] text-sm truncate">{track.artist}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpotifyMobile;
