'use client';

import QRCode from 'react-qr-code';

export default function QRPage() {
  const url = typeof window !== 'undefined' ? window.location.origin + '/transmission' : '/transmission';

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center p-6">
      <div className="bg-gray-900 border-2 border-green-500 rounded-lg p-8 text-center">
        <div className="text-2xl font-bold mb-4">TRANSMISSION QR</div>
        <div className="bg-white p-4 inline-block">
          <QRCode value={url} size={256} fgColor="#000000" bgColor="#ffffff" />
        </div>
        <div className="mt-4 text-green-300">Scan to open the incoming transmission page.</div>
        <button
          onClick={() => window.print()}
          className="mt-6 bg-green-700 hover:bg-green-600 border border-green-500 px-6 py-3 rounded text-green-100 font-bold"
        >
          Print QR
        </button>
      </div>
    </div>
  );
}



