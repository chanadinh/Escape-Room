'use client';

import { useEffect, useRef } from 'react';

interface FuelWarningProps {
  timeLeft: string;
  onShowFuelEntry: () => void;
}

export default function FuelWarning({ timeLeft, onShowFuelEntry }: FuelWarningProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Play warning sound when component mounts
    const playWarningSound = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(console.error);
      }
    };

    playWarningSound();
    
    // Play warning sound every 10 seconds
    const interval = setInterval(playWarningSound, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-6 bg-red-900 border-2 border-red-500 rounded-lg p-6 animate-pulse">
      <audio ref={audioRef} preload="auto">
        <source src="/sounds/warning-alarm.wav" type="audio/wav" />
        <source src="/sounds/warning-alarm.mp3" type="audio/mpeg" />
        {/* Fallback to a simple beep sound */}
      </audio>
      
      <div className="text-center">
        <div className="text-4xl font-bold text-red-400 mb-4">
          ⚠️ WARNING ⚠️
        </div>
        
        <div className="text-2xl text-red-300 mb-4">
          FUEL LEVELS CRITICAL
        </div>
        
        <div className="text-lg text-red-200 mb-6">
          Proper fuel source must be selected to refuel
        </div>
        
        <div className="bg-black border border-red-500 p-4 rounded mb-6">
          <div className="text-sm text-red-300 mb-1">TIME UNTIL FUEL DEPLETION</div>
          <div className="text-3xl font-mono text-red-400">
            {timeLeft}
          </div>
        </div>
        
        <button
          onClick={onShowFuelEntry}
          className="bg-red-700 hover:bg-red-600 border-2 border-red-400 px-8 py-4 rounded text-red-100 text-xl font-bold transition-all duration-200 hover:scale-105"
        >
          ENTER FUEL CODE
        </button>
      </div>
    </div>
  );
}

