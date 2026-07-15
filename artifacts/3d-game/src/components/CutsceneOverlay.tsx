import { useEffect, useRef, useState } from 'react';
import { gameEvents, playerState, dispatchBloom } from '../gameState';

export function CutsceneOverlay() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const src = (e as CustomEvent<{ videoSrc: string }>).detail.videoSrc;
      setVideoSrc(src);
      setVisible(true);
    };
    gameEvents.addEventListener('cutscene', handler);
    return () => gameEvents.removeEventListener('cutscene', handler);
  }, []);

  useEffect(() => {
    if (visible && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay-with-sound can get blocked by some browsers — fall through to handleEnded
      });
    }
  }, [visible, videoSrc]);

  const handleEnded = () => {
    setVisible(false);
    playerState.locked = false;
    dispatchBloom(); // count the first flower once the cutscene finishes
  };

  if (!videoSrc) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'black',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.6s ease',
      }}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        onEnded={handleEnded}
        playsInline
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
    </div>
  );
}
