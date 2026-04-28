const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5`;
const TOP_ARTISTS_ENDPOINT = `https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=5`;

exports.handler = async () => {
    try {
        const tokenResponse = await fetch(TOKEN_ENDPOINT, {
            method: 'POST',
            headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token }),
        });
        const { access_token } = await tokenResponse.json();

        if (!access_token) throw new Error("Failed to get access token");

        const [tracksRes, artistsRes] = await Promise.all([
            fetch(TOP_TRACKS_ENDPOINT, { headers: { Authorization: `Bearer ${access_token}` } }),
            fetch(TOP_ARTISTS_ENDPOINT, { headers: { Authorization: `Bearer ${access_token}` } })
        ]);

        const tracksData = await tracksRes.json();
        const artistsData = await artistsRes.json();

        // Safely map the data in case the arrays are empty
        const tracks = (tracksData.items || []).map(track => ({
            title: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            url: track.external_urls.spotify,
            cover: track.album?.images?.[2]?.url || track.album?.images?.[0]?.url || ''
        }));

        let allGenres = [];
        const artists = (artistsData.items || []).map(artist => {
            allGenres.push(...(artist.genres || []));
            return {
                name: artist.name,
                url: artist.external_urls.spotify,
                image: artist.images?.[2]?.url || artist.images?.[0]?.url || ''
            };
        });

        const genreCounts = allGenres.reduce((acc, genre) => {
            acc[genre] = (acc[genre] || 0) + 1;
            return acc;
        }, {});
        const topGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(g => g[0]);

        return {
            statusCode: 200,
            body: JSON.stringify({ tracks, artists, topGenres }),
        };
    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch stats' }) };
    }
};