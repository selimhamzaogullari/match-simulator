import React from 'react';
import { BarChart3, Activity, ShieldCheck, Flag, AlertCircle } from 'lucide-react';

export default function MatchStats({ homeTeam, awayTeam, stats }) {
  if (!stats) return null;

  const homePoss = stats.homePossession || 50;
  const awayPoss = stats.awayPossession || 50;

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Sol & Orta Kolon: İstatistik Karşılaştırma Listesi */}
      <div className="md:col-span-2 glass-panel rounded-2xl p-6 shadow-2xl space-y-6">
        <h3 className="text-lg font-['Barlow_Condensed'] font-extrabold uppercase tracking-wider text-white flex items-center gap-2 border-b border-[#1f2d47] pb-3">
          <BarChart3 className="text-[#10b981]" size={20} />
          CANLI MAÇ İSTATİSTİKLERİ (MATCH STATS)
        </h3>

        {/* Topla Oynama Barı (Possession Bar) */}
        <div className="space-y-2 bg-[#050913]/60 p-4 rounded-xl border border-[#1f2d47]">
          <div className="flex justify-between items-center text-xs font-mono font-bold">
            <span className="text-[#fbbf24] text-sm">{homeTeam.name || "1. Takım"}: %{homePoss}</span>
            <span className="text-slate-400 font-['Barlow_Condensed'] font-bold tracking-wider text-sm">TOPLA OYNAMA</span>
            <span className="text-[#38bdf8] text-sm">%{awayPoss} :{awayTeam.name || "2. Takım"}</span>
          </div>
          <div className="w-full h-3.5 bg-[#080e1c] rounded-full overflow-hidden flex border border-[#1f2d47] p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-[#f59e0b] rounded-l-full transition-all duration-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
              style={{ width: `${homePoss}%` }}
            ></div>
            <div 
              className="h-full bg-gradient-to-r from-[#38bdf8] to-blue-600 rounded-r-full transition-all duration-500 shadow-[0_0_12px_rgba(56,189,248,0.5)]"
              style={{ width: `${awayPoss}%` }}
            ></div>
          </div>
        </div>

        {/* Metrikler Satır Satır */}
        <div className="space-y-3">
          <StatRow label="Toplam Şut" homeVal={stats.homeShots} awayVal={stats.awayShots} />
          <StatRow label="İsabetli Şut" homeVal={stats.homeShotsOnTarget} awayVal={stats.awayShotsOnTarget} highlight />
          <StatRow label="Gol Beklentisi (xG)" homeVal={stats.homeXG} awayVal={stats.awayXG} />
          <StatRow label="Köşe Vuruşu (Korner)" homeVal={stats.homeCorners} awayVal={stats.awayCorners} />
          <StatRow label="Faul" homeVal={stats.homeFouls} awayVal={stats.awayFouls} />
          <StatRow label="Sarı Kart" homeVal={stats.homeYellowCards} awayVal={stats.awayYellowCards} isCard />
          <StatRow label="Kırmızı Kart" homeVal={stats.homeRedCards} awayVal={stats.awayRedCards} isCard />
        </div>
      </div>

      {/* Sağ Kolon: Action Zones (Saha Bölge Yoğunluğu) */}
      <div className="glass-panel rounded-2xl p-6 shadow-2xl flex flex-col justify-between space-y-6">
        <div>
          <h3 className="text-lg font-['Barlow_Condensed'] font-extrabold uppercase tracking-wider text-white flex items-center gap-2 border-b border-[#1f2d47] pb-3">
            <Activity className="text-[#f59e0b]" size={20} />
            ACTION ZONES (SAHA BÖLGELERİ)
          </h3>
          <p className="text-xs text-slate-400 mb-4 font-mono">Topun hangi 3 ana bölgede ne kadar kaldığının dağılımı:</p>

          <div className="space-y-4">
            <ZoneBar label="1. Takım Defans ⅓" percent={Math.round(20 + Math.sin(homePoss) * 5)} color="bg-[#10b981]" />
            <ZoneBar label="Orta Saha ⅓" percent={Math.round(45 + Math.cos(homePoss) * 5)} color="bg-[#f59e0b]" />
            <ZoneBar label="2. Takım Defans ⅓" percent={Math.round(35 - Math.sin(homePoss) * 5)} color="bg-[#38bdf8]" />
          </div>
        </div>

        {/* Hakem & Saha Bilgisi */}
        <div className="pt-4 border-t border-[#1f2d47] text-xs text-slate-400 font-mono space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-500">Hakem:</span>
            <span className="text-slate-200 font-medium">Michele Giordano (ITA)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Hava Durumu:</span>
            <span className="text-slate-200 font-medium">Açık, 18°C</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Saha Zemin:</span>
            <span className="text-[#10b981] font-bold">Mükemmel Çim</span>
          </div>
        </div>
      </div>

    </div>
  );
}

function StatRow({ label, homeVal = 0, awayVal = 0, highlight = false, isCard = false }) {
  const hNum = Number(homeVal) || 0;
  const aNum = Number(awayVal) || 0;
  const total = hNum + aNum || 1;
  const homePct = Math.round((hNum / total) * 100);

  return (
    <div className="space-y-1 bg-[#050913]/40 p-2.5 rounded-lg border border-[#1f2d47]/60">
      <div className="flex justify-between items-center text-xs font-mono font-bold">
        <span className={`text-sm ${hNum > aNum ? 'text-[#fbbf24] font-black' : 'text-slate-300'}`}>{homeVal}</span>
        <span className={`font-['Barlow_Condensed'] uppercase tracking-wider text-xs ${highlight ? 'text-[#10b981] font-extrabold' : 'text-slate-400'}`}>
          {label}
        </span>
        <span className={`text-sm ${aNum > hNum ? 'text-[#38bdf8] font-black' : 'text-slate-300'}`}>{awayVal}</span>
      </div>

      <div className="w-full h-1.5 bg-[#080e1c] rounded-full overflow-hidden flex">
        <div 
          className={`h-full transition-all duration-500 ${isCard ? 'bg-amber-400' : 'bg-[#f59e0b]'}`}
          style={{ width: `${homePct}%` }}
        ></div>
        <div 
          className={`h-full transition-all duration-500 ${isCard ? 'bg-rose-500' : 'bg-[#38bdf8]'}`}
          style={{ width: `${100 - homePct}%` }}
        ></div>
      </div>
    </div>
  );
}

function ZoneBar({ label, percent, color }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-mono">
        <span className="text-slate-300 font-medium">{label}</span>
        <span className="text-white font-bold">%{percent}</span>
      </div>
      <div className="w-full h-2 bg-[#080e1c] rounded-full overflow-hidden border border-[#1f2d47]">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}
