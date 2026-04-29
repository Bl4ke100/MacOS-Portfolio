const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

// THE REAL SPOTIFY ENDPOINTS
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const QUEUE_ENDPOINT = `https://api.spotify.com/v1/me/player/queue`;

exports.handler = async (event, context) => {
    try {
        // 1. Get Access Token
        const tokenResponse = await fetch(TOKEN_ENDPOINT, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${basic}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token,
            }),
        });
        const { access_token } = await tokenResponse.json();

        // 2. Fetch Currently Playing Song
        const response = await fetch(NOW_PLAYING_ENDPOINT, {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        if (response.status === 204 || response.status > 400) {
            return { statusCode: 200, body: JSON.stringify({ isPlaying: false }) };
        }

        const song = await response.json();

        if (song.item) {
            const artistId = song.item.artists && song.item.artists[0] ? song.item.artists[0].id : null;
            let artistData = null;
            let upNextQueue = [];

            // 3. Grab Artist Data (REAL URL)
            if (artistId) {
                try {
                    const artistResponse = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
                        headers: { Authorization: `Bearer ${access_token}` },
                    });
                    if (artistResponse.ok) {
                        artistData = await artistResponse.json();
                    }
                } catch (e) { console.error("Artist fetch failed", e); }
            }

            // 4. Grab the Real Queue (REAL URL)
            try {
                const queueResponse = await fetch(QUEUE_ENDPOINT, {
                    headers: { Authorization: `Bearer ${access_token}` },
                });
                if (queueResponse.ok) {
                    const queueData = await queueResponse.json();
                    if (queueData && queueData.queue) {
                        upNextQueue = queueData.queue.slice(0, 2).map(track => ({
                            title: track.name,
                            artist: track.artists.map(a => a.name).join(', '),
                            cover: track.album.images[0]?.url
                        }));
                    }
                }
            } catch (e) { console.error("Queue fetch failed", e); }

            // 5. Send it all back
            return {
                statusCode: 200,
                body: JSON.stringify({
                    isPlaying: song.is_playing,
                    title: song.item.name,
                    artist: song.item.artists.map((_artist) => _artist.name).join(', '),
                    albumArt: song.item.album.images[0].url,
                    songUrl: song.item.external_urls.spotify,
                    artistImage: artistData?.images?.[0]?.url || song.item.album.images[0].url,
                    followers: artistData?.followers?.total || null,
                    genres: artistData?.genres || [],
                    upNext: upNextQueue
                }),
            };
        }

        return { statusCode: 200, body: JSON.stringify({ isPlaying: false }) };

    } catch (error) {
        console.error("Spotify Fetch Error:", error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch Spotify' }) };
    }
};