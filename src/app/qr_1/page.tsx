'use client';

export default function QR1Page() {
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center p-6">
      <div className="text-center">
        <img src="/pagenotfound.png" alt="Page not found" className="mx-auto w-64 h-auto opacity-80" />
        <div className="mt-4 text-2xl">page not found</div>
      </div>
    </div>
  );
}
