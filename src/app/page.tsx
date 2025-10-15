'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ControlConsole from '@/components/ControlConsole';
import FuelWarning from '@/components/FuelWarning';
import TransmissionPanel from '@/components/TransmissionPanel';
import FuelCodeEntry from '@/components/FuelCodeEntry';
import QROverlay from '@/components/QROverlay';

export default function Home() {
  const router = useRouter();
  const [gameState, setGameState] = useState<'running' | 'warning' | 'gameOver' | 'escaped'>('running');
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [fuelLevel, setFuelLevel] = useState(100);
  const [showTransmission, setShowTransmission] = useState(false);
  const [showFuelEntry, setShowFuelEntry] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [damageLevel, setDamageLevel] = useState(0);
  const [fuelErrorMsg, setFuelErrorMsg] = useState<string | undefined>(undefined);
  const [musicOn, setMusicOn] = useState(true);
  const bgAudioRef = useRef<HTMLAudioElement>(null);
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

  const handleQRScan = () => {
    setShowQR(true);
  };

  const handleFuelCodeSubmit = (code: string) => {
    const normalized = code.toUpperCase();
    if (normalized === fuelCodeFromEnv && normalized.length === 4) {
      setFuelLevel(100);
      setGameState('running');
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
        <ControlConsole 
          timeLeft={formatTime(timeLeft)}
          fuelLevel={fuelLevel}
          gameState={gameState}
          damageLevel={damageLevel}
        />
        
        {gameState === 'warning' && (
          <FuelWarning 
            timeLeft={formatTime(timeLeft)}
            onShowFuelEntry={() => setShowFuelEntry(true)}
          />
        )}
        
        {gameState === 'gameOver' && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4 text-red-500 animate-pulse">
                {fuelLevel <= 0 ? 'NO FUEL REMAINING' : 'CRITICAL DAMAGE'}
              </div>
              <div className="text-2xl text-red-400">
                MISSION FAILED
              </div>
            </div>
          </div>
        )}

        {showTransmission && (
          <TransmissionPanel onClose={() => setShowTransmission(false)} />
        )}

        {showFuelEntry && (
          <FuelCodeEntry 
            onSubmit={handleFuelCodeSubmit}
            errorMessage={fuelErrorMsg}
            onClose={() => setShowFuelEntry(false)}
          />
        )}

        {/* Actions */}
        <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={handleQRScan}
            className="bg-green-900 hover:bg-green-800 border border-green-500 px-6 py-3 rounded text-green-400 transition-colors"
          >
            SCAN QR CODE
          </button>
          <button
            onClick={() => setShowFuelEntry(true)}
            className="bg-green-900 hover:bg-green-800 border border-green-500 px-6 py-3 rounded text-green-400 transition-colors"
          >
            ENTER FUEL CODE
          </button>
          <button
            onClick={() => setMusicOn((v) => !v)}
            className="bg-green-900 hover:bg-green-800 border border-green-500 px-6 py-3 rounded text-green-400 transition-colors"
          >
            {musicOn ? 'MUSIC: ON' : 'MUSIC: OFF'}
          </button>
        </div>

        {showQR && (
          <QROverlay
            value={(typeof window !== 'undefined' ? window.location.origin : '') + '/transmission?from=qr'}
            onClose={() => setShowQR(false)}
          />
        )}
      </div>
      {/* Background music */}
      <audio ref={bgAudioRef} preload="auto">
        <source src="/sounds/morse-code.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}