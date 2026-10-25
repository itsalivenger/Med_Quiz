'use client';

import { useEffect, useRef } from 'react';

export default function AmbientGlow() {
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    let mx = -9999;
    let my = -9999;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const tick = () => {
      if (spotRef.current) {
        spotRef.current.style.background =
          `radial-gradient(500px circle at ${mx}px ${my}px, rgba(220,38,38,0.10) 0%, rgba(13,148,136,0.06) 45%, transparent 80%)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Subtle 40px grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #52525b 1px, transparent 1px), linear-gradient(to bottom, #52525b 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Mouse spotlight overlay */}
      <div ref={spotRef} className="absolute inset-0 transition-none" />

      {/* Orb 1: Crimson top-left â€” breathing pulse */}
      <div className="absolute -top-24 -left-24 h-[500px] w-[500px] rounded-full bg-red-600/10 blur-[150px] animate-pulse" />

      {/* Orb 2: Teal bottom-right */}
      <div className="absolute -bottom-32 -right-32 h-[600px] w-[600px] rounded-full bg-teal-500/10 blur-[160px]" />
    </div>
  );
}