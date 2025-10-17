'use client';

interface BottomStatusStripProps {
  timeLeft: string;
  fuelLevel: number; // 0-100
  onShowFuelEntry: () => void;
}

export default function BottomStatusStrip({ timeLeft, fuelLevel, onShowFuelEntry }: BottomStatusStripProps) {
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
  return (
    <div className="mt-4 grid grid-cols-3 gap-3">
      {/* Left: Timer in bottom-left corner */}
      <div className="bg-black border-2 border-yellow-500 rounded p-3 text-red-400">
        <div className="text-xs tracking-widest">TIMER</div>
        <div className="text-2xl font-mono">{timeLeft.replace(':', ' 00 ')}</div>
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
      </div>

      {/* Center: Enter Fuel Code button at former timer position */}
      <div className="bg-black border-2 border-yellow-500 rounded p-3 flex items-center justify-center">
        <button
          onClick={onShowFuelEntry}
          className="bg-green-900 hover:bg-green-800 border border-green-500 px-6 py-3 rounded text-green-300 font-bold tracking-widest"
        >
          ENTER FUEL CODE
        </button>
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


