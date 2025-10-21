'use client';

interface BottomStatusStripProps {
  timeLeft: string;
  fuelLevel: number; // 0-100
  onShowFuelEntry: () => void;
  hideTimer?: boolean;
}

import RadarWidget from './RadarWidget';

export default function BottomStatusStrip({ timeLeft, fuelLevel, onShowFuelEntry, hideTimer }: BottomStatusStripProps) {
  const getFuelTextColor = () => {
    if (fuelLevel > 50) return 'text-green-400';
    if (fuelLevel > 20) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getFuelBarColor = () => {
    if (fuelLevel > 50) return 'bg-green-500';
    if (fuelLevel > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Derived compact meters for extra HUD details
  const engineTemp = Math.min(100, Math.max(0, 40 + (100 - fuelLevel) * 0.6));
  const reactorStability = Math.min(100, Math.max(0, fuelLevel * 0.9));
  const reloadPct = 72; // visual only
  return (
    <div className="mt-4 grid grid-cols-3 gap-3">
      {/* Left: Timer in bottom-left corner (hidden during prestart) */}
      <div className="bg-black border-2 border-yellow-500 rounded p-3 text-red-400">
        {!hideTimer && (
          <>
            <div className="text-xs tracking-widest">TIMER</div>
            <div className="text-2xl font-mono">{timeLeft.replace(':', ' 00 ')}</div>
          </>
        )}
        <div className="mt-3 text-[10px] text-yellow-300 tracking-widest">FUEL</div>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-900 h-4 rounded border border-yellow-500 overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${getFuelBarColor()}`}
              style={{ width: `${Math.min(100, Math.max(0, fuelLevel))}%` }}
            />
          </div>
          <div className={`text-sm font-bold ${getFuelTextColor()}`}>
            {Math.round(fuelLevel)}%
          </div>
        </div>
        {/* Extra meters */}
        <div className="mt-3 grid grid-cols-1 gap-2 text-cyan-200">
          <MiniMeter label="ENGINE TEMP" value={engineTemp} color="bg-cyan-400" />
          <MiniMeter label="REACTOR STABILITY" value={reactorStability} color="bg-cyan-300" />
        </div>
      </div>

      {/* Center: HUD radar filler (button hidden; QR only) */}
      <div className="bg-black border-2 border-yellow-500 rounded p-3 flex items-center justify-center">
        <RadarWidget />
      </div>
      <div className="bg-black border-2 border-yellow-500 rounded p-3 text-yellow-300">
        <div className="text-xs mb-2 tracking-widest">AMMO</div>
        <div className="grid grid-cols-12 gap-1">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="h-3 bg-yellow-400" />
          ))}
        </div>
        {/* Extra ammo widgets */}
        <div className="mt-3 text-cyan-200">
          <div className="text-[10px] tracking-widest mb-1">RELOAD</div>
          <div className="w-full h-2 bg-gray-900 border border-cyan-700 rounded">
            <div className="h-full bg-cyan-400" style={{ width: `${reloadPct}%` }} />
          </div>
          <div className="mt-3 grid grid-cols-8 gap-1">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className={`h-2 ${i % 3 === 0 ? 'bg-cyan-400' : 'bg-cyan-700'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniMeter({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="text-[10px] tracking-widest mb-1">{label}</div>
      <div className="w-full h-2 bg-gray-900 border border-cyan-700 rounded">
        <div className={`h-full ${color}`} style={{ width: `${Math.round(value)}%` }} />
      </div>
    </div>
  );
}


