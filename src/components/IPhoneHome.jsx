import React, { useState } from 'react';
import BootSequenceIOS from './BootSequenceIOS';
import SpotifyMobile from './SpotifyMobile';
import ProjectsMobile from './ProjectsMobile';
import ArticlesMobile from './ArticlesMobile';
import GalleryMobile from './GalleryMobile';
import ContactMobile from './ContactMobile';
import SteamMobile from './SteamMobile';
import AboutMobile from './AboutMobile';
import TerminalMobile from './TerminalMobile';

const AppIcon = ({ imgSrc, label, onClick, hideLabel = false }) => (
    <div className="flex flex-col items-center gap-1.5 cursor-pointer" onClick={onClick}>
        <img 
            src={imgSrc} 
            alt={label} 
            className="w-[60px] h-[60px] active:scale-95 transition-transform drop-shadow-md"
        />
        {!hideLabel && <span className="text-white text-[11px] font-medium drop-shadow-md truncate w-full text-center tracking-wide">{label}</span>}
    </div>
);

const IPhoneHome = () => {
    const [activeApp, setActiveApp] = useState(null);

    const renderActiveApp = () => {
        if (!activeApp) return null;
        
        let AppComponent = null;
        switch (activeApp) {
            case 'spotify':
                AppComponent = <SpotifyMobile />;
                break;
            case 'projects':
                AppComponent = <ProjectsMobile />;
                break;
            case 'articles':
                AppComponent = <ArticlesMobile />;
                break;
            case 'photos':
                AppComponent = <GalleryMobile />;
                break;
            case 'contact':
                AppComponent = <ContactMobile />;
                break;
            case 'steam':
                AppComponent = <SteamMobile />;
                break;
            case 'about':
                AppComponent = <AboutMobile />;
                break;
            case 'skills':
                AppComponent = <TerminalMobile />;
                break;
            default:
                AppComponent = (
                    <div className="flex-1 overflow-y-auto text-white flex flex-col items-center justify-center bg-black">
                        <h2 className="text-3xl font-bold capitalize mb-4">{activeApp} App</h2>
                        <p className="text-white/50 text-sm bg-white/10 px-4 py-2 rounded-full">Coming soon...</p>
                    </div>
                );
        }

        return (
            <div 
                className="absolute inset-0 z-50 bg-black flex flex-col transition-all duration-300 transform scale-100 opacity-100 origin-center"
                style={{ animation: 'popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
                {AppComponent}
                
                {/* Home Indicator is strictly ON TOP of the App */}
                <div className="absolute bottom-0 w-full h-8 flex justify-center items-end pb-2 bg-gradient-to-t from-black/80 to-transparent z-[999]">
                    <div 
                        className="w-1/3 h-1.5 bg-white/90 rounded-full cursor-pointer active:scale-95 transition-transform drop-shadow-lg"
                        onClick={() => setActiveApp(null)}
                        onTouchEnd={() => setActiveApp(null)}
                    ></div>
                </div>
            </div>
        );
    };

    return (
        <BootSequenceIOS>
            <div className="w-screen h-screen relative overflow-hidden font-sans bg-black select-none flex flex-col">
                <style>{`
                    @keyframes popIn {
                        from { opacity: 0; transform: scale(0.9); }
                        to { opacity: 1; transform: scale(1); }
                    }
                `}</style>
                {/* Wallpaper */}
                <div 
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')" }}
                />

                {/* Status Bar */}
                <div className="w-full h-12 flex items-center justify-between px-6 text-white text-xs font-bold pt-2 z-10 relative drop-shadow-md pointer-events-none">
                    <span>9:41</span>
                    <div className="flex gap-1.5 items-center">
                        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M15.5 14.5c0-2.8 2.2-5 5-5 .36 0 .71.04 1.05.11L23.64 7c-3.23-2.67-7.3-4-11.64-4C7.66 3 3.6 4.33.36 7l2.09 2.61c.34-.07.69-.11 1.05-.11 2.8 0 5 2.2 5 5 0 1.07-.35 2.06-.94 2.86l2.39 2.99c.35-.45.64-.95.87-1.48L12 20l1.05-1.31c.23.53.52 1.03.87 1.48l2.39-2.99c-.59-.8-.94-1.79-.94-2.86zM10.5 14.5c0-1.85 1.19-3.41 2.88-4.13l-1.38-1.72C10.63 9.49 9.38 10 8 10c-2.49 0-4.5-2.01-4.5-4.5 0-1.38.51-2.63 1.35-3.6l-1.38-1.72C1.72 2.37 0 4.96 0 8c0 3.87 3.13 7 7 7 .55 0 1.08-.06 1.6-.17l1.9 2.37v-2.7z"/></svg>
                        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 w-full px-5 pt-8 pb-[120px] z-10 relative overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-4 gap-x-2 gap-y-6 place-items-center">
                        <AppIcon imgSrc="/icons/info.svg" label="About" onClick={() => setActiveApp('about')} />
                        <AppIcon imgSrc="/images/finder.png" label="Projects" onClick={() => setActiveApp('projects')} />
                        <AppIcon imgSrc="/images/photos.png" label="Photos" onClick={() => setActiveApp('photos')} />
                        <AppIcon imgSrc="/images/safari.png" label="Articles" onClick={() => setActiveApp('articles')} />
                        <AppIcon imgSrc="/images/terminal.png" label="Skills" onClick={() => setActiveApp('skills')} />
                        <AppIcon imgSrc="/images/steam.png" label="Steam" onClick={() => setActiveApp('steam')} />
                        <AppIcon imgSrc="/images/spotify.png" label="Spotify" onClick={() => setActiveApp('spotify')} />
                    </div>
                </div>

                {/* Dock */}
                <div className="absolute bottom-6 left-[5%] right-[5%] w-[90%] h-[90px] rounded-[32px] bg-white/20 backdrop-blur-2xl border border-white/10 z-20 flex items-center justify-around px-2 shadow-xl">
                    <AppIcon hideLabel imgSrc="/images/finder.png" label="Projects" onClick={() => setActiveApp('projects')} />
                    <AppIcon hideLabel imgSrc="/images/spotify.png" label="Spotify" onClick={() => setActiveApp('spotify')} />
                    <AppIcon hideLabel imgSrc="/icons/info.svg" label="About" onClick={() => setActiveApp('about')} />
                    <AppIcon hideLabel imgSrc="/images/contact.png" label="Contact" onClick={() => setActiveApp('contact')} />
                </div>

                {renderActiveApp()}
            </div>
        </BootSequenceIOS>
    );
};

export default IPhoneHome;
