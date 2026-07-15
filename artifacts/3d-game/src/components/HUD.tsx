import { useState, useEffect } from 'react';
import { gameEvents } from '../gameState';

export function HUD() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const onBloom = () => setCount(c => c + 1);
        gameEvents.addEventListener('bloom', onBloom);
        return () => gameEvents.removeEventListener('bloom', onBloom);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex flex-col justify-between p-8 z-10">
            <div className="text-center w-full mt-4">
                <h1 className="text-4xl text-white tracking-widest opacity-90 font-sans" style={{ textShadow: '0 0 15px rgba(255,255,255,0.6)' }}>
                    Crystal Bloom Garden
                </h1>
            </div>

            <div className="flex justify-between items-end w-full">
                <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-white font-sans text-xl shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    ✦ {count} flowers bloomed
                </div>
                
                <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-white/80 font-mono text-sm uppercase tracking-widest">
                    WASD / ↑↓←→ to walk
                </div>
            </div>
        </div>
    );
}
