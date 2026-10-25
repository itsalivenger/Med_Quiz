// RSC — zero JavaScript overhead on the client
export default function AmbientGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none"
    >
      {/* Orb 1: Top-Left Smooth Crimson - gentle resting heart rhythm pulse & drift */}
      <div
        className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-red-600/15 blur-[140px] animate-neural-heartbeat"
        style={{ transform: 'translate3d(0, 0, 0)' }}
      />

      {/* Orb 2: Bottom-Right Deep Slate/Zinc anchor orb */}
      <div
        className="absolute -bottom-40 -right-40 w-[640px] h-[640px] rounded-full bg-zinc-800/25 blur-[160px]"
        style={{ transform: 'translate3d(0, 0, 0)' }}
      />
    </div>
  );
}
