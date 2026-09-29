import React, { useState } from 'react';
import { TEAMS_DATA, FORMATION_LAYOUTS } from '../data/teams';
import { Shield, RefreshCw, Search, Sparkles, User, Settings2 } from 'lucide-react';

export default function SquadSelector({
  homeTeam,
  awayTeam,
  onSelectHomeTeam,
  onSelectAwayTeam,
  onUpdateFormation,
  onSwapPlayer
}) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredTeams = TEAMS_DATA.filter(t => {
    if (activeCategory === "current") return t.category === "current";
    if (activeCategory === "legends") return t.category === "legends";
    return true;
  });

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-2xl mb-6 text-slate-200">
      
      {/* Üst Kısım: Kategori Filtreleri */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="text-emerald-400" size={20} />
            Takım & Taktik Kurulumu
          </h3>
          <p className="text-xs text-slate-400">Karşılaşacak 2 takımı seçin, dizilişlerini belirleyin veya oyuncuları inceleyin.</p>
        </div>

        {/* Kategori Filtresi (Güncel vs Efsaneler) */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeCategory === "all" ? "bg-emerald-500 text-slate-950 font-bold shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Tüm Takımlar
          </button>
          <button
            onClick={() => setActiveCategory("current")}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeCategory === "current" ? "bg-emerald-500 text-slate-950 font-bold shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            ⚽ Güncel Takımlar
          </button>
          <button
            onClick={() => setActiveCategory("legends")}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeCategory === "legends" ? "bg-amber-500 text-slate-950 font-bold shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            ⭐ Prime Efsaneler
          </button>
        </div>
      </div>

      {/* İki Takım Seçim Izgarası */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* EV SAHİBİ SEÇİMİ */}
        <TeamCard
          type="home"
          team={homeTeam}
          allTeams={filteredTeams}
          onSelectTeam={onSelectHomeTeam}
          onUpdateFormation={(fmt) => onUpdateFormation('home', fmt)}
        />

        {/* DEPLASMAN SEÇİMİ */}
        <TeamCard
          type="away"
          team={awayTeam}
          allTeams={filteredTeams}
          onSelectTeam={onSelectAwayTeam}
          onUpdateFormation={(fmt) => onUpdateFormation('away', fmt)}
        />

      </div>
    </div>
  );
}

function TeamCard({ type, team, allTeams, onSelectTeam, onUpdateFormation }) {
  const isHome = type === "home";
  const badgeBg = isHome ? "bg-red-950/30 border-red-800/50" : "bg-blue-950/30 border-blue-800/50";

  return (
    <div className={`rounded-xl border p-4 ${badgeBg} bg-slate-900/80`}>
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold shadow"
            style={{ backgroundColor: team.primaryColor, color: team.secondaryColor }}
          >
            {team.logoText || "⚽"}
          </div>
          <div>
            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isHome ? 'text-red-400' : 'text-blue-400'}`}>
              {isHome ? 'Ev Sahibi Takım' : 'Deplasman Takımı'}
            </span>
            <select
              value={team.id}
              onChange={(e) => {
                const found = allTeams.find(t => t.id === e.target.value);
                if (found) onSelectTeam(found);
              }}
              className="block mt-0.5 bg-slate-950 text-white font-bold text-sm rounded px-2 py-1 border border-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {allTeams.map(t => (
                <option key={t.id} value={t.id}>
                  {t.category === 'legends' ? '⭐ ' : ''}{t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Diziliş Seçimi */}
        <div className="text-right">
          <label className="text-[10px] font-mono text-slate-400 block mb-0.5">Diziliş / Taktik</label>
          <select
            value={team.formation || "4-4-2"}
            onChange={(e) => onUpdateFormation(e.target.value)}
            className="bg-slate-950 text-emerald-400 font-mono font-bold text-xs rounded px-2.5 py-1 border border-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {Object.keys(FORMATION_LAYOUTS).map(fmt => (
              <option key={fmt} value={fmt}>{fmt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* İlk 11 Kadro Listesi */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2 px-1">
          <span>İLK 11 KADROSU</span>
          <span>GENEL REYTİNG (OVR)</span>
        </div>

        <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
          {team.squad.map((player, idx) => (
            <div
              key={player.id || idx}
              className="flex items-center justify-between bg-slate-950/80 p-2 rounded-lg border border-slate-800/80 text-xs hover:border-slate-700 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 text-center font-mono font-bold text-slate-500">{idx + 1}</span>
                <span className={`px-1.5 py-0.5 rounded font-mono font-bold text-[10px] ${
                  player.pos === 'GK' ? 'bg-amber-900/60 text-amber-300' :
                  player.pos === 'CB' || player.pos === 'LB' || player.pos === 'RB' ? 'bg-blue-900/60 text-blue-300' :
                  player.pos === 'ST' || player.pos === 'LW' || player.pos === 'RW' ? 'bg-red-900/60 text-red-300' :
                  'bg-emerald-900/60 text-emerald-300'
                }`}>
                  {player.pos}
                </span>
                <span className="font-semibold text-slate-100">{player.name}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex gap-1.5 text-[10px] font-mono text-slate-400 hidden sm:flex">
                  <span>HIZ:{player.pac}</span>
                  <span>ŞUT:{player.sho}</span>
                  <span>PAS:{player.pas}</span>
                </div>
                <span className="w-7 h-6 rounded bg-slate-900 flex items-center justify-center font-bold font-mono text-emerald-400 border border-slate-700">
                  {player.ovr}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
