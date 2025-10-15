'use client';

export default function NavigationDials() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-28 h-28 rounded-full bg-cyan-500 flex items-center justify-center border-4 border-yellow-500">
        <div className="w-10 h-10 border-2 border-black rotate-45" />
      </div>
      <div className="w-28 h-28 rounded-full bg-cyan-500 flex items-center justify-center border-4 border-yellow-500">
        <div className="w-16 h-16 rounded-full border-4 border-black" />
      </div>
      <div className="text-[10px] text-yellow-300 tracking-widest">NAVIGATION</div>
    </div>
  );
}


