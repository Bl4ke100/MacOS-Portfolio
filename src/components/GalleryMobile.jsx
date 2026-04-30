import React, { useState } from 'react';
import { gallery, photosLinks } from '#constants';
import { ChevronLeft } from 'lucide-react';

const GalleryMobile = () => {
    const [selectedImg, setSelectedImg] = useState(null);
    const [activeTab, setActiveTab] = useState('Library');

    return (
        <div className="w-full h-full bg-[#121212] flex flex-col font-sans select-none overflow-hidden relative text-white">
            {!selectedImg ? (
                <>
                    {/* Header */}
                    <div className="w-full pt-16 pb-4 px-6 bg-[#121212]/90 backdrop-blur-md z-10 shrink-0 border-b border-white/10 flex justify-between items-end">
                        <h1 className="text-3xl font-bold tracking-tight">Photos</h1>
                        <span className="text-blue-500 font-medium text-[17px] tracking-wide cursor-pointer active:opacity-50">Select</span>
                    </div>

                    {/* Horizontal Scroll Tabs (simulating categories) */}
                    <div className="w-full px-4 py-3 flex gap-4 overflow-x-auto custom-scrollbar shrink-0 border-b border-white/5">
                        {photosLinks.map((link) => (
                            <div 
                                key={link.id} 
                                onClick={() => setActiveTab(link.title)}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer ${activeTab === link.title ? 'bg-white/20 text-white' : 'bg-transparent text-white/50'}`}
                            >
                                <img src={link.icon} alt={link.title} className="w-4 h-4 opacity-80" />
                                <span className="font-semibold text-[15px]">{link.title}</span>
                            </div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar pb-24">
                        <div className="grid grid-cols-3 gap-[2px] w-full">
                            {gallery.map(({ id, img }) => (
                                <div 
                                    key={id} 
                                    className="aspect-square cursor-pointer overflow-hidden bg-white/10 active:opacity-70 transition-opacity"
                                    onClick={() => setSelectedImg(img)}
                                >
                                    <img src={img} alt={`Gallery ${id}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                /* Full Screen Lightbox */
                <div className="absolute inset-0 z-50 bg-black flex flex-col animate-[fadeIn_0.2s_ease-out]">
                    <div className="w-full pt-14 pb-4 px-2 flex items-center justify-between z-10 bg-gradient-to-b from-black/60 to-transparent absolute top-0 pointer-events-none">
                        <div 
                            className="flex items-center text-white active:opacity-50 cursor-pointer pointer-events-auto"
                            onClick={() => setSelectedImg(null)}
                        >
                            <ChevronLeft size={36} />
                            <span className="text-[17px] font-medium -ml-1.5">Photos</span>
                        </div>
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center relative">
                        <img 
                            src={selectedImg} 
                            alt="Selected" 
                            className="w-full h-auto max-h-full object-contain animate-[scaleIn_0.3s_cubic-bezier(0.16,1,0.3,1)]" 
                        />
                    </div>
                </div>
            )}
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>
        </div>
    );
};

export default GalleryMobile;
