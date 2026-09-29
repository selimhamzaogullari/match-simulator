import React from 'react';
import { Trophy, Award, FileText, Star, UserCheck } from 'lucide-react';

export default function MatchReport({ homeTeam, awayTeam, matchResult, playerStats }) {
  if (!matchResult) return null;

  // Maçın Adamı (Man of the Match - MOTM) Bul
  let motm = null;
  let highestRating = 0;

  if (playerStats) {
    Object.keys(playerStats).forEach(id => {
      if (playerStats[id].rating > highestRating) {
        highestRating = playerStats[id].rating;
        motm = playerStats[id];
      }
    });
  }

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-6">
      
      {/* Üst Kart: Skor ve Özet */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-6 rounded-xl text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 font-mono text-8xl font-black text-white">
          CM 03/04
        </div>

        <span className="bg-emerald-500/20 text-emerald-400 font-mono text-xs px-3 py-1 rounded-full font-bold uppercase border border-emerald-500/30">
          MAÇ SONU RAPORU (MATCH REPORT)
        </span>

        <h2 className="text-2xl md:text-3xl font-black text-white mt-3">
          {homeTeam.name} <span className="text-emerald-400">{matchResult.homeScore}</span> - <span className="text-blue-400">{matchResult.awayScore}</span> {awayTeam.name}
        </h2>

        {/* Maçın Adamı (MOTM) */}
        {motm && (
          <div className="mt-4 inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-4 py-2 rounded-xl border border-amber-500/40 text-xs font-mono font-bold">
            <Trophy size={16} className="text-amber-400 animate-bounce" />
            <span>MAÇIN ADAMI (MOTM): {motm.name}</span>
            <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black">{motm.rating}</span>
          </div>
        )}
      </div>

      {/* İki Takım Oyuncu Performans Puanları (Ratings 1-10 Scale) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Ev Sahibi Puanları */}
        <SquadRatingTable team={homeTeam} playerStats={playerStats} isHome />

        {/* Deplasman Puanları */}
        <SquadRatingTable team={awayTeam} playerStats={playerStats} isHome={false} />

      </div>
    </div>
  );
}

function SquadRatingTable({ team, playerStats, isHome }) {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <div 
            className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: team.primaryColor, color: team.secondaryColor }}
          >
            {team.logoText || "⚽"}
          </div>
          <h4 className="font-bold text-white text-sm">{team.name} Perfomans Puanları</h4>
        </div>
        <span className="text-[10px] font-mono text-slate-400">PERFORMANS (1.0 - 10.0)</span>
      </div>

      <div className="space-y-1.5">
        {team.squad.map((p, idx) => {
          const stats = playerStats ? playerStats[p.id] : null;
          const rating = stats ? stats.rating : (6.5 + Math.random() * 2).toFixed(1);
          const goals = stats ? stats.goals : 0;
          const assists = stats ? stats.assists : 0;

          const isHighRating = Number(rating) >= 8.0;

          return (
            <div key={p.id || idx} className="flex items-center justify-between bg-slate-950/60 p-2 rounded border border-slate-800/80 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-500 w-4">{idx + 1}</span>
                <span className="font-semibold text-slate-200">{p.name}</span>
                {goals > 0 && <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-1.5 py-0.2 rounded">⚽ x{goals}</span>}
                {assists > 0 && <span className="text-[10px] bg-blue-500/20 text-blue-400 font-bold px-1.5 py-0.2 rounded">🅰️ x{assists}</span>}
              </div>

              <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                isHighRating ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}>
                {rating}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
