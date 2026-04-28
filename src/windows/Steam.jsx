import React from 'react'
import WindowWrapper from '#hoc/WindowWrapper'
import WindowControls from '#components/WindowControls'

const Steam = () => {
    return (
        <>
            <div id='window-header'>
                <WindowControls target="steam" />
            </div>
            <div className="w-full h-full flex items-center justify-center bg-[#171A21] text-white">
                <h1 className="text-2xl font-bold">Steam</h1>
            </div>
        </>
    )
}

const SteamWindow = WindowWrapper(Steam, "steam")
export default SteamWindow
