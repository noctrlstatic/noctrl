"use client";

export default function CountdownTimer({ countdown }) {
  const units = [
    { label: "Days", value: countdown.d },
    { label: "Hours", value: countdown.h },
    { label: "Mins", value: countdown.m },
    { label: "Secs", value: countdown.s },
  ];

  return (
    <section id="countdown" className="py-20 bg-[#0a0a0a] text-center border-y border-white/[0.03]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-[#d4c5a9] mb-4">
          Next Drop In
        </div>
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(2rem,5vw,3rem)] text-white mb-10">
          DROP 002 — Limited Edition
        </h2>
        <div className="flex justify-center gap-4 sm:gap-8">
          {units.map((unit, i) => (
            <div key={unit.label} className="flex items-center gap-4 sm:gap-8">
              <div className="flex flex-col items-center">
                <div className="font-[family-name:var(--font-display)] text-[clamp(2.5rem,6vw,4rem)] text-white leading-none bg-[#111] px-5 py-4 sm:px-7 sm:py-5 rounded-xl border border-white/[0.04] min-w-[70px] sm:min-w-[90px]">
                  {unit.value}
                </div>
                <span className="text-[0.55rem] font-semibold tracking-[0.1em] uppercase text-gray-500 mt-2">
                  {unit.label}
                </span>
              </div>
              {i < 3 && (
                <span className="font-[family-name:var(--font-display)] text-[clamp(2rem,5vw,3rem)] text-[#d4c5a9] leading-none pt-4 hidden sm:block">
                  :
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
