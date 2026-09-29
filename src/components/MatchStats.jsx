import React from 'react';
import { BarChart3, PieChart, Activity, Flag, AlertTriangle } from 'lucide-react';

export default function MatchStats({ homeTeam, awayTeam, stats }) {
  if (!stats) return null;

  const homePoss = stats.homePossession || 50;
  const awayPoss = stats.awayPossession || 50;

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Sol & Orta Kolon: İstatistik Karşılaştırma Listesi */}
      <div className="md:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-2xl">
        <h3 className="text-base font-extrabold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
          <BarChart3 className="text-emerald-400" size={18} />
          CANLI MAÇ İSTATİSTİKLERİ (MATCH STATS)
        </h3>

        {/* Topla Oynama Barı (Possession Bar) */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-xs font-mono font-bold mb-1.5">
            <span className="text-emerald-400">{homeTeam.name}: %{homePoss}</span>
            <span className="text-slate-400 font-normal">TOPLA OYNAMA</span>
            <span className="text-blue-400">{awayTeam.name}: %{awayPoss}</span>
          </div>
          <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden flex border border-slate-800 p-0.5">
            <div 
              className="h-full bg-emerald-500 rounded-l-full transition-all duration-500"
              style={{ width: `${homePoss}%` }}
            ></div>
            <div 
              className="h-full bg-blue-500 rounded-r-full transition-all duration-500"
              style={{ width: `${awayPoss}%` }}
            ></div>
          </div>
        </div>

        {/* Metrikler Satır Satır */}
        <div className="space-y-4">
          <StatRow label="Toplam Şut" homeVal={stats.homeShots} awayVal={stats.awayShots} />
          <StatRow label="İsabetli Şut" homeVal={stats.homeShotsOnTarget} awayVal={stats.awayShotsOnTarget} highlight />
          <StatRow label="Gol Beklentisi (xG)" homeVal={stats.homeXG} awayVal={stats.awayXG} />
          <StatRow label="Köşe Vuruşu (Korner)" homeVal={stats.homeCorners} awayVal={stats.awayCorners} />
          <StatRow label="Faul" homeVal={stats.homeFouls} awayVal={stats.awayFouls} />
          <StatRow label="Sarı Kart" homeVal={stats.homeYellowCards} awayVal={stats.awayYellowCards} isCard />
          <StatRow label="Kırmızı Kart" homeVal={stats.homeRedCards} awayVal={stats.awayRedCards} isCard />
        </div>
      </div>

      {/* Sağ Kolon: Action Zones (CM 03/04 Saha Bölge Yoğunluğu) */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col justify-between">
        <div>
          <h3 className="text-base font-extrabold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Activity className="text-amber-400" size={18} />
            ACTION ZONES (SAHA BÖLGELERİ)
          </h3>
          <p className="text-xs text-slate-400 mb-4">Topun hangi 3 ana bölgede ne kadar kaldığının yüzdesel dağılımı:</p>

          <div className="space-y-4">
            <ZoneBar label="Ev Sahibi Defans ⅓" percent={Math.round(20 + Math.sin(homePoss) * 5)} color="bg-emerald-600" />
            <ZoneBar label="Orta Saha ⅓" percent={Math.round(45 + Math.cos(homePoss) * 5)} color="bg-amber-500" />
            <ZoneBar label="Deplasman Defans ⅓" percent={Math.round(35 - Math.sin(homePoss) * 5)} color="bg-blue-600" />
          </div>
        </div>

        {/* Hakem & Saha Bilgisi */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono space-y-1">
          <div className="flex justify-between">
            <span>Hakem:</span>
            <span className="text-slate-200">Cüneyt Çakır</span>
          </div>
          <div className="flex justify-between">
            <span>Hava Durumu:</span>
            <span className="text-slate-200">Açık, 21°C</span>
          </div>
          <div className="flex justify-between">
            <span>Saha Zemin:</span>
            <span className="text-emerald-400">Mükemmel Çim</span>
          </div>
        </div>
      </div>

    </div>
  );
}

function StatRow({ label, homeVal, awayVal, highlight = false, isCard = false }) {
  const homeNumber = typeof homeVal === 'number' ? homeVal : 0;
  const awayNumber = typeof awayVal === 'number' ? awayVal : 0;
  const isHomeGreater = homeNumber > awayNumber;
  const isAwayGreater = awayNumber > homeNumber;

  return (
    <div className={`flex items-center justify-between p-2 rounded-lg ${highlight ? 'bg-slate-900 border border-slate-800' : ''}`}>
      <span className={`w-12 font-mono text-center font-bold text-sm ${isHomeGreater ? 'text-emerald-400 font-extrabold' : 'text-slate-300'}`}>
        {homeVal}
      </span>
      <span className="text-xs text-slate-400 font-medium font-mono text-center flex-1">
        {label}
      </span>
      <span className={`w-12 font-mono text-center font-bold text-sm ${isAwayGreater ? 'text-blue-400 font-extrabold' : 'text-slate-300'}`}>
        {awayVal}
      </span>
    </div>
  );
}

function ZoneBar({ label, percent, color }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-mono mb-1">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-400 font-bold">%{percent}</span>
      </div>
      <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}
