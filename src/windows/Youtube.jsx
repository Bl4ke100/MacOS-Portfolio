import React from 'react'
import WindowWrapper from '#hoc/WindowWrapper'
import WindowControls from '#components/WindowControls'

const Youtube = () => {
    return (
        <>
            <div id='window-header'>
                <WindowControls target="youtube" />
            </div>
            <div className="w-full h-full flex items-center justify-center bg-[#0F0F0F] text-white">
                <h1 className="text-2xl font-bold">YouTube</h1>
            </div>
        </>
    )
}

const YoutubeWindow = WindowWrapper(Youtube, "youtube")
export default YoutubeWindow
