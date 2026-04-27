import React from 'react'
import useWindowStore from '#store/window.js'

const WindowControls = ({ target }) => {
    const { closeWindow } = useWindowStore();
    
    return (
        <div className="flex items-center gap-2">
            <button 
                className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-red-600 transition-colors" 
                onClick={() => closeWindow(target)} 
                aria-label="Close"
            />
            <button 
                className="w-3 h-3 rounded-full bg-[#ffbd2e]" 
                aria-label="Minimize"
            />
            <button 
                className="w-3 h-3 rounded-full bg-[#27c93f]" 
                aria-label="Maximize"
            />
        </div>
    )
}

export default WindowControls