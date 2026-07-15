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
