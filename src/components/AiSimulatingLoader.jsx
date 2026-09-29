import React from 'react';
import { Bot, Sparkles, Cpu, ShieldCheck } from 'lucide-react';

export default function AiSimulatingLoader({ isVisible, homeTeamName, awayTeamName }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
      
      {/* Animasyonlu Yapay Zeka Logosu */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30 animate-pulse">
          <Bot size={52} className="text-slate-950" />
        </div>
        <div className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 p-2 rounded-full shadow-lg animate-bounce">
          <Sparkles size={18} />
        </div>
      </div>

      {/* Başlık ve Bilgilendirme */}
      <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide mb-2 flex items-center justify-center gap-3">
        <span>YAPAY ZEKÂ MAÇI SİMÜLE EDİYOR</span>
        <span className="text-xs bg-emerald-500/20 text-emerald-400 font-mono px-2.5 py-1 rounded-full border border-emerald-500/30">ChatGPT GPT-4o</span>
      </h2>

      <p className="text-sm font-mono text-slate-400 max-w-md mb-6 leading-relaxed">
        <span className="text-red-400 font-bold">{homeTeamName}</span> vs <span className="text-blue-400 font-bold">{awayTeamName}</span> kadroları, taktikleri ve oyuncu yetenekleri ChatGPT tarafından analiz ediliyor...
      </p>

      {/* İlerleme Barı */}
      <div className="w-full max-w-xs h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
        <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full w-full animate-pulse"></div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs font-mono text-slate-500">
        <Cpu size={14} className="text-emerald-400" />
        <span>Türkçe canlı spiker anlatımı ve istatistikler hazırlanıyor...</span>
      </div>

    </div>
  );
}
