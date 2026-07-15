import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Particles({ position }: { position: [number, number, number] }) {
    const particlesRef = useRef<THREE.InstancedMesh>(null);
    const count = 30;
    const [expired, setExpired] = useState(false);
    
    const particleData = useMemo(() => {
        const data = [];
        for (let i = 0; i < count; i++) {
            const u = Math.random();
            const v = Math.random();
            const theta = u * 2.0 * Math.PI;
            const phi = Math.acos(2.0 * v - 1.0);
            const r = Math.cbrt(Math.random());
            const sinPhi = Math.sin(phi);
            const dir = new THREE.Vector3(
                r * sinPhi * Math.cos(theta),
                r * sinPhi * Math.sin(theta),
                r * Math.cos(phi)
            );
            data.push({
                dir: dir.normalize(),
                speed: 1.5 + Math.random() * 2.5,
            });
        }
        return data;
    }, []);

    const dummy = useMemo(() => new THREE.Object3D(), []);
    const timeRef = useRef(0);

    useFrame((_, delta) => {
        if (expired) return;
        timeRef.current += delta;
        
        if (timeRef.current > 0.8) {
            setExpired(true);
            return;
        }

        const p = timeRef.current / 0.8;
        const scale = Math.max(0, 1 - p);

        if (particlesRef.current) {
            particleData.forEach((data, i) => {
                const dist = data.speed * timeRef.current;
                dummy.position.copy(data.dir).multiplyScalar(dist);
                dummy.scale.setScalar(scale);
                dummy.updateMatrix();
                particlesRef.current!.setMatrixAt(i, dummy.matrix);
            });
            particlesRef.current.instanceMatrix.needsUpdate = true;
        }
    });

    if (expired) return null;

    return (
        <instancedMesh ref={particlesRef} args={[undefined, undefined, count]} position={position}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
        </instancedMesh>
    );
}
