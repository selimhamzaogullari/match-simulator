import React, { useState } from 'react';
import TacticalPitchBoard from './TacticalPitchBoard';
import { ArrowRight, ArrowLeft, Play, Search } from 'lucide-react';

export default function SquadSetupWizard({
  homeTeam,
  awayTeam,
  onUpdateFormation,
  onSwapSquadPlayers,
  onBackToDraftScreen,
  onStartMatch
}) {
  const [step, setStep] = useState(1); // 1 = 1. Takım Taktik, 2 = 2. Takım Taktik

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* WIZARD STEPPER BAR (Stitch Design Header Stepper) */}
      <div className="bg-[#0c1322]/80 border border-slate-800/80 rounded-2xl p-3 px-5 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 shadow-xl">
        
        {/* Oyuncu Seçim Ekranına Dön Butonu */}
        <button
          onClick={onBackToDraftScreen}
          type="button"
          className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#11192b]/90 hover:bg-[#1c273e]/80 text-slate-300 hover:text-white border border-slate-700/60 transition-all text-xs font-semibold tracking-wide cursor-pointer font-sans"
        >
          <Search size={14} className="text-[#38bdf8]" />
          <span>Kadro Kurulumuna Dön</span>
        </button>

        {/* Tactical Stepper Navigation */}
        <nav aria-label="Aşama Takibi" className="flex items-center gap-3">
          {/* Step 1: 1. Takım */}
          <div 
            onClick={() => setStep(1)}
            className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-full cursor-pointer transition-all ${
              step === 1 
                ? 'bg-[#10b981]/15 border border-[#10b981]/40 text-[#10b981] font-semibold text-xs shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                : 'bg-[#11192b]/60 border border-slate-800 text-slate-400 font-medium text-xs hover:text-white'
            }`}
          >
            <span className={`w-5 h-5 rounded-full font-bold flex items-center justify-center text-[11px] ${
              step === 1 ? 'bg-[#10b981] text-[#050811]' : 'bg-slate-700 text-slate-300'
            }`}>1</span>
            <span className="tracking-wide">{homeTeam.name || "1. Takım"} Taktiği</span>
          </div>

          {/* Divider line */}
          <div className="w-6 h-[2px] bg-slate-700/70 rounded-full"></div>

          {/* Step 2: 2. Takım */}
          <div 
            onClick={() => setStep(2)}
            className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-full cursor-pointer transition-all ${
              step === 2 
                ? 'bg-[#10b981]/15 border border-[#10b981]/40 text-[#10b981] font-semibold text-xs shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                : 'bg-[#11192b]/60 border border-slate-800 text-slate-400 font-medium text-xs hover:text-white'
            }`}
          >
            <span className={`w-5 h-5 rounded-full font-bold flex items-center justify-center text-[11px] ${
              step === 2 ? 'bg-[#10b981] text-[#050811]' : 'bg-slate-700 text-slate-300'
            }`}>2</span>
            <span className="tracking-wide">{awayTeam.name || "2. Takım"} Taktiği</span>
          </div>
        </nav>

      </div>

      {/* STEP 1: 1. TAKIM TAKTİĞİ */}
      {step === 1 && (
        <div className="space-y-6">
          <TacticalPitchBoard
            team={homeTeam}
            type="home"
            onUpdateFormation={(fmt) => onUpdateFormation('home', fmt)}
            onSwapSquadPlayers={onSwapSquadPlayers}
          />

          <footer className="flex items-center justify-between py-2 font-sans">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10b981]"></span>
              </span>
              <span>1. Takım Taktik Hazır: <strong className="text-[#10b981] font-mono">{homeTeam.formation || "4-4-2"}</strong> (11 Oyuncu Seçili)</span>
            </div>

            <button
              onClick={() => setStep(2)}
              type="button"
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] text-[#050811] font-['Barlow_Condensed'] font-extrabold text-base md:text-lg tracking-wide uppercase transition-all shadow-[0_10px_30px_rgba(16,185,129,0.35)] hover:scale-105 cursor-pointer"
            >
              <span>2. Adıma Geç ({awayTeam.name || "2. Takım"} Taktiği)</span>
              <ArrowRight size={20} />
            </button>
          </footer>
        </div>
      )}

      {/* STEP 2: 2. TAKIM TAKTİĞİ */}
      {step === 2 && (
        <div className="space-y-6">
          <TacticalPitchBoard
            team={awayTeam}
            type="away"
            onUpdateFormation={(fmt) => onUpdateFormation('away', fmt)}
            onSwapSquadPlayers={onSwapSquadPlayers}
          />

          <footer className="flex flex-wrap items-center justify-between gap-4 py-2 font-sans">
            <button
              onClick={() => setStep(1)}
              type="button"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#090e1a] hover:bg-[#11192b] text-slate-300 hover:text-white border border-[#1f2d47] font-semibold text-xs transition-all cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Geri (1. Takım Taktiği)</span>
            </button>

            <button
              onClick={onStartMatch}
              type="button"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-gradient-to-r from-[#10b981] via-[#00f59b] to-[#10b981] hover:from-[#34d399] hover:to-[#00f59b] text-[#050811] font-['Barlow_Condensed'] font-extrabold text-lg md:text-xl uppercase tracking-wider transition-all shadow-[0_10px_35px_rgba(16,185,129,0.5)] hover:scale-105 cursor-pointer"
            >
              <Play size={22} fill="currentColor" />
              <span>⚽ MAÇI BAŞLAT VE SİMÜLE ET</span>
            </button>
          </footer>
        </div>
      )}

    </div>
  );
}
