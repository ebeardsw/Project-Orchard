import * as THREE from 'three';

export enum Controls {
  forward = 'forward',
  back = 'back',
  left = 'left',
  right = 'right',
}

export const playerState = {
  position: new THREE.Vector3(0, 0, 0),
};

export const gameEvents = new EventTarget();
export const dispatchBloom = () => gameEvents.dispatchEvent(new Event('bloom'));

// Touch joystick state — written by Joystick component, read by Player in useFrame
export const touchInput = {
  dx: 0, // -1 to 1
  dz: 0, // -1 to 1
};
