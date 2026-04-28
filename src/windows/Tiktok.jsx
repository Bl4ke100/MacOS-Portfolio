import React from 'react'
import WindowWrapper from '#hoc/WindowWrapper'
import WindowControls from '#components/WindowControls'

const Tiktok = () => {
    return (
        <>
            <div id='window-header'>
                <WindowControls target="tiktok" />
            </div>
            <div className="w-full h-full flex items-center justify-center bg-[#000000] text-white">
                <h1 className="text-2xl font-bold">TikTok</h1>
            </div>
        </>
    )
}

const TiktokWindow = WindowWrapper(Tiktok, "tiktok")
export default TiktokWindow
