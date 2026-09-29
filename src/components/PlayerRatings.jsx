import React from 'react';
import { Award, Star, Shield, Zap, Activity } from 'lucide-react';

export default function PlayerRatings({ homeTeam, awayTeam, matchResult, playerStats }) {
  if (!matchResult) return null;

  return (
    <div className="w-full glass-panel rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#080e1c] border border-[#1f2d47] p-5 rounded-xl gap-4">
        <div>
          <span className="inline-block bg-[#10b981]/20 text-[#10b981] font-mono text-xs px-3 py-1 rounded-full font-bold uppercase border border-[#10b981]/30">
            OYUNCU PERFORMANS DEĞERLENDİRMESİ
          </span>
          <h3 className="text-2xl font-['Barlow_Condensed'] font-extrabold text-white mt-1 uppercase tracking-wide">
            Resmi Maç Reyting Tablosu (1.0 - 10.0 Skalası)
          </h3>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#00f59b]"></span> Mükemmel (8.0+)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]"></span> İyi (7.0 - 7.9)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span> Ortalama (&lt;7.0)</span>
        </div>
      </div>

      {/* Grid for Home and Away Squads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SquadRatingColumn team={homeTeam} playerStats={playerStats} isHome={true} />
        <SquadRatingColumn team={awayTeam} playerStats={playerStats} isHome={false} />
      </div>
    </div>
  );
}

function SquadRatingColumn({ team, playerStats, isHome }) {
  const squad = team.squad || [];

  return (
    <div className="bg-[#050913]/90 border border-[#1f2d47] rounded-xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-[#1f2d47] pb-3">
        <h4 className={`font-['Barlow_Condensed'] font-extrabold text-xl uppercase tracking-wide flex items-center gap-2 ${
          isHome ? 'text-[#fbbf24]' : 'text-[#38bdf8]'
        }`}>
          <Shield size={18} />
          <span>{team.name || (isHome ? '1. Takım' : '2. Takım')}</span>
        </h4>
        <span className="text-xs font-mono text-slate-400 uppercase font-bold">
          {squad.length} Oyuncu Kadrosu
        </span>
      </div>

      <div className="space-y-2">
        {squad.map((player, idx) => {
          // Player stats lookup by ID or name
          let stats = null;
          if (playerStats) {
            const keyPrefix = isHome ? 'home_' : 'away_';
            stats = playerStats[player.id] || playerStats[`${keyPrefix}${player.name}`] || playerStats[idx];
          }

          const rating = stats ? Number(stats.rating).toFixed(1) : (7.0 + (idx % 3) * 0.4).toFixed(1);
          const goals = stats?.goals || 0;
          const assists = stats?.assists || 0;
          const numRating = parseFloat(rating);

          let ratingColor = 'bg-slate-800 text-slate-300 border-slate-700';
          if (numRating >= 8.5) {
            ratingColor = 'bg-gradient-to-r from-[#10b981] to-[#00f59b] text-[#050811] font-black border-[#00f59b] shadow-[0_0_12px_rgba(0,245,155,0.4)]';
          } else if (numRating >= 7.8) {
            ratingColor = 'bg-[#10b981]/25 text-[#00f59b] border-[#10b981]/50';
          } else if (numRating >= 7.0) {
            ratingColor = 'bg-[#38bdf8]/20 text-[#38bdf8] border-[#38bdf8]/40';
          } else if (numRating < 6.0) {
            ratingColor = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
          }

          return (
            <div
              key={player.id || idx}
              className="flex items-center justify-between p-3 bg-[#080e1c] border border-[#1f2d47]/70 rounded-xl hover:border-slate-500 transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="w-5 text-center text-xs font-mono text-slate-500 font-bold">{idx + 1}</span>
                
                {/* Position Badge */}
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  player.pos === 'GK' ? 'bg-[#f59e0b]/20 text-[#fbbf24] border border-[#f59e0b]/30' :
                  ['CB', 'LB', 'RB', 'RWB', 'LWB'].includes(player.pos) ? 'bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/30' :
                  ['ST', 'LW', 'RW', 'CF'].includes(player.pos) ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                  'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30'
                }`}>
                  {player.pos || 'CM'}
                </span>

                {/* Player Name */}
                <div className="flex flex-col">
                  <span className="font-sans font-bold text-white text-sm group-hover:text-[#fbbf24] transition-colors">
                    {player.name}
                  </span>
                  {stats && (stats.shots > 0 || stats.passes > 0 || stats.saves > 0) && (
                    <span className="text-[10px] font-mono text-slate-400">
                      {stats.saves > 0 ? `${stats.saves} Kurtarış` : ''}
                      {stats.shots > 0 ? `${stats.shots} Şut` : ''}
                      {stats.passes > 0 ? ` • ${stats.passes} Pas` : ''}
                    </span>
                  )}
                </div>
              </div>

              {/* Goals, Assists & Rating Badge */}
              <div className="flex items-center gap-2">
                {goals > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-mono font-bold bg-[#f59e0b]/20 text-[#fbbf24] px-2 py-0.5 rounded border border-[#f59e0b]/40">
                    <span>⚽</span>
                    <span>{goals}</span>
                  </span>
                )}

                {assists > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-mono font-bold bg-[#38bdf8]/20 text-[#38bdf8] px-2 py-0.5 rounded border border-[#38bdf8]/40">
                    <span>👟</span>
                    <span>{assists}</span>
                  </span>
                )}

                <span className={`px-2.5 py-1 rounded-lg text-xs font-mono border ${ratingColor}`}>
                  {rating}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
