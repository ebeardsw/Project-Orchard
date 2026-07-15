import { useMemo } from 'react';
import { Player } from './Player';
import { Terrain } from './Terrain';
import { FlowerBud } from './FlowerBud';

function PseudoRandom(seed: number) {
    let value = seed;
    return function() {
        value = (value * 9301 + 49297) % 233280;
        return value / 233280;
    }
}

export function Game() {
    const buds = useMemo(() => {
        const rng = PseudoRandom(98765);
        const items = [];
        for (let i = 0; i < 30; i++) {
            const angle = rng() * Math.PI * 2;
            const radius = 4 + rng() * 30; 
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            items.push({ x, z, id: i });
        }
        return items;
    }, []);

    return (
        <group>
            <Terrain />
            {buds.map((b) => (
                <FlowerBud key={b.id} id={b.id} position={[b.x, 0, b.z]} />
            ))}
            <Player />
        </group>
    );
}
