import React from 'react';
import { socials } from '#constants';
import { ExternalLink } from 'lucide-react';

const ContactMobile = () => {
    return (
        <div className="w-full h-full bg-[#121212] flex flex-col font-sans select-none overflow-y-auto custom-scrollbar pb-20 relative text-white">
            <div className="w-full pt-20 pb-6 px-6 shrink-0 z-10 flex flex-col items-center">
                <img src="/images/me.png" alt="Blake" className="w-[120px] h-[120px] rounded-full border-4 border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] mb-6 object-cover" />
                <h1 className="text-[32px] font-bold tracking-tight mb-3">Let's Connect</h1>
                <p className="text-white/60 text-center px-6 text-[15px] leading-relaxed font-medium">
                    Got an idea? A bug to squash? Or just wanna talk tech? I'm in!
                </p>
            </div>

            <div className="flex flex-col px-6 py-4 gap-4 mt-2">
                {socials.map(({ id, bg, link, icon, text }) => (
                    <a 
                        key={id} 
                        href={link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full rounded-[20px] p-4 flex items-center gap-4 active:scale-[0.97] transition-transform shadow-lg"
                        style={{ backgroundColor: bg }}
                    >
                        <div className="bg-black/20 p-2.5 rounded-[14px] shrink-0">
                            <img src={icon} alt={text} className="w-7 h-7 object-contain drop-shadow-md" />
                        </div>
                        <span className="font-bold text-[17px] text-white drop-shadow-sm flex-1">{text}</span>
                        <div className="bg-black/10 p-2 rounded-full">
                            <ExternalLink size={18} className="text-white" />
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default ContactMobile;
