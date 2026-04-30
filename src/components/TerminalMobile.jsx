import React from 'react';
import { techStack } from '#constants';
import { Check, Terminal as TerminalIcon } from 'lucide-react';

const TerminalMobile = () => {
    return (
        <div className="w-full h-full bg-[#121212] flex flex-col font-sans select-none overflow-y-auto custom-scrollbar pb-24 relative text-[#d1d5db] font-mono">
            {/* Terminal Header */}
            <div className="w-full pt-16 pb-4 px-6 sticky top-0 bg-[#121212]/95 backdrop-blur-md z-10 border-b border-white/5 shrink-0 flex items-center gap-3">
                <TerminalIcon size={24} className="text-[#00A154]" />
                <h1 className="text-xl font-bold tracking-tight text-white">Tech Stack</h1>
            </div>

            <div className="flex flex-col px-6 py-6 text-[13px] leading-relaxed">
                <div className="mb-6 flex gap-2">
                    <span className="font-bold text-white">@Blake %</span>
                    <span className="text-[#00A154]">show tech stack</span>
                </div>

                <div className="space-y-6 border-l-2 border-white/10 pl-4 py-2">
                    {techStack.map(({ category, items }) => (
                        <div key={category} className="flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                                <Check size={16} className="text-[#00A154] shrink-0" />
                                <h3 className="font-bold text-white text-[15px]">{category}</h3>
                            </div>
                            <div className="flex flex-wrap gap-2 pl-6">
                                {items.map((item, i) => (
                                    <span key={i} className="bg-white/5 border border-white/10 rounded px-2 py-0.5 text-[#9ca3af]">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-4 border-t border-dashed border-white/20 text-[#00A154] space-y-1">
                    <p className="flex items-center gap-2">
                        <Check size={16} /> 8 of 8 categories loaded successfully
                    </p>
                    <p className="flex items-center gap-2 text-white/50">
                        <span className="text-xs">▶</span> Render time: 12ms
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TerminalMobile;
