'use client';

import QRCode from 'react-qr-code';
import { useEffect } from 'react';

export default function QR4Page() {
  const url = typeof window !== 'undefined' ? window.location.href : `${process.env.NEXT_PUBLIC_BASE_URL || 'https://escape-room-lemon.vercel.app'}/qr_4`;

  useEffect(() => {
    // Log QR scan when page loads
    const logQRScan = async () => {
      try {
        await fetch('/api/qr-scan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            qrCode: 'qr_4',
            ipAddress: 'unknown', // Will be set by server
            userAgent: navigator.userAgent,
            sessionId: 'unknown' // Will be set by server
          }),
        });
      } catch (error) {
        console.error('Failed to log QR scan:', error);
      }
    };

    logQRScan();
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center p-6">
      <div className="bg-gray-900 border-2 border-green-500 rounded-lg p-8 text-center">
        <div className="text-2xl font-bold mb-4">QR CODE #4</div>
        <div className="bg-white p-4 inline-block">
          <QRCode value={url} size={256} fgColor="#000000" bgColor="#ffffff" />
        </div>
        <div className="mt-4 text-green-300">This QR code contains the transmission data for your escape room mission.</div>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => window.print()}
            className="bg-green-700 hover:bg-green-600 border border-green-500 px-6 py-3 rounded text-green-100 font-bold transition-colors"
          >
            Print QR #4
          </button>
          <button
            onClick={() => {
              const canvas = document.querySelector('canvas');
              if (canvas) {
                const link = document.createElement('a');
                link.download = 'qr-code-4.png';
                link.href = canvas.toDataURL();
                link.click();
              }
            }}
            className="bg-blue-700 hover:bg-blue-600 border border-blue-500 px-6 py-3 rounded text-blue-100 font-bold transition-colors"
          >
            Download PNG
          </button>
        </div>
      </div>
    </div>
  );
}
