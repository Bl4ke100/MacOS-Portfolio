import React, { useState, useEffect } from 'react';
import { Flashlight, Camera } from 'lucide-react';

const BootSequenceIOS = ({ children }) => {
    const [stage, setStage] = useState('boot'); // boot, lock, unlocking, home
    const [progress, setProgress] = useState(0);
    
    const [startY, setStartY] = useState(null);
    const [currentY, setCurrentY] = useState(0);

    useEffect(() => {
        if (stage !== 'boot') return;
        const t1 = setTimeout(() => setProgress(100), 100);
        const t2 = setTimeout(() => {
            setStage('lock');
        }, 2000);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [stage]);

    useEffect(() => {
        if (stage === 'unlocking') {
            const t = setTimeout(() => setStage('home'), 600);
            return () => clearTimeout(t);
        }
    }, [stage]);

    const handleStart = (y) => {
        if (stage !== 'lock') return;
        setStartY(y);
    };

    const handleMove = (y) => {
        if (stage !== 'lock' || startY === null) return;
        const delta = y - startY;
        if (delta < 0) { // Only allow swipe up
            setCurrentY(delta);
        }
    };

    const handleEnd = () => {
        if (stage !== 'lock') return;
        if (currentY < -100) {
            setStage('unlocking');
        } else {
            setCurrentY(0);
        }
        setStartY(null);
    };

    const [now, setNow] = useState(new Date());
    useEffect(() => {
        if (stage !== 'lock' && stage !== 'unlocking') return;
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, [stage]);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    if (stage === 'home') return children;

    return (
        <div 
            className="bg-black relative overflow-hidden font-sans select-none"
            style={{ width: '100dvw', height: '100dvh' }}
            onTouchStart={(e) => handleStart(e.touches[0].clientY)}
            onTouchMove={(e) => handleMove(e.touches[0].clientY)}
            onTouchEnd={handleEnd}
            onMouseDown={(e) => handleStart(e.clientY)}
            onMouseMove={(e) => handleMove(e.clientY)}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
        >
            {(stage === 'lock' || stage === 'unlocking') && (
                <div className="absolute inset-0 z-0">
                    {children}
                </div>
            )}

            <div 
                className="absolute inset-0 z-50 flex flex-col justify-between"
                style={{
                    transform: stage === 'unlocking' ? 'translateY(-100dvh)' : `translateY(${currentY}px)`,
                    transition: stage === 'unlocking' ? 'transform 0.6s cubic-bezier(0.32, 0.72, 0, 1)' : (startY === null ? 'transform 0.3s ease' : 'none'),
                }}
            >
                <div 
                    className="absolute inset-0 bg-cover bg-center z-[-1]"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')",
                        opacity: stage === 'boot' ? 0 : 1,
                        transition: 'opacity 0.8s ease'
                    }}
                />

                {stage === 'boot' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10">
                        <svg viewBox="0 0 384 512" className="w-16 h-16 fill-white mb-10 shadow-lg">
                            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                        </svg>
                        <div className="fixed bottom-[15%] w-32 h-1 bg-white/20 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-white rounded-full transition-all duration-[1.8s] ease-in-out" 
                                style={{ width: `${progress}%` }} 
                            />
                        </div>
                    </div>
                )}

                {(stage === 'lock' || stage === 'unlocking') && (
                    <>
                        <div className="w-full pt-16 flex flex-col items-center">
                            <div className="flex items-center gap-2 text-white/90 font-medium text-lg mb-1 drop-shadow-md">
                                <span className="text-xl">🔒</span>
                            </div>
                            <h1 className="text-[80px] font-medium text-white leading-none tracking-tight drop-shadow-lg mb-1" style={{fontFamily: "system-ui, -apple-system, sans-serif"}}>
                                {now.getHours() % 12 || 12}:{now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()}
                            </h1>
                            <p className="text-white text-xl font-medium tracking-wide drop-shadow-md">
                                {days[now.getDay()]}, {months[now.getMonth()]} {now.getDate()}
                            </p>
                        </div>

                        <div className="w-full pb-8 px-10 flex flex-col items-center">
                            <div className="w-full flex justify-between mb-8">
                                <button className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl flex items-center justify-center border border-white/10 active:bg-white/40 transition-colors">
                                    <Flashlight size={22} className="text-white" />
                                </button>
                                <button className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl flex items-center justify-center border border-white/10 active:bg-white/40 transition-colors">
                                    <Camera size={22} className="text-white" />
                                </button>
                            </div>
                            
                            <div className="flex flex-col items-center animate-bounce duration-1000">
                                <p className="text-white/90 text-sm font-medium tracking-wide">Swipe up to open</p>
                            </div>
                            <div className="w-1/3 h-1.5 bg-white rounded-full mt-4"></div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default BootSequenceIOS;
