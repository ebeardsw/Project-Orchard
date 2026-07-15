import { KeyboardControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Game } from './components/Game';
import { HUD } from './components/HUD';
import { Controls } from './gameState';

const keyMap = [
  { name: Controls.forward, keys: ['ArrowUp', 'KeyW', 'w'] },
  { name: Controls.back, keys: ['ArrowDown', 'KeyS', 's'] },
  { name: Controls.left, keys: ['ArrowLeft', 'KeyA', 'a'] },
  { name: Controls.right, keys: ['ArrowRight', 'KeyD', 'd'] },
];

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <KeyboardControls map={keyMap}>
        <Canvas camera={{ position: [0, 5, 8], fov: 60 }} shadows>
          <Game />
        </Canvas>
      </KeyboardControls>
      <HUD />
    </div>
  );
}
