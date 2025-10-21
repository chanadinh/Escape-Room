'use client';

import { useState, useRef, useEffect } from 'react';

interface FuelCodeEntryProps {
  onSubmit: (code: string) => void;
  onClose: () => void;
  errorMessage?: string;
  attempts: number;
}

export default function FuelCodeEntry({ onSubmit, onClose, errorMessage, attempts }: FuelCodeEntryProps) {
  const [code, setCode] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (code.length === 4) {
      onSubmit(code);
    }
  };

  // Attempts are now managed in the parent component

  const playKeySound = () => {
    const audio = new Audio('/sounds/key-beep.mp3');
    audio.play().catch(() => {});
      
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    if (value.length <= 4) {
      setCode(value);
      playKeySound();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-green-500 rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400 mb-6">
            FUEL REFILL PROTOCOL
          </div>
          
          <div className="bg-black border border-green-500 p-6 rounded mb-6">
            <div className="text-green-300 mb-4">
              Enter 4-character fuel code:
            </div>
            
            <form onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                type="text"
                value={code}
                onChange={handleInputChange}
                maxLength={4}
                className="w-full text-center text-3xl font-mono bg-black border-2 border-green-500 rounded p-4 text-green-400 focus:border-green-300 focus:outline-none tracking-widest"
                placeholder="____"
              />
              
              <div className="mt-4 text-sm text-green-300">
                Attempts: {attempts}
              </div>
            {errorMessage && (
              <div className="mt-3 text-sm text-red-400">{errorMessage}</div>
            )}
            </form>
          </div>
          
          
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleSubmit()}
              disabled={code.length !== 4}
              className="bg-green-700 hover:bg-green-600 disabled:bg-gray-600 border border-green-500 px-6 py-3 rounded text-green-100 font-bold transition-colors disabled:cursor-not-allowed"
            >
              SUBMIT CODE
            </button>
            
            <button
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 border border-gray-500 px-6 py-3 rounded text-gray-200 font-bold transition-colors"
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

