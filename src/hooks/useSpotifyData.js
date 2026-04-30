import { useState, useEffect } from 'react';

const useSpotifyData = () => {
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

    return { liveTrack, stats, loading };
};

export default useSpotifyData;
