'use client';

import { useState, useEffect, useRef } from 'react';
import ControlConsole from '@/components/ControlConsole';
import FuelWarning from '@/components/FuelWarning';
import TransmissionPanel from '@/components/TransmissionPanel';
import FuelCodeEntry from '@/components/FuelCodeEntry';
// QROverlay removed from UI

export default function Home() {
  const [gameState, setGameState] = useState<'running' | 'warning' | 'gameOver' | 'escaped'>('running');
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [fuelLevel, setFuelLevel] = useState(100);
  const [showTransmission, setShowTransmission] = useState(false);
  const [showFuelEntry, setShowFuelEntry] = useState(false);
  // const [showQR, setShowQR] = useState(false); // removed from UI
  const [damageLevel, setDamageLevel] = useState(0);
  const [fuelErrorMsg, setFuelErrorMsg] = useState<string | undefined>(undefined);
  const [musicOn, setMusicOn] = useState(true);
  const bgAudioRef = useRef<HTMLAudioElement>(null);
  const [periodicWarning, setPeriodicWarning] = useState(false);
  const [warningText, setWarningText] = useState('WARNING');
  const [warningShowTime, setWarningShowTime] = useState(false);
  const fuelCodeFromEnv = (process.env.NEXT_PUBLIC_FUEL_CODE || 'FUEL').toUpperCase();

  // Timer countdown
  useEffect(() => {
    if (gameState === 'running' || gameState === 'warning') {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setGameState('gameOver');
            return 0;
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState]);

  // Background music: try to play on first interaction and when enabled
  useEffect(() => {
    const tryPlay = () => {
      if (!musicOn || gameState === 'gameOver') return;
      const a = bgAudioRef.current;
      if (!a) return;
      a.volume = 0.35;
      a.loop = true;
      a.play().catch(() => {});
    };

    // attempt immediately and also on first user gesture
    tryPlay();
    window.addEventListener('pointerdown', tryPlay, { once: true });
    return () => {
      window.removeEventListener('pointerdown', tryPlay);
    };
  }, [musicOn, gameState]);

  // Pause when disabled or on game over
  useEffect(() => {
    const a = bgAudioRef.current;
    if (!a) return;
    if (!musicOn || gameState === 'gameOver') a.pause();
  }, [musicOn, gameState]);

  // Fuel level decreases over time
  useEffect(() => {
    if (gameState === 'running' || gameState === 'warning') {
      const fuelTimer = setInterval(() => {
        setFuelLevel((prev) => {
          const newLevel = prev - (100 / (15 * 60)); // Decrease over 15 minutes
          if (newLevel <= 20 && gameState === 'running') {
            setGameState('warning');
          }
          return Math.max(0, newLevel);
        });
      }, 1000);

      return () => clearInterval(fuelTimer);
    }
  }, [gameState]);

  // Initial 5s warning overlay at start
  useEffect(() => {
    setWarningText('WARNING: FUEL LEVELS GETTING LOW');
    setPeriodicWarning(true);
    setWarningShowTime(false);
    try {
      const a = new Audio('/sounds/warning-alarm.mp3');
      a.volume = 0.7;
      a.play().catch(() => {});
    } catch {}
    const t = setTimeout(() => setPeriodicWarning(false), 5000);
    return () => clearTimeout(t);
  }, []);

  // Flash warning every 5 minutes while active
  useEffect(() => {
    if (gameState === 'gameOver' || gameState === 'escaped') return;
    const interval = setInterval(() => {
      setWarningText('WARNING');
      setPeriodicWarning(true);
      setWarningShowTime(true);
      try {
        const a = new Audio('/sounds/warning-alarm.mp3');
        a.volume = 0.7;
        a.play().catch(() => {});
      } catch {}
      setTimeout(() => setPeriodicWarning(false), 3000);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  // Game over conditions: fuel empty or damage maxed
  useEffect(() => {
    if ((gameState === 'running' || gameState === 'warning') && fuelLevel <= 0) {
      setGameState('gameOver');
    }
  }, [fuelLevel, gameState]);

  useEffect(() => {
    if ((gameState === 'running' || gameState === 'warning') && damageLevel >= 100) {
      setGameState('gameOver');
    }
  }, [damageLevel, gameState]);

  // QR scan button removed

  const handleFuelCodeSubmit = (code: string) => {
    const normalized = code.toUpperCase();
    if (normalized === fuelCodeFromEnv && normalized.length === 4) {
      setFuelLevel(100);
      setGameState('escaped');
      setShowFuelEntry(false);
      setShowTransmission(false);
      setFuelErrorMsg(undefined);
      // Could trigger escape sequence here
    } else {
      setDamageLevel((prev) => Math.min(100, prev + 10));
      setFuelErrorMsg('Incorrect fuel code. Damage sustained!');
      try {
        const a = new Audio('/sounds/key-beep.mp3');
        a.play().catch(() => {});
      } catch {}
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden relative">
      <div className="scanline"></div>
      <div className="container mx-auto p-4 h-screen flex flex-col">
        <div className="relative mx-auto" style={{ width: 'min(100vw - 32px, calc((100vh - 32px) * 16 / 9))' }}>
          <div className="w-full aspect-video">
            <ControlConsole 
              timeLeft={formatTime(timeLeft)}
              fuelLevel={fuelLevel}
              gameState={gameState}
              damageLevel={damageLevel}
              onShowFuelEntry={() => { setFuelErrorMsg(undefined); setShowFuelEntry(true); }}
            />
          </div>
          {gameState === 'gameOver' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4 text-red-500 animate-pulse">
                  {fuelLevel <= 0 ? 'NO FUEL REMAINING' : 'CRITICAL DAMAGE'}
                </div>
                <div className="text-2xl text-red-400">MISSION FAILED</div>
              </div>
            </div>
          )}
          {gameState === 'escaped' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4 text-green-400 animate-pulse">MISSION ACCOMPLISHED</div>
                <div className="text-2xl text-green-300">TIME REMAINING: {formatTime(timeLeft)}</div>
              </div>
            </div>
          )}
        </div>
        
        {gameState === 'warning' && (
          <FuelWarning 
            timeLeft={formatTime(timeLeft)}
            onShowFuelEntry={() => { setFuelErrorMsg(undefined); setShowFuelEntry(true); }}
          />
        )}
        
        {/* Game over and success overlays are shown within the console above */}

        {showTransmission && (
          <TransmissionPanel onClose={() => setShowTransmission(false)} />
        )}

        {showFuelEntry && (
          <FuelCodeEntry 
            onSubmit={handleFuelCodeSubmit}
            errorMessage={fuelErrorMsg}
            onClose={() => { setFuelErrorMsg(undefined); setShowFuelEntry(false); }}
          />
        )}

        {/* Actions removed to maximize console in 16:9 */}

        {/* QR overlay removed */}
      </div>
      {periodicWarning && (
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center z-40">
          <div className="bg-red-900/30 backdrop-blur-sm border-2 border-red-500 text-red-300 px-8 py-6 rounded-lg text-4xl font-bold animate-pulse text-center">
            {warningText}
            {warningShowTime && (
              <div className="mt-2 text-2xl font-mono text-red-200">TIME REMAINING: {formatTime(timeLeft)}</div>
            )}
          </div>
        </div>
      )}
      {/* Background music */}
      <audio ref={bgAudioRef} preload="auto">
        <source src="/sounds/morse-code.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}