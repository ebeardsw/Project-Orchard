import { useRef, useEffect, useCallback } from 'react';
import { touchInput } from '../gameState';

const BASE_RADIUS = 60;
const THUMB_RADIUS = 26;

export function Joystick() {
  const baseRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const activeTouch = useRef<number | null>(null);
  const baseCenter = useRef({ x: 0, y: 0 });

  const resetThumb = useCallback(() => {
    touchInput.dx = 0;
    touchInput.dz = 0;
    if (thumbRef.current) {
      thumbRef.current.style.transform = 'translate(-50%, -50%)';
    }
  }, []);

  const updateFromTouch = useCallback((clientX: number, clientY: number) => {
    const cx = baseCenter.current.x;
    const cy = baseCenter.current.y;
    let dx = clientX - cx;
    let dy = clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const clamped = Math.min(dist, BASE_RADIUS - THUMB_RADIUS);
    const ratio = clamped / (dist || 1);
    dx *= ratio;
    dy *= ratio;

    touchInput.dx = dx / (BASE_RADIUS - THUMB_RADIUS);
    touchInput.dz = dy / (BASE_RADIUS - THUMB_RADIUS);

    if (thumbRef.current) {
      thumbRef.current.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    }
  }, []);

  useEffect(() => {
    const base = baseRef.current;
    if (!base) return;

    const onTouchStart = (e: TouchEvent) => {
      if (activeTouch.current !== null) return;
      const touch = e.changedTouches[0];
      activeTouch.current = touch.identifier;
      const rect = base.getBoundingClientRect();
      baseCenter.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      updateFromTouch(touch.clientX, touch.clientY);
      e.preventDefault();
    };

    const onTouchMove = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === activeTouch.current) {
          updateFromTouch(touch.clientX, touch.clientY);
          e.preventDefault();
          break;
        }
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === activeTouch.current) {
          activeTouch.current = null;
          resetThumb();
          break;
        }
      }
    };

    base.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);

    return () => {
      base.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [updateFromTouch, resetThumb]);

  return (
    <div
      ref={baseRef}
      style={{
        position: 'absolute',
        bottom: 48,
        left: 48,
        width: BASE_RADIUS * 2,
        height: BASE_RADIUS * 2,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.12)',
        border: '2px solid rgba(255,255,255,0.25)',
        backdropFilter: 'blur(8px)',
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        cursor: 'pointer',
        boxShadow: '0 0 20px rgba(200,180,255,0.3)',
      }}
    >
      {/* Crosshair guide lines */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
      }}>
        <div style={{ width: '60%', height: 1, background: 'rgba(255,255,255,0.15)', position: 'absolute' }} />
        <div style={{ width: 1, height: '60%', background: 'rgba(255,255,255,0.15)', position: 'absolute' }} />
      </div>
      {/* Thumb */}
      <div
        ref={thumbRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: THUMB_RADIUS * 2,
          height: THUMB_RADIUS * 2,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.35)',
          border: '2px solid rgba(255,255,255,0.6)',
          transform: 'translate(-50%, -50%)',
          transition: 'box-shadow 0.1s',
          boxShadow: '0 0 12px rgba(220,200,255,0.6)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
