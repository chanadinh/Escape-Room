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
  const [attempts, setAttempts] = useState(0);
  const bgAudioRef = useRef<HTMLAudioElement>(null);
  const [periodicWarning, setPeriodicWarning] = useState(false);
  const [warningText, setWarningText] = useState('WARNING');
  const [warningShowTime, setWarningShowTime] = useState(false);
  const [lastQRScanTime, setLastQRScanTime] = useState<Date | null>(null);
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
      if (!musicOn || gameState === 'gameOver' || gameState === 'escaped') return;
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

  // Pause when disabled or on game over/win
  useEffect(() => {
    const a = bgAudioRef.current;
    if (!a) return;
    if (!musicOn || gameState === 'gameOver' || gameState === 'escaped') a.pause();
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

  // Play win sound and stop warning sounds when game is won
  useEffect(() => {
    if (gameState === 'escaped') {
      // Stop any playing warning sounds
      setPeriodicWarning(false);

      // Play win sound
      try {
        const winAudio = new Audio('/sounds/win.mp3');
        winAudio.volume = 0.8;
        winAudio.play().catch(() => {});
      } catch (error) {
        console.log('Could not play win sound:', error);
      }
    }
  }, [gameState]);

  // Poll for QR scans and trigger fuel entry modal
  useEffect(() => {
    if (gameState === 'gameOver' || gameState === 'escaped') return;

    const pollQRScans = async () => {
      try {
        // Check for recent QR scans from all QR codes (last 10 seconds)
        const qrCodes = ['qr_1', 'qr_2', 'qr_3', 'qr_4'];
        let latestScanTime = null;
        let latestScan = null;

        for (const qrCode of qrCodes) {
          const response = await fetch(`/api/qr-scan?qr=${qrCode}&limit=1`);
          const data = await response.json();

          if (data.scans && data.scans.length > 0) {
            const scan = data.scans[0];
            const scanTime = new Date(scan.timestamp);

            if (!latestScanTime || scanTime > latestScanTime) {
              latestScanTime = scanTime;
              latestScan = scan;
            }
          }
        }

        // If we found a new scan
        if (latestScan && (!lastQRScanTime || latestScanTime > lastQRScanTime)) {
          setLastQRScanTime(latestScanTime);

          // Trigger fuel entry modal
          setFuelErrorMsg(undefined);
          setShowFuelEntry(true);

          // Optional: Play a notification sound
          try {
            const notificationAudio = new Audio('/sounds/key-beep.mp3');
            notificationAudio.volume = 0.5;
            notificationAudio.play().catch(() => {});
          } catch {}

          console.log(`QR code ${latestScan.qrCode} was scanned at ${latestScanTime}`);
        }
      } catch (error) {
        console.error('Error polling QR scans:', error);
      }
    };

    // Poll every 3 seconds
    const interval = setInterval(pollQRScans, 3000);

    // Initial check
    pollQRScans();

    return () => clearInterval(interval);
  }, [gameState, lastQRScanTime]);

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
      setAttempts(0); // Reset attempts on successful entry
      // Could trigger escape sequence here
    } else {
      setDamageLevel((prev) => Math.min(100, prev + 10));
      setFuelErrorMsg('Incorrect fuel code. Damage sustained!');
      setAttempts((prev) => prev + 1); // Increment attempts on wrong code
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
    <div className="h-screen w-screen bg-black text-green-400 font-mono overflow-hidden relative">
      <div className="scanline"></div>
        <div className="fixed inset-0 w-screen h-screen pt-8">
          <ControlConsole
            timeLeft={formatTime(timeLeft)}
            fuelLevel={fuelLevel}
            gameState={gameState}
            damageLevel={damageLevel}
            onShowFuelEntry={() => { setFuelErrorMsg(undefined); setShowFuelEntry(true); }}
          />
          {gameState === 'gameOver' && (
            <div className="absolute inset-0 flex items-center justify-center z-40">
              <div className="bg-red-900/30 backdrop-blur-sm border-2 border-red-500 text-red-300 px-8 py-6 rounded-lg text-center">
                <div className="text-4xl font-bold mb-4 animate-pulse">
                  {fuelLevel <= 0 ? 'NO FUEL REMAINING' : 'CRITICAL DAMAGE'}
                </div>
                <div className="text-2xl">MISSION FAILED</div>
              </div>
            </div>
          )}
          {gameState === 'escaped' && (
            <div className="absolute inset-0 flex items-center justify-center z-40">
              <div className="bg-green-900/30 backdrop-blur-sm border-2 border-green-500 text-green-300 px-8 py-6 rounded-lg text-center">
                <div className="text-4xl font-bold mb-4 animate-pulse">MISSION ACCOMPLISHED</div>
                <div className="text-2xl">TIME REMAINING: {formatTime(timeLeft)}</div>
              </div>
            </div>
          )}
        </div>

        {/* QR Code Selection */}
        <div className="mt-8 text-center">
          <div className="text-lg text-green-300 mb-4">SELECT QR CODE TO SCAN</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => window.open('/qr_1', '_blank')}
              className="bg-green-900 hover:bg-green-800 border border-green-500 px-4 py-3 rounded text-green-400 font-bold transition-colors"
            >
              QR #1
            </button>
            <button
              onClick={() => window.open('/qr_2', '_blank')}
              className="bg-green-900 hover:bg-green-800 border border-green-500 px-4 py-3 rounded text-green-400 font-bold transition-colors"
            >
              QR #2
            </button>
            <button
              onClick={() => window.open('/qr_3', '_blank')}
              className="bg-green-900 hover:bg-green-800 border border-green-500 px-4 py-3 rounded text-green-400 font-bold transition-colors"
            >
              QR #3
            </button>
            <button
              onClick={() => window.open('/qr_4', '_blank')}
              className="bg-green-900 hover:bg-green-800 border border-green-500 px-4 py-3 rounded text-green-400 font-bold transition-colors"
            >
              QR #4
            </button>
          </div>
        </div>

        {/* Warning overlay */}
        {gameState === 'warning' && (
          <FuelWarning
            timeLeft={formatTime(timeLeft)}
            onShowFuelEntry={() => { setFuelErrorMsg(undefined); setShowFuelEntry(true); }}
          />
        )}

        {/* Transmission panel */}
        {showTransmission && (
          <TransmissionPanel onClose={() => setShowTransmission(false)} />
        )}

        {/* Fuel code entry */}
        {showFuelEntry && (
          <FuelCodeEntry
            onSubmit={handleFuelCodeSubmit}
            errorMessage={fuelErrorMsg}
            onClose={() => { setFuelErrorMsg(undefined); setShowFuelEntry(false); }}
            attempts={attempts}
            setAttempts={setAttempts}
          />
        )}

        {/* Periodic warning overlay */}
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