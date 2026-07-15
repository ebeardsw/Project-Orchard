import { useMemo } from 'react';
import * as THREE from 'three';

const MUSHROOM_COLORS = ['#f9c8d4', '#d4b8f0', '#b8f0d4', '#f0eeff'];

function PseudoRandom(seed: number) {
    let value = seed;
    return function() {
        value = (value * 9301 + 49297) % 233280;
        return value / 233280;
    }
}

export function Terrain() {
    const planeGeo = useMemo(() => {
        const geo = new THREE.PlaneGeometry(80, 80, 80, 80);
        geo.rotateX(-Math.PI / 2);
        
        const colors = [];
        const colorPalette = [
            new THREE.Color('#d4b8f0'),
            new THREE.Color('#b8f0d4'),
            new THREE.Color('#e8aeb7'),
            new THREE.Color('#a8e0e0'),
            new THREE.Color('#f5d0b5'),
        ];
        
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const z = pos.getZ(i);
            const noise = Math.sin(x * 0.15) + Math.cos(z * 0.15);
            const band = Math.floor((x + z + noise * 6) * 0.15) % colorPalette.length;
            const c = colorPalette[band >= 0 ? band : band + colorPalette.length];
            colors.push(c.r, c.g, c.b);
        }
        geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        return geo;
    }, []);

    const mushrooms = useMemo(() => {
        const rng = PseudoRandom(12345);
        const items = [];
        for (let i = 0; i < 25; i++) {
            const angle = rng() * Math.PI * 2;
            const radius = 6 + rng() * 30;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const scale = 0.8 + rng() * 2.2;
            const color = MUSHROOM_COLORS[Math.floor(rng() * MUSHROOM_COLORS.length)];
            items.push({ x, z, scale, color });
        }
        return items;
    }, []);

    return (
        <group>
            <fog attach="fog" args={['#c8c0f8', 20, 60]} />
            
            <ambientLight intensity={1.2} color="#ffe8d6" />
            <directionalLight 
                position={[10, 20, 10]} 
                intensity={1.5} 
                color="#fff" 
                castShadow 
                shadow-mapSize={[2048, 2048]} 
                shadow-camera-left={-40}
                shadow-camera-right={40}
                shadow-camera-top={40}
                shadow-camera-bottom={-40}
            />
            
            <mesh geometry={planeGeo} receiveShadow>
                <meshStandardMaterial vertexColors roughness={0.8} />
            </mesh>

            {mushrooms.map((m, i) => (
                <group key={i} position={[m.x, 0, m.z]} scale={m.scale}>
                    <mesh position={[0, 1, 0]} castShadow>
                        <cylinderGeometry args={[0.2, 0.4, 2]} />
                        <meshStandardMaterial color="#f8f5f0" roughness={0.9} />
                    </mesh>
                    <mesh position={[0, 2, 0]} castShadow>
                        <sphereGeometry args={[1.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                        <meshStandardMaterial color={m.color} emissive={m.color} emissiveIntensity={0.2} roughness={0.3} />
                    </mesh>
                </group>
            ))}
        </group>
    );
}
