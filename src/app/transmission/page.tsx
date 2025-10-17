'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function TransmissionContent() {
  const searchParams = useSearchParams();
  const qrSource = searchParams.get('from');
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
    }, 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-gray-900 border-2 border-green-500 rounded-lg p-8 text-center">
        <div className="text-3xl font-bold glow-text mb-2">TRANSMISSION INCOMING</div>
        {qrSource && (
          <div className="text-green-300 mb-2">Source: {qrSource.toUpperCase()}</div>
        )}
        <div className="text-green-300 mb-6">Decoding encrypted message... (Morse)</div>

        <div className="bg-black border border-green-500 rounded p-6 text-left mb-6">
          <div className="text-green-400 leading-7">
            ... --- ... / ... --- ...<br/>
            .-.. --- ...- . / -.-- --- ..-<br/>
            .... .- ...- . / ..-. ..- -. / .. -. / - .... . / . ... -.-. .- .--. . / .-. --- --- --
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={() => {
              if (!audioRef.current) return;
              audioRef.current.currentTime = 0;
              audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
            }}
            className="bg-green-700 hover:bg-green-600 border border-green-500 px-6 py-3 rounded text-green-100 font-bold"
          >
            {isPlaying ? 'REPLAY (PLAYING...)' : 'PLAY / REPLAY'}
          </button>
          <button
            onClick={() => {
              if (!audioRef.current) return;
              audioRef.current.pause();
              setIsPlaying(false);
            }}
            className="bg-gray-700 hover:bg-gray-600 border border-gray-500 px-6 py-3 rounded text-gray-200 font-bold"
          >
            STOP
          </button>
        </div>

        <audio ref={audioRef} onEnded={() => setIsPlaying(false)} preload="auto">
          <source src="/sounds/morse-code.wav" type="audio/wav" />
          <source src="/sounds/morse-code.mp3" type="audio/mpeg" />
        </audio>

        <div className="text-sm text-green-300">Scan the QR code in the room to land here any time and replay.</div>
      </div>
    </div>
  );
}

export default function TransmissionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">Loading...</div>}>
      <TransmissionContent />
    </Suspense>
  );
}
