const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks?limit=5`;
const TOP_ARTISTS_ENDPOINT = `https://api.spotify.com/v1/me/top/artists?limit=8`;
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=4`;
const PLAYLISTS_ENDPOINT = `https://api.spotify.com/v1/me/playlists?limit=4`;

exports.handler = async () => {
    try {
        const tokenResponse = await fetch(TOKEN_ENDPOINT, {
            method: 'POST',
            headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token }),
        });
        const { access_token } = await tokenResponse.json();

        const [tracksRes, artistsRes, recentRes, playlistRes] = await Promise.all([
            fetch(TOP_TRACKS_ENDPOINT, { headers: { Authorization: `Bearer ${access_token}` } }),
            fetch(TOP_ARTISTS_ENDPOINT, { headers: { Authorization: `Bearer ${access_token}` } }),
            fetch(RECENTLY_PLAYED_ENDPOINT, { headers: { Authorization: `Bearer ${access_token}` } }),
            fetch(PLAYLISTS_ENDPOINT, { headers: { Authorization: `Bearer ${access_token}` } })
        ]);

        const tracksData = await tracksRes.json();
        const artistsData = await artistsRes.json();
        const recentData = await recentRes.json();
        const playlistData = await playlistRes.json();

        // Map Recently Played
        const recentlyPlayed = (recentData.items || []).map(item => ({
            title: item.track.name,
            artist: item.track.artists[0].name,
            cover: item.track.album.images[2].url
        }));

        // Map Playlists
        const playlists = (playlistData.items || []).map(p => ({
            name: p.name,
            url: p.external_urls.spotify,
            cover: p.images[0]?.url,
            tracks: p.tracks.total
        }));

        const tracks = (tracksData.items || []).map(track => ({
            title: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            url: track.external_urls.spotify,
            cover: track.album.images[2].url
        }));

        let allGenres = [];
        const artists = (artistsData.items || []).map(artist => {
            allGenres.push(...artist.genres);
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
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch stats' }) };
    }
};