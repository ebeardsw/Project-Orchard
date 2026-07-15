import { useState, useEffect } from 'react';
import { gameEvents } from '../gameState';
import { Joystick } from './Joystick';

export function HUD() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const onBloom = () => setCount(c => c + 1);
        gameEvents.addEventListener('bloom', onBloom);
        return () => gameEvents.removeEventListener('bloom', onBloom);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden z-10" style={{ pointerEvents: 'none' }}>
            {/* Title */}
            <div className="absolute top-8 left-0 right-0 text-center">
                <h1 className="text-4xl text-white tracking-widest opacity-90 font-sans" style={{ textShadow: '0 0 15px rgba(255,255,255,0.6)' }}>
                    Crystal Bloom Garden
                </h1>
            </div>

            {/* Bloom counter — top-right on mobile, bottom-left on desktop */}
            <div className="absolute top-8 right-6 sm:bottom-8 sm:top-auto sm:left-8 sm:right-auto">
                <div className="bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 text-white font-sans text-lg shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    ✦ {count} flowers bloomed
                </div>
            </div>

            {/* Controls hint — hidden on touch devices (they get the joystick) */}
            <div className="absolute bottom-8 right-6 hidden sm:block">
                <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-white/80 font-mono text-sm uppercase tracking-widest">
                    WASD / ↑↓←→ to walk
                </div>
            </div>

            {/* Virtual joystick — touch devices only, needs pointer events */}
            <div style={{ pointerEvents: 'auto' }} className="sm:hidden">
                <Joystick />
            </div>
        </div>
    );
}
