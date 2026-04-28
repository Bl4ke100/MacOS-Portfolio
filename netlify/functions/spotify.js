const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

exports.handler = async (event, context) => {
    try {
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

        const response = await fetch(NOW_PLAYING_ENDPOINT, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (response.status === 204 || response.status > 400) {
            return { statusCode: 200, body: JSON.stringify({ isPlaying: false }) };
        }

        const song = await response.json();

        if (song.item) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    isPlaying: song.is_playing,
                    title: song.item.name,
                    artist: song.item.artists.map((_artist) => _artist.name).join(', '),
                    albumArt: song.item.album.images[0].url,
                    songUrl: song.item.external_urls.spotify,
                }),
            };
        }

        return { statusCode: 200, body: JSON.stringify({ isPlaying: false }) };
        
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch Spotify' }) };
    }
};