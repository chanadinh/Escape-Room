'use client';

interface BottomStatusStripProps {
  timeLeft: string;
  damageLevel?: number; // 0-100
}

export default function BottomStatusStrip({ timeLeft, damageLevel = 0 }: BottomStatusStripProps) {
  return (
    <div className="mt-4 grid grid-cols-3 gap-3">
      <div className="bg-black border-2 border-yellow-500 rounded p-3 text-yellow-300">
        <div className="text-xs mb-2 tracking-widest">DAMAGE STATUS</div>
        <div className="w-full h-4 bg-red-900/40 border border-red-500 rounded overflow-hidden">
          <div className="h-full bg-red-500" style={{ width: `${Math.min(100, Math.max(0, damageLevel))}%` }} />
        </div>
      </div>
      <div className="bg-black border-2 border-yellow-500 rounded p-3 text-red-400 text-center">
        <div className="text-xs tracking-widest">TIMER</div>
        <div className="text-2xl font-mono">{timeLeft.replace(':', ' 00 ')}</div>
      </div>
      <div className="bg-black border-2 border-yellow-500 rounded p-3 text-yellow-300">
        <div className="text-xs mb-2 tracking-widest">AMMO</div>
        <div className="grid grid-cols-12 gap-1">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="h-3 bg-yellow-400" />
          ))}
        </div>
      </div>
    </div>
  );
}


