'use client';

import { useState, useRef, useEffect } from 'react';

interface TransmissionPanelProps {
  onClose: () => void;
}

export default function TransmissionPanel({ onClose }: TransmissionPanelProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playMorseCode = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  };

  const stopMorseCode = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    // Auto-play the transmission when panel opens
    const timer = setTimeout(() => {
      playMorseCode();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-green-500 rounded-lg p-8 max-w-2xl w-full mx-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-green-400 mb-4 animate-pulse">
            TRANSMISSION INCOMING
          </div>
          
          <div className="bg-black border border-green-500 p-6 rounded mb-6">
            <div className="text-green-300 mb-4">
              Decoding encrypted message...
            </div>
            
            <div className="text-green-400 font-mono text-lg">
              ... --- ... / ... --- ...<br/>
              .-.. --- ...- . / -.-- --- ..-<br/>
              .... .- ...- . / ..-. ..- -. / .. -. / - .... . / . ... -.-. .- .--. . / .-. --- --- --<br/>
              <br/>
              - .... . / ..-. ..- . .-.. / -.-. --- -.. . / .. ... / ..-. ..- . .-.. / ... -.-. .. . -. -.-. .
            </div>
          </div>
          
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={playMorseCode}
              disabled={isPlaying}
              className="bg-green-700 hover:bg-green-600 disabled:bg-gray-600 border border-green-500 px-6 py-3 rounded text-green-100 font-bold transition-colors"
            >
              {isPlaying ? 'PLAYING...' : 'PLAY TRANSMISSION'}
            </button>
            
            <button
              onClick={stopMorseCode}
              className="bg-red-700 hover:bg-red-600 border border-red-500 px-6 py-3 rounded text-red-100 font-bold transition-colors"
            >
              STOP
            </button>
          </div>
          
          <audio ref={audioRef} preload="auto" onEnded={() => setIsPlaying(false)}>
            <source src="/sounds/morse-code.mp3" type="audio/mpeg" />
          </audio>
          
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 border border-gray-500 px-6 py-3 rounded text-gray-200 font-bold transition-colors"
          >
            CLOSE TRANSMISSION
          </button>
        </div>
      </div>
    </div>
  );
}

