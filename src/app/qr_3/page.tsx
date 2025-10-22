'use client';

import { useEffect } from 'react';

export default function QR3Page() {
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
            qrCode: 'qr_3',
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
      <div className="text-center">
        <img src="/tranmsision_incoming.png" alt="Transmission Incoming" className="mx-auto w-full max-w-2xl h-auto" />
      </div>
    </div>
  );
}
