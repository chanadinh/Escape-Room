'use client';

export default function WireframeViewport() {
  return (
    <div className="relative w-full h-[260px] md:h-[320px] bg-black border-2 border-yellow-500 rounded">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        <rect x="0" y="0" width="100" height="100" fill="black" />
        {/* Vertical lines converging to center */}
        {[...Array(6)].map((_, i) => {
          const x = 10 + i * 16;
          return (
            <line key={`v-${i}`} x1={x} y1={0} x2={50} y2={50} stroke="#39c0ff" strokeWidth={0.8} />
          );
        })}
        {/* Horizontal lines */}
        {[...Array(6)].map((_, i) => {
          const y = 10 + i * 16;
          return (
            <line key={`h-${i}`} x1={0} y1={y} x2={50} y2={50} stroke="#39c0ff" strokeWidth={0.8} />
          );
        })}
        {/* Symmetric other half */}
        {[...Array(6)].map((_, i) => {
          const x = 90 - i * 16;
          return (
            <line key={`v2-${i}`} x1={x} y1={0} x2={50} y2={50} stroke="#39c0ff" strokeWidth={0.8} />
          );
        })}
        {[...Array(6)].map((_, i) => {
          const y = 90 - i * 16;
          return (
            <line key={`h2-${i}`} x1={100} y1={y} x2={50} y2={50} stroke="#39c0ff" strokeWidth={0.8} />
          );
        })}
        {/* Center marker */}
        <circle cx={50} cy={50} r={2.5} fill="#39c0ff" />
      </svg>
      {/* Red vertical rails */}
      <div className="absolute top-0 bottom-0 left-[6%] w-[2px] bg-red-500/80" />
      <div className="absolute top-0 bottom-0 right-[6%] w-[2px] bg-red-500/80" />
    </div>
  );
}


