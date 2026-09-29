import React, { useState, useEffect } from "react";
import { Sparkles, Cpu } from "lucide-react";

const LOADING_STEPS = [
  "Oyuncu form durumları ve maç temposu senkronize ediliyor...",
  "Taktiksel eşleşmeler ve pres stratejileri simüle ediliyor...",
  "Hakem kararları ve stadyum atmosfer parametreleri ayarlanıyor...",
  "Canlı spiker anlatım akışı ve istatistik paneli hazırlandı!",
  "İlk düdük için takımlar tünelde...",
];

export default function AiSimulatingLoader({
  isVisible,
  homeTeamName,
  awayTeamName,
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(2);

  useEffect(() => {
    if (!isVisible) {
      setProgress(2);
      setCurrentStepIndex(0);
      return;
    }

    // Progress bar ve ticker döngüsü
    const interval1 = setInterval(() => {
      setProgress((prev) => (prev < 92 ? prev + 11 : 98));
    }, 2200);

    const interval2 = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 5500);

    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#060c1a]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center select-none animate-fadeIn stadium-bg">
      {/* Background Grid Pattern Overlay */}
      <div className="absolute inset-0 pitch-grid pointer-events-none opacity-40"></div>

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center">
        {/* CENTRAL TACTICAL RADAR BADGE (Stitch Design Radar) */}
        <div className="relative mb-8 group">
          {/* Glow Aura */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-sky-500/30 via-indigo-500/20 to-amber-500/30 rounded-3xl blur-2xl animate-pulse"></div>

          {/* Outer Glass Badge Shell */}
          <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-b from-[#0b1329] to-[#081024] p-[1.5px] shadow-2xl border border-sky-400/40">
            <div className="w-full h-full bg-gradient-to-b from-[#0b1329]/90 via-[#060c1a]/90 to-[#030712]/95 rounded-[22px] flex items-center justify-center overflow-hidden relative">
              {/* Radar Sweep Line Animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border border-sky-500/20"></div>
                <div className="absolute w-16 h-16 rounded-full border border-dashed border-sky-400/20"></div>
                <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(56,189,248,0.25)_360deg)] animate-spin rounded-full"></div>
              </div>

              {/* Central Pitch SVG Representation */}
              <div className="relative z-10 text-sky-400">
                <svg
                  className="w-12 h-12 drop-shadow-[0_0_12px_rgba(56,189,248,0.6)]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <rect height="16" rx="2" width="20" x="2" y="4"></rect>
                  <line x1="12" x2="12" y1="4" y2="20"></line>
                  <circle cx="12" cy="12" r="3.5"></circle>
                  <path d="M2 9a3 3 0 0 1 3-3"></path>
                  <path d="M2 15a3 3 0 0 0 3 3"></path>
                  <path d="M22 9a3 3 0 0 0-3-3"></path>
                  <path d="M22 15a3 3 0 0 1-3 3"></path>
                </svg>
              </div>

              {/* Sparkle Amber Accent Badge */}
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#f59e0b] flex items-center justify-center shadow-lg shadow-[#f59e0b]/50">
                <Sparkles size={13} className="text-[#050811] fill-current" />
              </div>
            </div>
          </div>
        </div>

        {/* MAIN HEADING SECTION */}
        <div className="my-5 w-full">
          {/* Top Engine Badge */}
          <div className="mb-3">
            <span className="inline-block text-xs font-mono font-bold tracking-widest text-[#38bdf8] uppercase bg-[#38bdf8]/10 border border-[#38bdf8]/30 px-3.5 py-1.5 rounded-full shadow-sm">
              ChatGPT OpenAI GPT-4o Engine
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl md:text-5xl font-['Barlow_Condensed'] font-extrabold tracking-wide uppercase text-white drop-shadow-[0_0_24px_rgba(56,189,248,0.35)] leading-tight my-4">
            MAÇ BAŞLAMAK ÜZERE
          </h1>

          {/* Teams Matchup Subtitle */}
          <div className="space-y-2 my-4">
            <div className="flex items-center justify-center gap-2.5 text-lg font-extrabold">
              <span className="text-rose-400 font-['Barlow_Condensed'] tracking-wider text-xl">
                {homeTeamName || "1. Takım"}
              </span>
              <span className="text-slate-400 italic font-['Barlow_Condensed'] text-xl px-1">
                VS
              </span>
              <span className="text-amber-400 font-['Barlow_Condensed'] tracking-wider text-xl">
                {awayTeamName || "2. Takım"}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono max-w-md mx-auto leading-relaxed pt-1">
              Takım kadroları, taktiksel formasyonlar ve maç motoru senkronize
              ediliyor...
            </p>
          </div>
        </div>

        {/* PROGRESS BAR CONTAINER */}
        <div className="w-full max-w-md my-5 px-2">
          <div className="flex justify-between items-center text-xs font-['Barlow_Condensed'] font-bold mb-2 uppercase tracking-wider">
            <span className="text-slate-400 flex items-center gap-1.5 font-mono">
              <Cpu size={14} className="text-sky-400 animate-spin" />
              Veri Akışı İşleniyor
            </span>
            <span className="text-amber-400 text-sm font-mono font-extrabold tracking-wider">
              {progress}%
            </span>
          </div>

          {/* Outer Progress Track */}
          <div className="relative h-2.5 w-full bg-[#030712]/80 rounded-full p-0.5 overflow-hidden border border-white/10 shadow-inner">
            {/* Active Progress Bar with Gradient & Shimmer */}
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#f59e0b] via-[#38bdf8] to-[#0ea5e9] relative transition-all duration-500 ease-out shadow-[0_0_15px_rgba(56,189,248,0.5)]"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer Light Flare */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-full h-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* DYNAMIC STATUS STEP TICKER */}
        <div className="mt-5 flex items-center justify-center space-x-2 text-xs md:text-sm text-slate-300 font-medium bg-[#0b1329]/80 border border-white/10 px-6 py-3 rounded-xl backdrop-blur-md shadow-lg">
          <span className="text-sky-400">⚡</span>
          <span className="text-slate-200 tracking-wide font-sans transition-opacity duration-300">
            {LOADING_STEPS[currentStepIndex]}
          </span>
        </div>
      </div>
    </div>
  );
}
