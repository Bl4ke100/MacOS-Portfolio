const STEAM_KEY = process.env.STEAM_API_KEY;
const STEAM_ID = process.env.STEAM_ID;

exports.handler = async () => {
    try {
        const [profileRes, gamesRes, recentRes, levelRes] = await Promise.all([
            fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_KEY}&steamids=${STEAM_ID}`),
            fetch(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_KEY}&steamid=${STEAM_ID}&include_appinfo=1&format=json`),
            fetch(`http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${STEAM_KEY}&steamid=${STEAM_ID}&format=json`),
            fetch(`http://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${STEAM_KEY}&steamid=${STEAM_ID}`)
        ]);

        const profileData = await profileRes.json();
        const gamesData = await gamesRes.json();
        const recentData = await recentRes.json();
        const levelData = await levelRes.json();

        const user = profileData.response.players[0];
        const allGames = gamesData.response.games || [];

        const stats = {
            personaname: user.personaname,
            avatar: user.avatarfull,
            status: user.personastate === 1 ? 'Online' : 'Offline',
            current_game: user.gameextrainfo || null,
            level: levelData.response.player_level || 0,
            total_games: gamesData.response.game_count,
            total_playtime: Math.round(allGames.reduce((acc, g) => acc + g.playtime_forever, 0) / 60),
            most_played: allGames.sort((a, b) => b.playtime_forever - a.playtime_forever).slice(0, 4).map(g => ({
                name: g.name,
                playtime: Math.round(g.playtime_forever / 60),
                // Grabs the horizontal store banner
                banner: `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${g.appid}/header.jpg`
            })),
            recent: (recentData.response.games || []).slice(0, 3).map(g => ({
                name: g.name,
                playtime_2weeks: Math.round(g.playtime_2weeks / 60),
                // Grabs the vertical library box art
                capsule: `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${g.appid}/library_600x900.jpg`
            }))
        };

        return { statusCode: 200, body: JSON.stringify(stats) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};