'use client';

import VerticalGauge from './VerticalGauge';
import WireframeViewport from './WireframeViewport';
import NavigationDials from './NavigationDials';
import BottomStatusStrip from './BottomStatusStrip';

interface ControlConsoleProps {
  timeLeft: string;
  fuelLevel: number;
  gameState: string;
  damageLevel?: number;
  onShowFuelEntry: () => void;
}

export default function ControlConsole({ timeLeft, fuelLevel, gameState, damageLevel: _damageLevel = 0, onShowFuelEntry }: ControlConsoleProps) {
  return (
    <div className="bg-[#0b0f14] border-2 border-yellow-500 rounded-lg p-4 md:p-6 shadow-2xl h-full flex flex-col">
      {/* Top HUD row */}
      <div className="grid grid-cols-[auto_1fr_auto] gap-3">
        {/* Left: Fuel vertical gauge and mini dials */}
        <div className="flex flex-col items-center gap-3">
          <VerticalGauge label="FUEL" level={fuelLevel} />
          <div className="grid grid-cols-2 gap-2">
            <div className="w-10 h-10 rounded-full border-2 border-yellow-500" />
            <div className="w-10 h-10 rounded-full border-2 border-yellow-500" />
            <div className="w-10 h-10 rounded-full border-2 border-yellow-500" />
            <div className="w-10 h-10 rounded-full border-2 border-yellow-500" />
          </div>
        </div>

        {/* Center: Wireframe viewport */}
        <div className="min-h-[200px]">
          <WireframeViewport />
        </div>

        {/* Right: Navigation dials */}
        <div className="flex items-center justify-center">
          <NavigationDials />
        </div>
      </div>

      {/* Bottom status strip */}
      <BottomStatusStrip timeLeft={timeLeft} fuelLevel={fuelLevel} onShowFuelEntry={onShowFuelEntry} />

      {/* Mission status bar */}
      <div className="mt-4 bg-black border-2 border-yellow-500 rounded p-3">
        <div className="text-xs text-yellow-300 tracking-widest">MISSION STATUS</div>
        <div className="text-lg font-bold text-green-400">{gameState === 'running' ? 'ACTIVE' : gameState === 'warning' ? 'WARNING' : gameState === 'gameOver' ? 'CRITICAL' : 'COMPLETE'}</div>
      </div>
    </div>
  );
}

