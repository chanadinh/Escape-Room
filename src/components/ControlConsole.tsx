'use client';

import { twMerge } from 'tailwind-merge';
import VerticalGauge from './VerticalGauge';
import WireframeViewport from './WireframeViewport';
import NavigationDials from './NavigationDials';
import BottomStatusStrip from './BottomStatusStrip';
import { Frame } from './ui/frame';

interface ControlConsoleProps {
  timeLeft: string;
  fuelLevel: number;
  gameState: string;
  damageLevel?: number;
  onShowFuelEntry: () => void;
}

export default function ControlConsole({ timeLeft, fuelLevel, gameState, onShowFuelEntry }: ControlConsoleProps) {
  return (
    <div
      className={twMerge([
        "relative w-screen h-screen",
        "[--color-frame-1-stroke:var(--color-primary)]/50",
        "[--color-frame-1-fill:var(--color-primary)]/20",
        "[--color-frame-2-stroke:var(--color-accent)]",
        "[--color-frame-2-fill:var(--color-accent)]/20",
        "[--color-frame-3-stroke:var(--color-accent)]",
        "[--color-frame-3-fill:var(--color-accent)]/20",
        "[--color-frame-4-stroke:var(--color-accent)]",
        "[--color-frame-4-fill:var(--color-accent)]/20",
        "[--color-frame-5-stroke:var(--color-primary)]/23",
        "[--color-frame-5-fill:transparent]",
      ])}
    >
      <Frame
        className="drop-shadow-2xl drop-shadow-primary/50"
        paths={JSON.parse(
          '[{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-1-stroke)","fill":"var(--color-frame-1-fill)"},"path":[["M","37","12"],["L","0% + 59","12"],["L","0% + 85","0% + 33"],["L","79","0% + 12"],["L","50% - 3","12"],["L","50% + 16","30"],["L","100% - 35","30"],["L","100% - 16","47"],["L","100% - 16","100% - 47.05882352941177%"],["L","100% - 8","100% - 44.85294117647059%"],["L","100% - 9","100% - 16.666666666666668%"],["L","100% - 17","100% - 14.705882352941176%"],["L","100% - 17","100% - 30"],["L","100% - 34","100% - 12"],["L","50% + 13","100% - 12"],["L","50% + 15","100% - 26"],["L","50% - 11","100% - 12"],["L","37","100% - 12"],["L","19","100% - 30"],["L","19","0% + 50.490196078431374%"],["L","10","0% + 48.529411764705884%"],["L","10","0% + 20.098039215686274%"],["L","0% + 19.000000000000004","0% + 18.38235294117647%"],["L","19","29"],["L","37","12"]]},{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-2-stroke)","fill":"var(--color-frame-2-fill)"},"path":[["M","50% + 10","15"],["L","50% + 19","15"],["L","50% + 24","0% + 20"],["L","50% + 16","0% + 20"],["L","50% + 10","15"]]},{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-3-stroke)","fill":"var(--color-frame-3-fill)"},"path":[["M","50% + 25","15"],["L","50% + 34","15"],["L","50% + 40","0% + 21"],["L","50% + 31","0% + 21"],["L","50% + 25","15"]]},{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-4-stroke)","fill":"var(--color-frame-4-fill)"},"path":[["M","50% + 40","15"],["L","50% + 52","15"],["L","50% + 61","0% + 23"],["L","50% + 49","0% + 23"],["L","50% + 40","15"]]},{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-5-stroke)","fill":"var(--color-frame-5-fill)"},"path":[["M","36","3"],["L","0% + 58","0"],["L","0% + 84","0% + 40"],["L","81","0% + 0"],["L","50% - 1","4"],["L","50% + 5","6"],["L","50% + 54","7"],["L","50% + 74","23"],["L","100% - 32","21"],["L","100% - 8","42"],["L","100% - 9","100% - 52.450980392156865%"],["L","100% + 0","100% - 50.245098039215684%"],["L","100% + 0","100% - 15.196078431372548%"],["L","100% - 7","100% - 13.480392156862745%"],["L","100% - 7","100% - 27"],["L","100% - 29","100% - 3"],["L","50% + 14","100% + 0"],["L","50% + 21","100% - 31"],["L","50% - 13","100% + 0"],["L","37","100% - 4"],["L","11","100% - 28"],["L","10","0% + 55.3921568627451%"],["L","0","0% + 52.94117647058823%"],["L","1","0% + 18.627450980392158%"],["L","11","0% + 16.666666666666668%"],["L","11","25"],["L","36","3"]]}]'
        )}
      />

      {/* Console content inside the Frame */}
      <div className="absolute inset-0 p-4 md:p-6">
        <div className="bg-[#0b0f14] rounded-lg h-full w-full flex flex-col">
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
      </div>
    </div>
  );
}

