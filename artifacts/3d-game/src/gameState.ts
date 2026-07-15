import * as THREE from 'three';

export enum Controls {
  forward = 'forward',
  back = 'back',
  left = 'left',
  right = 'right',
}

export const playerState = {
  position: new THREE.Vector3(0, 0, 0),
  locked: false, // true while a cutscene video is playing — Player should ignore movement input
};

export const gameEvents = new EventTarget();
export const dispatchBloom = () => gameEvents.dispatchEvent(new Event('bloom'));

// Cutscene system — plays a full video once, on the very first bloom ever.
// Every bloom after that falls back to the existing quick particle burst.
let hasPlayedFirstCutscene = false;
export const shouldPlayCutscene = () => {
  if (hasPlayedFirstCutscene) return false;
  hasPlayedFirstCutscene = true;
  return true;
};
export const dispatchCutscene = (videoSrc: string) =>
  gameEvents.dispatchEvent(new CustomEvent('cutscene', { detail: { videoSrc } }));

// Touch joystick state — written by Joystick component, read by Player in useFrame
export const touchInput = {
  dx: 0, // -1 to 1
  dz: 0, // -1 to 1
};
