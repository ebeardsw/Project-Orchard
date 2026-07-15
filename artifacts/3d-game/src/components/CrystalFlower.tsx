import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const HUES = ['#f9c8d4', '#d4b8f0', '#b8f0d4', '#f9e8b8', '#b8d8f0'];

export function CrystalFlower({ progressRef, id }: { progressRef: React.MutableRefObject<number>, id: number }) {
    const groupRef = useRef<THREE.Group>(null);
    const innerPetalsRef = useRef<THREE.Group>(null);
    const outerPetalsRef = useRef<THREE.Group>(null);
    const centerGlowRef = useRef<THREE.Mesh>(null);

    const hue = useMemo(() => HUES[id % HUES.length], [id]);
    const scaleFactor = useMemo(() => 0.8 + (id % 5) * 0.1, [id]);
    const startRotY = useMemo(() => (id * 0.5) % (Math.PI * 2), [id]);

    const petalGeo = useMemo(() => {
        const geo = new THREE.OctahedronGeometry(1, 0);
        geo.scale(0.2, 1, 0.05);
        geo.translate(0, 1, 0);
        return geo;
    }, []);

    const innerPetals = useMemo(() => {
        return Array.from({ length: 8 }).map((_, i) => (i * Math.PI * 2) / 8);
    }, []);

    const outerPetals = useMemo(() => {
        return Array.from({ length: 8 }).map((_, i) => (i * Math.PI * 2) / 8 + Math.PI / 8);
    }, []);

    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.3 * delta;
        }

        const p = progressRef.current;
        const easeOut = 1 - Math.pow(1 - p, 3);

        if (innerPetalsRef.current && outerPetalsRef.current && centerGlowRef.current) {
            const innerAngle = THREE.MathUtils.lerp(0.1, 0.5, easeOut);
            const outerAngle = THREE.MathUtils.lerp(0.1, 0.8, easeOut);

            const scale = THREE.MathUtils.lerp(0.01, 1, easeOut);
            innerPetalsRef.current.scale.setScalar(scale);
            outerPetalsRef.current.scale.setScalar(scale);
            centerGlowRef.current.scale.setScalar(scale);
            
            innerPetalsRef.current.children.forEach((child) => {
                const mesh = child.children[0] as THREE.Mesh;
                mesh.rotation.x = innerAngle;
            });
            outerPetalsRef.current.children.forEach((child) => {
                const mesh = child.children[0] as THREE.Mesh;
                mesh.rotation.x = outerAngle;
            });
        }
    });

    return (
        <group ref={groupRef} scale={scaleFactor} rotation={[0, startRotY, 0]}>
            <mesh position={[0, 0.5, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 1]} />
                <meshPhysicalMaterial 
                    color="#e0f0f0" 
                    transmission={0.8} 
                    opacity={1} 
                    transparent 
                    roughness={0.1} 
                />
            </mesh>

            <group ref={innerPetalsRef} position={[0, 1, 0]}>
                {innerPetals.map((angle, i) => (
                    <group key={`inner-${i}`} rotation={[0, angle, 0]}>
                        <mesh geometry={petalGeo} scale={[1, 0.8, 1]}>
                            <meshPhysicalMaterial 
                                color={hue}
                                emissive={hue}
                                emissiveIntensity={0.3}
                                transmission={0.9}
                                roughness={0.05}
                                metalness={0.1}
                                ior={1.5}
                                thickness={0.5}
                                side={THREE.DoubleSide}
                            />
                        </mesh>
                    </group>
                ))}
            </group>

            <group ref={outerPetalsRef} position={[0, 1, 0]}>
                {outerPetals.map((angle, i) => (
                    <group key={`outer-${i}`} rotation={[0, angle, 0]}>
                        <mesh geometry={petalGeo} scale={[1.2, 1.2, 1]}>
                            <meshPhysicalMaterial 
                                color={hue}
                                emissive={hue}
                                emissiveIntensity={0.2}
                                transmission={0.9}
                                roughness={0.05}
                                metalness={0.1}
                                ior={1.5}
                                thickness={0.5}
                                side={THREE.DoubleSide}
                            />
                        </mesh>
                    </group>
                ))}
            </group>

            <mesh ref={centerGlowRef} position={[0, 1.2, 0]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshBasicMaterial color="#ffffff" />
                <pointLight distance={4} intensity={1.5} color={hue} />
            </mesh>
        </group>
    );
}
