'use client';

interface VerticalGaugeProps {
  label: string;
  level: number; // 0-100
  colorFrom?: string;
  colorTo?: string;
}

export default function VerticalGauge({ label, level, colorFrom = '#ff3b3b', colorTo = '#ffe36e' }: VerticalGaugeProps) {
  const bars = 16;
  const filled = Math.round((level / 100) * bars);
  return (
    <div className="flex flex-col items-center w-12">
      <div className="w-8 border-2 border-yellow-500 rounded p-1 bg-black">
        <div className="flex flex-col gap-1">
          {Array.from({ length: bars }).map((_, i) => {
            const active = i < filled;
            const t = i / Math.max(1, bars - 1);
            const color = active
              ? `linear-gradient(90deg, ${colorFrom}, ${colorTo})`
              : 'linear-gradient(90deg, #1f1f1f, #2a2a2a)';
            return (
              <div key={i} className="h-3 rounded" style={{ background: color }} />
            );
          })}
        </div>
      </div>
      <div className="mt-2 text-[10px] text-yellow-300 tracking-widest">{label}</div>
    </div>
  );
}


