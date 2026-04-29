const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;

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
            // 3. Grab the main artist's ID from the song data
            const artistId = song.item.artists && song.item.artists[0] ? song.item.artists[0].id : null;
            let artistData = null;

            // 4. Make a second quick fetch to get their actual profile details
            if (artistId) {
                try {
                    const artistResponse = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
                        headers: { Authorization: `Bearer ${access_token}` },
                    });
                    if (artistResponse.ok) {
                        artistData = await artistResponse.json();
                    }
                } catch (artistError) {
                    console.error("Failed to fetch deeper artist data", artistError);
                }
            }

            // 5. Return everything mapped out cleanly to your frontend
            return {
                statusCode: 200,
                body: JSON.stringify({
                    isPlaying: song.is_playing,
                    title: song.item.name,
                    artist: song.item.artists.map((_artist) => _artist.name).join(', '),
                    albumArt: song.item.album.images[0].url,
                    songUrl: song.item.external_urls.spotify,

                    // The new real data (with safe fallbacks)
                    artistImage: artistData?.images?.[0]?.url || song.item.album.images[0].url,
                    followers: artistData?.followers?.total || null,
                    genres: artistData?.genres || []
                }),
            };
        }

        return { statusCode: 200, body: JSON.stringify({ isPlaying: false }) };

    } catch (error) {
        console.error("Spotify Fetch Error:", error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch Spotify' }) };
    }
};