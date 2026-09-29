import React, { useState } from 'react';
import { FORMATION_LAYOUTS } from '../data/teams';
import { ArrowLeftRight } from 'lucide-react';

export default function TacticalPitchBoard({
  team,
  type = "home",
  onUpdateFormation,
  onSwapSquadPlayers
}) {
  const isHome = type === "home";
  const formationKey = team.formation || "4-4-2";
  const layout = FORMATION_LAYOUTS[formationKey] || FORMATION_LAYOUTS["4-4-2"];

  // Yer değiştirme için 1. seçili oyuncunun indeksi
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(null);

  const handleCardClick = (idx) => {
    if (selectedPlayerIndex === null) {
      setSelectedPlayerIndex(idx);
    } else if (selectedPlayerIndex === idx) {
      setSelectedPlayerIndex(null);
    } else {
      if (onSwapSquadPlayers) {
        onSwapSquadPlayers(type, selectedPlayerIndex, idx);
      }
      setSelectedPlayerIndex(null);
    }
  };

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl">
      
      {/* Üst Bar: Takım İsmi & Diziliş Seçimi */}
      <div className="flex items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black shadow-lg border-2 border-slate-700/50"
            style={{ backgroundColor: team.primaryColor, color: team.secondaryColor }}
          >
            {team.logoText || "⚽"}
          </div>
          <div>
            <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${isHome ? 'text-red-400' : 'text-blue-400'}`}>
              {isHome ? 'EV SAHİBİ TAKIM TAKTİĞİ' : 'DEPLASMAN TAKIMI TAKTİĞİ'}
            </span>
            <h3 className="text-xl font-black text-white">{team.name || (isHome ? 'Ev Sahibi' : 'Deplasman')}</h3>
          </div>
        </div>

        {/* Diziliş Seçimi */}
        <div className="text-right">
          <span className="text-[10px] font-mono text-slate-400 block mb-1">DİZİLİŞ / TAKTİK</span>
          <select
            value={formationKey}
            onChange={(e) => onUpdateFormation(e.target.value)}
            className="bg-slate-900 text-emerald-400 font-mono font-bold text-sm rounded-lg px-3.5 py-1.5 border border-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {Object.keys(FORMATION_LAYOUTS).map(fmt => (
              <option key={fmt} value={fmt}>{fmt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Yer Değiştirme İpucu Banner'ı */}
      <div className="mb-4 bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-300">
          <ArrowLeftRight className="text-amber-400" size={16} />
          {selectedPlayerIndex !== null ? (
            <span className="text-amber-400 font-bold animate-pulse">
              1. Oyuncu Seçildi ({team.squad[selectedPlayerIndex]?.name}). Şimdi yerini değiştirmek istediğiniz 2. oyuncuya tıklayın!
            </span>
          ) : (
            <span>İki oyuncunun yerini değiştirmek için sırayla üstlerine tıklayın.</span>
          )}
        </div>
        {selectedPlayerIndex !== null && (
          <button
            onClick={() => setSelectedPlayerIndex(null)}
            className="text-[10px] bg-slate-800 text-slate-400 hover:text-white px-2.5 py-1 rounded"
          >
            Seçimi İptal Et
          </button>
        )}
      </div>

      {/* Dikey Yeşil Saha Üzerinde Görsel Oyuncu Kartları (Arama İkonları Kaldırıldı) */}
      <div className="relative w-full aspect-[4/5] max-w-[650px] mx-auto bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 rounded-2xl border-2 border-emerald-700/50 p-4 shadow-2xl overflow-hidden flex items-center justify-center">
        
        {/* Çim Sahası Çizgileri */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="w-full h-full flex flex-col">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-black/20' : 'bg-transparent'}`}></div>
            ))}
          </div>

          <div className="absolute inset-3 border-2 border-white rounded-lg"></div>
          <div className="absolute top-1/2 left-3 right-3 h-0.5 bg-white -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-28 h-28 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>

          <div className="absolute top-3 left-1/2 w-48 h-24 border-2 border-white border-t-0 -translate-x-1/2"></div>
          <div className="absolute bottom-3 left-1/2 w-48 h-24 border-2 border-white border-b-0 -translate-x-1/2"></div>
        </div>

        {/* 11 Oyuncu Kartının Saha Üzerindeki Yerleşimi */}
        <div className="relative w-full h-full">
          {layout.positions.map((pos, idx) => {
            const player = team.squad[idx] || { name: `Oyuncu ${idx+1}`, pos: pos.role };
            const isSelected = selectedPlayerIndex === idx;

            const posY = 92 - (pos.x * 0.82);
            const posX = pos.y;

            return (
              <div
                key={player.id || idx}
                onClick={() => handleCardClick(idx)}
                style={{
                  top: `${posY}%`,
                  left: `${posX}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className="absolute transition-all duration-500 hover:scale-110 cursor-pointer group z-10"
              >
                {/* Oyuncu Kartı (Arama 🔍 İkonları Kaldırıldı) */}
                <div className={`relative bg-slate-950/95 p-2 rounded-xl shadow-2xl min-w-[105px] max-w-[135px] text-center backdrop-blur-md transition-all ${
                  isSelected 
                    ? 'border-2 border-amber-400 ring-4 ring-amber-400/40 scale-110 bg-slate-900 shadow-amber-950/80' 
                    : 'border-2 border-slate-700/80 group-hover:border-emerald-400'
                }`}>
                  
                  {/* Forma Numarası Badge (Sol Üst) */}
                  <span className={`absolute -top-2.5 -left-2.5 font-mono font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow ${
                    isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-900 border border-slate-700 text-slate-300'
                  }`}>
                    {idx + 1}
                  </span>

                  {/* Oyuncu İsmi */}
                  <div className={`font-extrabold text-white text-xs truncate mt-0.5 ${isSelected ? 'text-amber-300' : 'group-hover:text-emerald-300'}`}>
                    {player.name}
                  </div>

                  {/* Mevki ve Rol */}
                  <div className="flex items-center justify-center gap-1 mt-0.5 text-[9px] font-mono text-slate-400">
                    <span className="bg-slate-800 px-1 py-0.2 rounded font-bold text-emerald-400">{pos.role}</span>
                    <span className="truncate text-slate-400 font-medium">
                      {getRoleDescription(pos.role)}
                    </span>
                  </div>
                </div>

                {/* Yön Oku / Seçim İndikatörü */}
                <div className="w-full flex justify-center mt-0.5">
                  {isSelected ? (
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
                  ) : (
                    <div className="w-1.5 h-1.5 bg-emerald-400/60 rounded-full opacity-60 group-hover:opacity-100"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

function getRoleDescription(pos) {
  switch (pos) {
    case 'GK': return 'Kaleci';
    case 'CB': return 'Stoper';
    case 'LB': return 'Sol Bek';
    case 'RB': return 'Sağ Bek';
    case 'CDM': return 'Ön Libero';
    case 'CM': return 'Orta Saha';
    case 'CAM': return 'Ofansif Orta';
    case 'LM': return 'Sol Kanat';
    case 'RM': return 'Sağ Kanat';
    case 'LW': return 'Sol Forvet';
    case 'RW': return 'Sağ Forvet';
    case 'ST': return 'Santrafor';
    default: return 'Oyuncu';
  }
}
