'use client';

import QRCode from 'react-qr-code';

interface QROverlayProps {
  value: string;
  onClose: () => void;
}

export default function QROverlay({ value, onClose }: QROverlayProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-green-500 rounded-lg p-8 text-center shadow-2xl">
        <div className="text-2xl font-bold text-green-400 mb-4">SCAN THIS CODE</div>
        <div className="bg-white p-4 inline-block">
          <QRCode value={value} size={256} fgColor="#000000" bgColor="#ffffff" />
        </div>
        <div className="mt-4 text-green-300">
          Scan to open the incoming transmission on your device.
        </div>
        <button
          onClick={onClose}
          className="mt-6 bg-gray-700 hover:bg-gray-600 border border-gray-500 px-6 py-3 rounded text-gray-200 font-bold"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
}


