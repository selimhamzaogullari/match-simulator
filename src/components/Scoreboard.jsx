import React from 'react';
import { Play, Pause, FastForward, RotateCcw, Zap } from 'lucide-react';

export default function Scoreboard({
  homeTeam,
  awayTeam,
  homeScore = 0,
  awayScore = 0,
  isPlaying,
  matchTime,
  simSpeed,
  onTogglePlay,
  onChangeSpeed,
  onResetMatch,
  onInstantFinish
}) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isFinished = matchTime >= 5400; // 90 min (90 * 60 = 5400 sec)

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-xl mb-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Ev Sahibi Takım */}
        <div className="flex items-center gap-3 w-full md:w-1/3 justify-start">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black shadow-md border-2 border-slate-700/50"
            style={{ backgroundColor: homeTeam.primaryColor, color: homeTeam.secondaryColor }}
          >
            {homeTeam.logoText || "⚽"}
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white tracking-wide">{homeTeam.name}</h2>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-mono font-semibold">EV SAHİBİ</span>
              <span>{homeTeam.formation || "4-4-2"}</span>
            </div>
          </div>
        </div>

        {/* Canlı Skor & Sayaç (CM 03/04 Score Display) */}
        <div className="flex flex-col items-center justify-center w-full md:w-1/3 my-2 md:my-0">
          <div className="flex items-center gap-4 bg-slate-900 px-6 py-2 rounded-2xl border border-slate-800 shadow-inner">
            <span className="text-4xl md:text-5xl font-black text-white font-mono">
              {homeScore}
            </span>
            <span className="text-slate-600 text-2xl font-bold">:</span>
            <span className="text-4xl md:text-5xl font-black text-white font-mono">
              {awayScore}
            </span>
          </div>

          {/* Maç Dakikası */}
          <div className="mt-2 flex items-center gap-2 font-mono">
            {isFinished ? (
              <span className="px-3 py-1 bg-amber-500/20 text-amber-400 font-bold text-xs rounded-full border border-amber-500/40">
                MAÇ BİTTİ (90:00)
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`}></span>
                <span className="text-sm font-bold text-emerald-400">
                  {formatTime(matchTime)}
                </span>
                <span className="text-xs text-slate-500">/ 90:00</span>
              </div>
            )}
          </div>
        </div>

        {/* Deplasman Takımı */}
        <div className="flex items-center gap-3 w-full md:w-1/3 justify-end text-right">
          <div>
            <h2 className="text-lg font-extrabold text-white tracking-wide">{awayTeam.name}</h2>
            <div className="flex items-center justify-end gap-2 text-xs text-slate-400">
              <span>{awayTeam.formation || "4-4-2"}</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded text-blue-400 font-mono font-semibold">DEPLASMAN</span>
            </div>
          </div>
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black shadow-md border-2 border-slate-700/50"
            style={{ backgroundColor: awayTeam.primaryColor, color: awayTeam.secondaryColor }}
          >
            {awayTeam.logoText || "⚽"}
          </div>
        </div>

      </div>

      {/* Kontrol Butonları (Play, Pause, Speed, Instant Finish, Reset) */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            disabled={isFinished}
            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? 'Durdur' : isFinished ? 'Maç Tamamlandı' : 'Maçı Başlat'}
          </button>

          <button
            onClick={onResetMatch}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-1.5 transition-all"
          >
            <RotateCcw size={14} />
            Yeniden Başlat
          </button>

          <button
            onClick={onInstantFinish}
            disabled={isFinished}
            className="px-3 py-2 rounded-lg bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 border border-purple-700/40 font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Zap size={14} />
            Hızlı Bitir
          </button>
        </div>

        {/* Hız Butonları (1x, 2x, 5x) */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <span className="text-[11px] text-slate-500 px-2 font-mono">Hız:</span>
          {[1, 2, 5].map((speed) => (
            <button
              key={speed}
              onClick={() => onChangeSpeed(speed)}
              className={`px-2.5 py-1 rounded font-mono font-bold text-xs transition-all ${
                simSpeed === speed
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
