import React, { useState } from 'react';
import { locations } from '#constants';
import { ChevronDown, ChevronRight } from 'lucide-react';

const ProjectsMobile = () => {
    const projects = locations.work.children;
    const [expandedId, setExpandedId] = useState(null);

    const toggleProject = (id) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    const handleFileClick = (file) => {
        if (['fig', 'url'].includes(file.fileType) && file.href) {
            window.open(file.href, "_blank");
        }
    };

    return (
        <div className="w-full h-full bg-[#121212] flex flex-col font-sans select-none overflow-y-auto custom-scrollbar pb-20 relative text-white">
            <div className="w-full pt-16 pb-4 px-6 sticky top-0 bg-[#121212]/90 backdrop-blur-md z-10 border-b border-white/10 shrink-0">
                <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            </div>

            <div className="flex flex-col px-4 py-6 gap-4">
                {projects.map((project) => (
                    <div key={project.id} className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 transition-all duration-300">
                        <div 
                            className="flex items-center justify-between p-4 cursor-pointer active:bg-white/10 transition-colors"
                            onClick={() => toggleProject(project.id)}
                        >
                            <div className="flex items-center gap-4">
                                <img src={project.icon} alt="folder" className="w-10 h-10 drop-shadow-md" />
                                <span className="font-semibold text-lg">{project.name}</span>
                            </div>
                            {expandedId === project.id ? <ChevronDown className="text-white/50" /> : <ChevronRight className="text-white/50" />}
                        </div>

                        {expandedId === project.id && (
                            <div className="p-4 pt-2 flex flex-col gap-3 bg-black/20 border-t border-white/5 animate-[popIn_0.2s_ease-out]">
                                {project.children?.map(file => (
                                    <div 
                                        key={file.id} 
                                        className="flex items-start gap-3 p-3 bg-white/5 rounded-xl active:bg-white/10 transition-colors"
                                        onClick={() => handleFileClick(file)}
                                    >
                                        <img src={file.icon} alt="file" className="w-8 h-8 shrink-0 mt-0.5 drop-shadow-sm" />
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-medium text-[15px] truncate">{file.name}</span>
                                            {file.description && (
                                                <div className="text-white/60 text-xs mt-1.5 space-y-1.5">
                                                    {file.description.map((desc, i) => <p key={i} className="leading-snug">{desc}</p>)}
                                                </div>
                                            )}
                                            {file.imageUrl && (
                                                <img src={file.imageUrl} alt={file.name} className="mt-3 rounded-lg w-full object-cover border border-white/10 shadow-sm" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectsMobile;
