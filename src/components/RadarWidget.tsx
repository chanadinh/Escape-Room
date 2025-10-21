'use client';

export default function RadarWidget() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full border-2 border-cyan-300/80 bg-black overflow-hidden glow-cyan">
        {/* rotating wedge sweep */}
        <div
          className="absolute inset-0 radar-sweep-slow opacity-70"
          style={{
            backgroundImage:
              'conic-gradient(from 0deg, rgba(103,232,249,0.42) 0deg, rgba(103,232,249,0.22) 45deg, rgba(103,232,249,0.0) 90deg)'
          }}
        />
        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, #67e8f9 0, #67e8f9 1px, transparent 1px, transparent 12px), repeating-linear-gradient(90deg, #67e8f9 0, #67e8f9 1px, transparent 1px, transparent 12px)'
          }}
        />
        {/* sweep line (accent) */}
        <div className="absolute inset-0 flex items-center">
          <div className="radar-sweep-slow origin-left left-1/2 absolute top-1/2 w-1/2 h-[3px] bg-cyan-200" />
        </div>
        {/* rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2/3 h-2/3 rounded-full border border-cyan-300/40" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1/3 h-1/3 rounded-full border border-cyan-300/25" />
        </div>
        {/* blips */}
        <div className="absolute w-2 h-2 rounded-full bg-cyan-300/90 left-1/4 top-1/3 animate-pulse" />
        <div className="absolute w-2 h-2 rounded-full bg-cyan-300/90 right-1/4 bottom-1/4 animate-pulse" style={{ animationDelay: '0.4s' }} />
      </div>
      <div className="ml-4 hidden md:block text-cyan-100/90">
        <div className="text-sm tracking-widest">RADAR 01</div>
        <div className="text-[11px] mb-2">SEARCHING...</div>
        {/* metric readouts */}
        <div className="space-y-1">
          <Metric label="PRECISION" value={87} />
          <Metric label="LOCK" value={47} />
          <Metric label="SIGNAL" value={62} />
        </div>
        {/* mini bar graph */}
        <div className="mt-2 grid grid-cols-8 gap-[3px] items-end h-14 w-32">
          {[8, 16, 11, 20, 6, 14, 18, 10].map((h, i) => (
            <div key={i} className="bg-cyan-400/70" style={{ height: `${h * 2}px` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-[11px]">
      <div className="flex items-center justify-between">
        <span className="tracking-widest opacity-90">{label}</span>
        <span className="font-mono">{value}%</span>
      </div>
      <div className="mt-0.5 w-32 h-1.5 bg-cyan-900/60 border border-cyan-700/60">
        <div className="h-full bg-cyan-300" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}


