import React from 'react';
import { MessageSquareText, Award, AlertCircle, Sparkles } from 'lucide-react';

export default function Commentary({ events, homeTeam, awayTeam }) {
  if (!events || events.length === 0) {
    return (
      <div className="w-full bg-slate-950 border border-slate-800 rounded-xl p-8 text-center text-slate-500 font-mono text-xs">
        Maç henüz başlamadı. 'Maçı Başlat' butonuna basarak canlı anlatımı başlatabilirsiniz.
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-2xl">
      <h3 className="text-base font-extrabold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
        <MessageSquareText className="text-emerald-400" size={18} />
        CANLI SPİKER ANLATIMI & ÖNEMLİ ANLAR (COMMENTARY TICKER)
      </h3>

      <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
        {events.map((evt, idx) => {
          const isHome = evt.teamId === homeTeam.id;
          const isGoal = evt.type === 'GOAL';
          const isCard = evt.type === 'YELLOW' || evt.type === 'RED';

          return (
            <div
              key={idx}
              className={`p-3 rounded-lg border text-xs font-mono transition-all flex items-start gap-3 ${
                isGoal
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-200 font-bold shadow-lg shadow-amber-950/40'
                  : isCard
                  ? 'bg-red-950/30 border-red-800/40 text-red-200'
                  : 'bg-slate-900/80 border-slate-800 text-slate-200'
              }`}
            >
              {/* Dakika Rozeti */}
              <span className={`px-2 py-0.5 rounded font-bold ${
                isGoal ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-emerald-400 border border-slate-700'
              }`}>
                {evt.min}'
              </span>

              {/* Takım Etiketi */}
              <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] uppercase ${
                isHome ? 'bg-red-900/40 text-red-300 border border-red-800/40' : 'bg-blue-900/40 text-blue-300 border border-blue-800/40'
              }`}>
                {isHome ? homeTeam.shortName : awayTeam.shortName}
              </span>

              {/* Anlatım Metni */}
              <p className="flex-1 leading-relaxed text-sm">
                {evt.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
