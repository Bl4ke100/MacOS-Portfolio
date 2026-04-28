const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

exports.handler = async () => {
    try {
        const tokenResponse = await fetch(TOKEN_ENDPOINT, {
            method: 'POST',
            headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token }),
        });
        const { access_token } = await tokenResponse.json();

        // Helper to fetch and handle errors gracefully
        const safeFetch = async (url) => {
            const res = await fetch(url, { headers: { Authorization: `Bearer ${access_token}` } });
            return res.ok ? await res.json() : { items: [] };
        };

        const [tracksData, artistsData, recentData] = await Promise.all([
            safeFetch(`https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5`),
            safeFetch(`https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=5`),
            safeFetch(`https://api.spotify.com/v1/me/player/recently-played?limit=4`)
        ]);

        const recentlyPlayed = (recentData.items || []).map(item => ({
            title: item.track.name,
            artist: item.track.artists[0].name,
            // Grab the best available track image (often 64x64 or 300x300)
            cover: item.track.album.images?.[2]?.url || item.track.album.images?.[0]?.url
        }));

        const tracks = (tracksData.items || []).map(track => ({
            title: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            url: track.external_urls.spotify,
            cover: track.album.images?.[1]?.url || track.album.images?.[0]?.url
        }));

        const artists = (artistsData.items || []).map(artist => {
            // Find the best image for circular crop (closest to 160px is best)
            const bestImage = artist.images?.reduce((best, current) => {
                const target = 160;
                if (!best || Math.abs(current.width - target) < Math.abs(best.width - target)) {
                    return current;
                }
                return best;
            }, null);

            return {
                name: artist.name,
                url: artist.external_urls.spotify,
                image: bestImage?.url || ''
            };
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ tracks, artists, recentlyPlayed }),
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};