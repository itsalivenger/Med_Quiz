'use client';

import { useEffect, useRef } from 'react';

export default function SpotlightGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);
  const coords = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });

  useEffect(() => {
    // Default initial coordinates centered near the hero section
    if (typeof window !== 'undefined') {
      coords.current = {
        x: window.innerWidth / 2,
        y: window.innerHeight * 0.35,
      };
      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(600px circle at ${coords.current.x}px ${coords.current.y}px, rgba(220, 38, 38, 0.18), transparent 80%)`;
      }
    }

    const updateSpotlight = () => {
      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(600px circle at ${coords.current.x}px ${coords.current.y}px, rgba(220, 38, 38, 0.18), transparent 80%)`;
      }
      rafId.current = null;
    };

    const handlePointerMove = (e: MouseEvent) => {
      coords.current = { x: e.clientX, y: e.clientY };

      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(updateSpotlight);
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#111111] select-none"
    >
      {/* ── Base 40px x 40px Grid Pattern ── */}
      <div
        className="absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #27272a 1px, transparent 1px),
            linear-gradient(to bottom, #27272a 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── Mouse-Tracking Crimson Spotlight Layer ── */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          willChange: 'background',
        }}
      />

      {/* ── Ambient Glow on Grid Lines Under Pointer ── */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(220, 38, 38, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(220, 38, 38, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 35%), black 0%, transparent 80%)`,
          WebkitMaskImage: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 35%), black 0%, transparent 80%)`,
        }}
      />

      {/* ── Soft Vignette to Blend Seamlessly at the Edges ── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, #111111 95%)',
        }}
      />
    </div>
  );
}
