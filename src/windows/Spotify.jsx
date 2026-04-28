import React from 'react'
import WindowWrapper from '#hoc/WindowWrapper'
import WindowControls from '#components/WindowControls'

const Spotify = () => {
    return (
        <>
            <div id='window-header'>
                <WindowControls target="spotify" />
            </div>
            <div className="w-full h-full flex items-center justify-center bg-[#121212] text-white">
                <h1 className="text-2xl font-bold">Spotify</h1>
            </div>
        </>
    )
}

const SpotifyWindow = WindowWrapper(Spotify, "spotify")
export default SpotifyWindow