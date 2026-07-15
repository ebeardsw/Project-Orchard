import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { playerState, Controls, touchInput } from '../gameState';

export function Player() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [subscribe, get] = useKeyboardControls<Controls>();
  const speed = 4;
  const currentAngle = useRef(Math.PI);
  
  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.55, 32, 32);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
       const y = pos.getY(i);
       if (y < -0.2) {
           pos.setY(i, -0.2);
       }
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state, delta) => {
    if (playerState.locked) return; // freeze during cutscene

    const controls = get();
    let dx = 0;
    let dz = 0;

    if (controls.forward) dz -= 1;
    if (controls.back) dz += 1;
    if (controls.left) dx -= 1;
    if (controls.right) dx += 1;

    // Blend in touch joystick input
    dx += touchInput.dx;
    dz += touchInput.dz;

    const moving = dx !== 0 || dz !== 0;
    if (moving) {
       const length = Math.sqrt(dx * dx + dz * dz);
       dx /= length;
       dz /= length;
       
       const moveX = dx * speed * delta;
       const moveZ = dz * speed * delta;
       
       if (groupRef.current) {
          groupRef.current.position.x += moveX;
          groupRef.current.position.z += moveZ;
          
          const targetAngle = Math.atan2(dx, dz);
          let diff = targetAngle - currentAngle.current;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          currentAngle.current += diff * 10 * delta;
          
          groupRef.current.rotation.y = currentAngle.current;
       }
    }
    
    if (groupRef.current && meshRef.current) {
        playerState.position.copy(groupRef.current.position);
        
        const time = state.clock.elapsedTime;
        const bob = Math.sin(time * 3) * 0.05;
        const rock = moving ? Math.sin(time * 15) * 0.1 : 0;
        
        meshRef.current.position.y = 0.2 + bob;
        meshRef.current.rotation.z = rock;
        
        const targetCamPos = new THREE.Vector3(
            groupRef.current.position.x - Math.sin(currentAngle.current) * 8,
            groupRef.current.position.y + 5,
            groupRef.current.position.z - Math.cos(currentAngle.current) * 8
        );
        state.camera.position.lerp(targetCamPos, 5 * delta);
        const lookAtTarget = groupRef.current.position.clone().add(new THREE.Vector3(0, 1, 0));
        state.camera.lookAt(lookAtTarget);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} geometry={geometry} castShadow>
         <meshStandardMaterial color="#f5ede0" roughness={0.4} />
         <mesh position={[-0.15, 0.2, 0.5]}>
           <sphereGeometry args={[0.08, 16, 16]} />
           <meshStandardMaterial color="#111" roughness={0.8} />
         </mesh>
         <mesh position={[0.15, 0.2, 0.5]}>
           <sphereGeometry args={[0.08, 16, 16]} />
           <meshStandardMaterial color="#111" roughness={0.8} />
         </mesh>
         <mesh position={[-0.55, 0, 0]}>
           <sphereGeometry args={[0.1, 16, 16]} />
           <meshStandardMaterial color="#f5ede0" />
         </mesh>
         <mesh position={[0.55, 0, 0]}>
           <sphereGeometry args={[0.1, 16, 16]} />
           <meshStandardMaterial color="#f5ede0" />
         </mesh>
         <pointLight position={[0, 1, 0]} distance={10} intensity={0.5} color="#fff" />
      </mesh>
    </group>
  );
}
