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

        const [tracksData, artistsData, recentData, playlistData] = await Promise.all([
            safeFetch(`https://api.spotify.com/v1/me/top/tracks?limit=5`),
            safeFetch(`https://api.spotify.com/v1/me/top/artists?limit=8`),
            safeFetch(`https://api.spotify.com/v1/me/player/recently-played?limit=4`),
            safeFetch(`https://api.spotify.com/v1/me/playlists?limit=4`)
        ]);

        const recentlyPlayed = (recentData.items || []).slice(0, 4).map(item => ({
            title: item.track.name,
            artist: item.track.artists[0].name,
            cover: item.track.album.images[2]?.url
        }));

        const playlists = (playlistData.items || []).slice(0, 2).map(p => ({
            name: p.name,
            url: p.external_urls.spotify,
            cover: p.images[0]?.url,
            tracks: p.tracks.total
        }));

        const tracks = (tracksData.items || []).slice(0, 5).map(track => ({
            title: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            url: track.external_urls.spotify,
            cover: track.album.images[2]?.url
        }));

        let allGenres = [];
        const artists = (artistsData.items || []).slice(0, 5).map(artist => {
            allGenres.push(...(artist.genres || []));
            return {
                name: artist.name,
                image: artist.images[2]?.url || artist.images[0]?.url
            };
        });

        const genreCounts = allGenres.reduce((acc, genre) => {
            acc[genre] = (acc[genre] || 0) + 1;
            return acc;
        }, {});
        const topGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(g => g[0]);

        return {
            statusCode: 200,
            body: JSON.stringify({ tracks, artists, topGenres, recentlyPlayed, playlists }),
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};