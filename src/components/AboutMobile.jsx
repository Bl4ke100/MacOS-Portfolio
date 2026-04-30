import React from 'react';
import { locations } from '#constants';

const AboutMobile = () => {
    const data = locations.about.children.find(c => c.name === 'about-me.txt');

    return (
        <div className="w-full h-full bg-[#121212] flex flex-col font-sans select-none overflow-y-auto custom-scrollbar pb-24 relative text-white">
            <div className="w-full h-[45vh] relative shrink-0">
                <img src="/images/casual-me.png" alt="Casual me" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent"></div>
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            <div className="px-6 -mt-20 relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full border-4 border-[#121212] overflow-hidden mb-4 shadow-xl">
                    <img src="/images/me2.png" alt="Blake" className="w-full h-full object-cover" />
                </div>
                <h1 className="text-[34px] font-black tracking-tight leading-tight mb-6 text-white drop-shadow-md">
                    Hey, I'm Blake 👋
                </h1>
                
                <div className="space-y-4 text-left w-full">
                    {data.description.map((desc, i) => (
                        <p key={i} className="text-[16px] text-white/80 leading-relaxed font-medium">
                            {desc}
                        </p>
                    ))}
                </div>

                {data.image && (
                    <div className="mt-8 w-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                        <img src={data.image} alt="Hello" className="w-full h-auto object-cover" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AboutMobile;
