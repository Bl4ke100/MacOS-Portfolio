import React, { useState } from 'react';
import { RotateCw, Plus, ChevronLeft, ChevronRight, Copy, Share } from 'lucide-react';

const ArticlesMobile = () => {
    const defaultHome = "https://www.google.com/webhp?igu=1";
    const [url, setUrl] = useState("");
    const [iframeSrc, setIframeSrc] = useState(defaultHome);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const input = url.trim();
            if (!input) return;

            const isWebsite = input.includes('.') && !input.includes(' ');

            if (isWebsite) {
                let formattedUrl = input;
                if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
                    formattedUrl = `https://${formattedUrl}`;
                }
                setIframeSrc(formattedUrl);
                setUrl(formattedUrl);
            } else {
                const searchUrl = `https://www.google.com/search?igu=1&q=${encodeURIComponent(input)}`;
                setIframeSrc(searchUrl);
            }
        }
    };

    return (
        <div className="w-full h-full bg-[#f2f2f6] flex flex-col font-sans select-none overflow-hidden relative pb-[80px]">
            <div className="w-full pt-14 pb-3 px-4 bg-white/95 backdrop-blur-xl border-b border-gray-200 shrink-0 z-10 flex flex-col gap-3 shadow-sm">
                <div className="w-full flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-gray-500 tracking-wider uppercase">Safari</span>
                    <Plus size={22} className="text-blue-500 cursor-pointer active:opacity-50 transition-opacity" onClick={() => { setIframeSrc(defaultHome); setUrl(""); }} />
                </div>
                
                <div className="flex items-center bg-gray-200/80 rounded-xl px-3 py-2.5 border border-gray-300">
                    <span className="text-gray-500 mr-2.5 text-[17px] leading-none select-none tracking-tighter">AA</span>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search or enter website name"
                        className="flex-1 bg-transparent outline-none text-[16px] text-black placeholder:text-gray-500 font-medium"
                    />
                    <RotateCw size={18} className="text-gray-500 ml-2 active:animate-spin" />
                </div>
            </div>

            <div className="flex-1 bg-white relative w-full overflow-hidden">
                <iframe
                    src={iframeSrc}
                    title="Safari Browser"
                    className="w-full h-full border-none absolute inset-0 bg-white"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
            </div>

            <div className="w-full h-[60px] pb-5 pt-2 bg-[#f8f8f8]/95 backdrop-blur-xl border-t border-gray-200 flex items-center justify-between px-6 text-blue-500 shrink-0 z-10 absolute bottom-[32px] shadow-[0_-5px_15px_rgba(0,0,0,0.03)]">
                <ChevronLeft size={28} className="active:opacity-50 cursor-pointer" />
                <ChevronRight size={28} className="text-gray-300" />
                <Share size={24} className="active:opacity-50 cursor-pointer" />
                <Copy size={22} className="active:opacity-50 cursor-pointer" />
                <div className="w-6 h-6 border-2 border-blue-500 rounded flex items-center justify-center font-bold text-[12px] active:opacity-50 cursor-pointer">1</div>
            </div>
        </div>
    );
};

export default ArticlesMobile;
