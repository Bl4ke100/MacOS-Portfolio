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
        const recentGamesList = recentData.response.games || [];

        const currentUnix = Math.floor(Date.now() / 1000);
        const accountAgeYears = user.timecreated ? ((currentUnix - user.timecreated) / 31556926).toFixed(1) : 'Secret';

        const totalMinutes = allGames.reduce((acc, g) => acc + g.playtime_forever, 0);
        const totalPlaytimeHours = Math.round(totalMinutes / 60);
        const avgPlaytimeHours = allGames.length > 0 ? Math.round(totalPlaytimeHours / allGames.length) : 0;

        let recentAchievements = [];
        if (recentGamesList.length > 0) {
            const topGameId = recentGamesList[0].appid;
            const topGameName = recentGamesList[0].name;
            try {
                const [achRes, schemaRes] = await Promise.all([
                    fetch(`http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${topGameId}&key=${STEAM_KEY}&steamid=${STEAM_ID}`),
                    fetch(`http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${STEAM_KEY}&appid=${topGameId}`)
                ]);
                const achData = await achRes.json();
                const schemaData = await schemaRes.json();

                if (achData.playerstats?.success && schemaData.game?.availableGameStats?.achievements) {
                    const unlocked = achData.playerstats.achievements.filter(a => a.achieved === 1);
                    unlocked.sort((a, b) => b.unlocktime - a.unlocktime);
                    const schemaAch = schemaData.game.availableGameStats.achievements;
                    recentAchievements = unlocked.slice(0, 4).map(u => {
                        const details = schemaAch.find(s => s.name === u.apiname);
                        return {
                            name: details?.displayName || u.apiname,
                            description: details?.hidden === 1 ? "Hidden Achievement" : details?.description || "Unlocked",
                            icon: details?.icon,
                            gameName: topGameName
                        };
                    });
                }
            } catch (e) { console.log("Achievements skipped"); }
        }

        const stats = {
            personaname: user.personaname,
            avatar: user.avatarfull,
            status: user.personastate === 1 ? 'Online' : 'Offline',
            current_game: user.gameextrainfo || null,
            level: levelData.response.player_level || 0,
            account_age: accountAgeYears,
            total_games: gamesData.response.game_count,
            total_playtime: totalPlaytimeHours,
            avg_playtime: avgPlaytimeHours,
            estimated_value: (gamesData.response.game_count * 12.5).toLocaleString(),
            recent: recentGamesList.slice(0, 4).map(g => ({
                name: g.name,
                playtime: (g.playtime_2weeks / 60).toFixed(1),
                label: 'hrs past 2 weeks',
                capsule: `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${g.appid}/library_600x900.jpg`
            })),
            library: allGames.sort((a, b) => b.playtime_forever - a.playtime_forever).slice(0, 48).map(g => ({
                name: g.name,
                playtime: Math.round(g.playtime_forever / 60),
                label: 'hrs total',
                capsule: `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${g.appid}/library_600x900.jpg`
            })),
            achievements: recentAchievements
        };

        return { statusCode: 200, body: JSON.stringify(stats) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};