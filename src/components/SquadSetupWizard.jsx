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
  const [step, setStep] = useState(1); // 1 = Ev Sahibi Taktik, 2 = Deplasman Taktik

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Wizard İlerleme Çubuğu */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center justify-between">
        
        {/* Oyuncu Seçim Ekranına Dön Butonu */}
        <button
          onClick={onBackToDraftScreen}
          className="text-xs text-slate-400 hover:text-emerald-400 font-mono font-bold flex items-center gap-1.5 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 hover:border-slate-700 transition-all"
        >
          <Search size={14} />
          <span>🔍 Oyuncu Seçim Ekranı</span>
        </button>

        {/* Adım 1 & Adım 2 Göstergesi */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base font-mono ${
              step === 1 ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-900/50' : 'bg-slate-800 text-emerald-400'
            }`}>
              1
            </div>
            <span className={`text-xs font-extrabold ${step === 1 ? 'text-white' : 'text-slate-400'}`}>
              {homeTeam.name || "1. Takım"} Taktiği
            </span>
          </div>

          <div className="w-12 h-0.5 bg-slate-800 hidden sm:block"></div>

          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base font-mono ${
              step === 2 ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-900/50' : 'bg-slate-800 text-emerald-400'
            }`}>
              2
            </div>
            <span className={`text-xs font-extrabold ${step === 2 ? 'text-white' : 'text-slate-400'}`}>
              {awayTeam.name || "2. Takım"} Taktiği
            </span>
          </div>
        </div>

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

          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-8 py-3.5 rounded-xl shadow-xl shadow-emerald-950 flex items-center gap-3 transition-all text-base hover:scale-105"
            >
              <span>2. Adıma Geç ({awayTeam.name || "2. Takım"} Taktiği)</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: DEPLASMAN TAKIMI TAKTİĞİ */}
      {step === 2 && (
        <div className="space-y-6">
          <TacticalPitchBoard
            team={awayTeam}
            type="away"
            onUpdateFormation={(fmt) => onUpdateFormation('away', fmt)}
            onSwapSquadPlayers={onSwapSquadPlayers}
          />

          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold px-6 py-3 rounded-xl border border-slate-800 flex items-center gap-2 transition-all text-sm"
            >
              <ArrowLeft size={18} />
              <span>Geri (1. Adım)</span>
            </button>

            <button
              onClick={onStartMatch}
              className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black px-10 py-4 rounded-xl shadow-2xl shadow-emerald-950 flex items-center gap-3 transition-all text-lg hover:scale-105"
            >
              <Play size={22} fill="currentColor" />
              <span>⚽ MAÇI BAŞLAT VE SİMÜLE ET</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
