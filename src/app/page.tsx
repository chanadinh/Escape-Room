'use client';

import { useState, useEffect } from 'react';
import ControlConsole from '@/components/ControlConsole';
// FuelWarning removed from UI
import TransmissionPanel from '@/components/TransmissionPanel';
import FuelCodeEntry from '@/components/FuelCodeEntry';
// QROverlay removed from UI

export default function Home() {
  const [gameState, setGameState] = useState<'prestart' | 'running' | 'warning' | 'gameOver' | 'escaped'>('prestart');
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [fuelLevel, setFuelLevel] = useState(100);
  const [showTransmission, setShowTransmission] = useState(false);
  const [showFuelEntry, setShowFuelEntry] = useState(false);
  // const [showQR, setShowQR] = useState(false); // removed from UI
  const [damageLevel, setDamageLevel] = useState(0);
  const [fuelErrorMsg, setFuelErrorMsg] = useState<string | undefined>(undefined);
  const [attempts, setAttempts] = useState(0);
  const [periodicWarning, setPeriodicWarning] = useState(false);
  const [warningText, setWarningText] = useState('WARNING');
  const [warningShowTime, setWarningShowTime] = useState(false);
  const [lastQRScanTime, setLastQRScanTime] = useState<Date | null>(null);
  const [tenMinuteReminderShown, setTenMinuteReminderShown] = useState(false);
  const [fiveMinuteReminderShown, setFiveMinuteReminderShown] = useState(false);
  const [showIncomingTransmission, setShowIncomingTransmission] = useState(false);
  const fuelCodeFromEnv = (process.env.NEXT_PUBLIC_FUEL_CODE || 'RM94').toUpperCase();

  // Delay start by 2 minutes before showing timer/countdown
  useEffect(() => {
    let overlayTimeout: ReturnType<typeof setTimeout> | undefined;
    const startTimeout = setTimeout(() => {
      // Show 20s full-screen warning first
      setWarningText('WARNING: FUEL LEVELS GETTING LOW');
      setWarningShowTime(false);
      setPeriodicWarning(true);
      try {
        const startMsgAudio = new Audio('/sounds/1 - Starting message.mp3');
        startMsgAudio.volume = 0.8;
        startMsgAudio.play().catch(() => {});
      } catch {}

      // After 20s, hide warning and start timer by switching to running
      overlayTimeout = setTimeout(() => {
        setPeriodicWarning(false);
        setGameState('running');
      }, 20000);
    }, 2 * 60 * 1000);
    return () => {
      clearTimeout(startTimeout);
      if (overlayTimeout) clearTimeout(overlayTimeout);
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (gameState === 'running') {
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

  // Background music removed per requirements

  // Fuel level decreases over time
  useEffect(() => {
    if (gameState === 'running' || gameState === 'warning') {
      const fuelTimer = setInterval(() => {
        setFuelLevel((prev) => {
          const newLevel = prev - (100 / (15 * 60)); // Decrease over 15 minutes
          return Math.max(0, newLevel);
        });
      }, 1000);

      return () => clearInterval(fuelTimer);
    }
  }, [gameState]);

  // Removed initial 5s warning overlay so the fuel warning occurs at 2:00

  // Timed WARNING overlays at 10:00 and 5:00 remaining (no audio), show remaining time
  useEffect(() => {
    if (gameState !== 'running') return;

    if (!tenMinuteReminderShown && timeLeft === 10 * 60) {
      setWarningText('WARNING');
      setWarningShowTime(true);
      setPeriodicWarning(true);
      try {
        const tenMinAudio = new Audio('/sounds/2 - 10 Minute reminder.mp3');
        tenMinAudio.volume = 0.8;
        tenMinAudio.play().catch(() => {});
      } catch {}
      setTenMinuteReminderShown(true);
      setTimeout(() => setPeriodicWarning(false), 20000);
    }

    if (!fiveMinuteReminderShown && timeLeft === 5 * 60) {
      setWarningText('WARNING');
      setWarningShowTime(true);
      setPeriodicWarning(true);
      try {
        const fiveMinAudio = new Audio('/sounds/3 - 5 Minute reminder.mp3');
        fiveMinAudio.volume = 0.8;
        fiveMinAudio.play().catch(() => {});
      } catch {}
      setFiveMinuteReminderShown(true);
      setTimeout(() => setPeriodicWarning(false), 20000);
    }
  }, [timeLeft, gameState, tenMinuteReminderShown, fiveMinuteReminderShown]);

  // Removed old periodic 5-minute warning with audio

  // Play win sound and stop warning sounds when game is won
  useEffect(() => {
    if (gameState === 'escaped') {
      // Stop any playing warning sounds
      setPeriodicWarning(false);

      // Play win sound
      try {
        const winAudio = new Audio('/sounds/6 - Mission Success.mp3');
        winAudio.volume = 0.8;
        winAudio.play().catch(() => {});
      } catch (error) {
        console.log('Could not play win sound:', error);
      }
    }
  }, [gameState]);

  // Play mission failure audio and persist failure graphic until refresh
  useEffect(() => {
    if (gameState === 'gameOver') {
      setPeriodicWarning(false);
      try {
        const failAudio = new Audio('/sounds/4 - Mission Failure.mp3');
        failAudio.volume = 0.8;
        failAudio.play().catch(() => {});
      } catch {}
    }
  }, [gameState]);

  // Poll for QR scans and trigger fuel entry modal
  useEffect(() => {
    if (gameState === 'gameOver' || gameState === 'escaped') return;

    const pollQRScans = async () => {
      try {
        // Check for recent QR scans from all QR codes (last 10 seconds)
        const qrCodes = ['qr_3'];
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

        // If we found a new scan that is recent (<= 10s) and newer than the last seen
        const isRecent = latestScanTime && (Date.now() - latestScanTime.getTime()) <= 10000;
        if (latestScan && latestScanTime && isRecent && (!lastQRScanTime || latestScanTime > lastQRScanTime)) {
          setLastQRScanTime(latestScanTime);

          // Trigger fuel entry modal
          setFuelErrorMsg(undefined);
          setShowFuelEntry(true);

          // Show incoming transmission overlay and play Morse Code audio
          setShowIncomingTransmission(true);
          try {
            const morseAudio = new Audio('/sounds/5 - Morse Code.mp3');
            morseAudio.volume = 0.8;
            morseAudio.play().catch(() => {});
          } catch {}
          // Auto-hide overlay after 3 seconds
          setTimeout(() => setShowIncomingTransmission(false), 3000);

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
            hideTimer={gameState === 'prestart'}
            onShowFuelEntry={() => { setFuelErrorMsg(undefined); setShowFuelEntry(true); }}
          />
          {gameState === 'gameOver' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-900/80 backdrop-blur-sm pointer-events-none">
              <div className="text-red-100 text-6xl md:text-7xl font-extrabold text-center animate-pulse">
                MISSION FAILED
                <div className="mt-4 text-2xl md:text-3xl">
                  {fuelLevel <= 0 ? 'NO FUEL REMAINING' : 'CRITICAL DAMAGE'}
                </div>
              </div>
            </div>
          )}
          {gameState === 'escaped' && (
            <div className="fixed inset-0 z-50">
              <img src="/globe.svg" alt="Mission Success" className="w-full h-full object-cover opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-green-200 text-6xl md:text-7xl font-extrabold text-center animate-pulse drop-shadow">
                  MISSION SUCCESS
                  <div className="mt-4 text-2xl md:text-3xl">TIME REMAINING: {formatTime(timeLeft)}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        

        {/* FuelWarning overlay removed */}

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
          />
        )}

        {/* Incoming transmission overlay (triggered by QR scan) */}
        {showIncomingTransmission && (
          <div className="fixed inset-0 z-50">
            <img src="/tranmission.PNG" alt="Incoming Transmission" className="w-full h-full object-cover pointer-events-none" />
          </div>
        )}

        {/* Periodic warning overlay */}
        {periodicWarning && (
          <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center bg-red-900/70 backdrop-blur-sm animate-pulse">
            <div className="text-red-200 text-6xl md:text-7xl font-extrabold text-center drop-shadow">
              {warningText}
              {warningShowTime && (
                <div className="mt-4 text-3xl md:text-4xl font-mono text-red-100">TIME REMAINING: {formatTime(timeLeft)}</div>
              )}
            </div>
          </div>
        )}
      
      {/* Background music removed */}
    </div>
  );
}