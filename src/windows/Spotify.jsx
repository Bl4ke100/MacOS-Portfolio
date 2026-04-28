import React, { useEffect, useState } from 'react';
import WindowWrapper from '#hoc/WindowWrapper';
import WindowControls from '#components/WindowControls';
import { Play, Pause, SkipBack, SkipForward, Music } from 'lucide-react';

const Spotify = () => {
    const [loading, setLoading] = useState(true);
    const [track, setTrack] = useState(null);

    useEffect(() => {
        const fetchSpotify = async () => {
            try {
                const response = await fetch('/.netlify/functions/spotify');
                const data = await response.json();

                if (data.isPlaying) {
                    setTrack(data);
                } else {
                    setTrack(null);
                }
                setLoading(false);
            } catch (error) {
                console.error("Failed to load Spotify widget", error);
                setLoading(false);
            }
        };

        fetchSpotify();
        const interval = setInterval(fetchSpotify, 15000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-[320px] h-[400px] flex flex-col bg-[#121212] rounded-xl overflow-hidden shadow-2xl border border-gray-800">
            <div id='window-header' className="flex items-center px-4 py-2 bg-[#181818] border-b border-[#282828]">
                <WindowControls target="spotify" />
                <p className="ml-4 text-xs font-bold text-gray-400 tracking-widest uppercase">Spotify</p>
            </div>

            <div className="flex-1 flex flex-col items-center p-6 bg-gradient-to-b from-[#282828] to-[#121212] text-white relative">
                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Music className="w-10 h-10 animate-pulse text-green-500" />
                    </div>
                ) : track ? (
                    <>
                        <a href={track.songUrl} target="_blank" rel="noreferrer" className="w-48 h-48 mb-6 shadow-2xl rounded-md overflow-hidden group">
                            <img
                                src={track.albumArt}
                                alt={track.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </a>
                        <div className="w-full text-center mb-6">
                            <h3 className="text-xl font-bold truncate text-white">{track.title}</h3>
                            <p className="text-sm text-gray-400 truncate">{track.artist}</p>
                        </div>
                        <div className="flex items-center gap-6 mt-auto">
                            <SkipBack className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
                            <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full hover:scale-105 transition-transform cursor-pointer text-black">
                                {track.isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-1 fill-current" />}
                            </div>
                            <SkipForward className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
                        </div>
                        {track.isPlaying && (
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
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <Music className="w-12 h-12 text-gray-600 mb-4" />
                        <p className="text-gray-400 text-sm">Not playing anything right now.</p>
                        <p className="text-gray-600 text-xs mt-2">Check back later!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

const SpotifyWindow = WindowWrapper(Spotify, "spotify");
export default SpotifyWindow;