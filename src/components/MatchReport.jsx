import React from "react";
import {
  Trophy,
  Award,
  FileText,
  Star,
  Shield,
  Flame,
  Activity,
} from "lucide-react";

export default function MatchReport({
  homeTeam,
  awayTeam,
  matchResult,
  playerStats,
}) {
  if (!matchResult) return null;

  // Find Man of the Match (MOTM)
  let motm = matchResult.manOfTheMatch || null;
  let highestRating = 0;

  if (!motm && playerStats) {
    Object.keys(playerStats).forEach((id) => {
      if (playerStats[id].rating > highestRating) {
        highestRating = playerStats[id].rating;
        motm = {
          name: playerStats[id].name,
          rating: playerStats[id].rating,
          summary:
            "Karşılaşma boyunca sahada basmadık yer bırakmadı ve performansıyla galibiyetin mimarı oldu.",
        };
      }
    });
  }

  // Key match events (Goals, Cards)
  const keyEvents = (matchResult.events || []).filter(
    (e) =>
      e.type.includes("GOAL") ||
      e.type.includes("YELLOW") ||
      e.type.includes("RED"),
  );

  const homeScore = matchResult.homeScore ?? 0;
  const awayScore = matchResult.awayScore ?? 0;

  return (
    <div className="w-full glass-panel rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Top Banner: Score & Summary */}
      <div className="bg-gradient-to-r from-[#0d1321] via-[#121929] to-[#0d1321] border border-[#1f2d47] p-6 rounded-2xl text-center relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-4 opacity-10 font-mono text-8xl font-black text-white pointer-events-none">
          MATCH REPORT
        </div>

        <span className="inline-block bg-[#10b981]/20 text-[#10b981] font-mono text-xs px-3.5 py-1 rounded-full font-bold uppercase border border-[#10b981]/30">
          MAÇ SONU RAPORU
        </span>

        <h2 className="text-3xl md:text-5xl font-['Barlow_Condensed'] font-extrabold text-white mt-3 uppercase tracking-wide">
          {homeTeam.name || "1. Takım"}{" "}
          <span className="text-[#fbbf24] font-['Chakra_Petch']">
            {homeScore}
          </span>{" "}
          -{" "}
          <span className="text-[#38bdf8] font-['Chakra_Petch']">
            {awayScore}
          </span>{" "}
          {awayTeam.name || "2. Takım"}
        </h2>

        {/* MOTM Spotlight */}
        {motm && (
          <div className="mt-5 inline-flex items-center gap-3 bg-gradient-to-r from-[#f59e0b]/20 via-[#fbbf24]/20 to-[#f59e0b]/20 text-[#fbbf24] px-5 py-2.5 rounded-2xl border border-[#f59e0b]/50 text-sm font-mono font-bold shadow-glow-amber animate-fadeIn">
            <Trophy size={20} className="text-[#f59e0b]" />
            <div className="text-left">
              <div className="text-[10px] text-amber-400/80 uppercase tracking-widest">
                MAÇIN ADAMI (MAN OF THE MATCH)
              </div>
              <div className="text-base font-bold text-white font-sans">
                {motm.name}{" "}
                <span className="bg-[#f59e0b] text-[#050811] px-2 py-0.5 rounded text-xs font-black ml-1.5">
                  {motm.rating || 9.2} Puan
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Two Column Layout: Key Match Highlights Narrative & Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Key Events Chronological Summary */}
        <div className="bg-[#050913]/90 border border-[#1f2d47] rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1f2d47] pb-3">
            <h4 className="font-['Barlow_Condensed'] font-extrabold text-xl text-white uppercase tracking-wide flex items-center gap-2">
              <Flame size={18} className="text-[#f59e0b]" />
              <span>Maçın Kritik Anları & Gol Kronolojisi</span>
            </h4>
            <span className="text-xs font-mono text-slate-400">
              {keyEvents.length} Önemli Olay
            </span>
          </div>

          {keyEvents.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-slate-500">
              Karşılaşmada gol veya kart olayı yaşanmadı.
            </div>
          ) : (
            <div className="space-y-2.5">
              {keyEvents.map((evt, idx) => {
                const isGoal = evt.type.includes("GOAL");
                const isCard =
                  evt.type.includes("YELLOW") || evt.type.includes("RED");
                const scorerName = evt.scorer || evt.player || "Oyuncu";
                const assistName = evt.assist ? ` (Asist: ${evt.assist})` : "";

                return (
                  <div
                    key={evt.id || idx}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono transition-all ${
                      isGoal
                        ? "bg-rose-950/30 border-rose-500/40 text-white"
                        : "bg-[#080e1c] border-[#1f2d47]/70 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          isGoal
                            ? "bg-[#f59e0b] text-[#050811]"
                            : "bg-[#1f2d47] text-slate-300"
                        }`}
                      >
                        {evt.min}'
                      </span>

                      <div className="flex flex-col">
                        <span className="font-sans font-bold text-sm text-white">
                          {isGoal && <span className="mr-1.5">⚽ GOL!</span>}
                          {isCard && <span className="mr-1.5">🟨 Kart</span>}[
                          {evt.isHome ? homeTeam.name : awayTeam.name}]
                        </span>
                        <span className="text-xs text-slate-300 font-sans">
                          {isGoal
                            ? `${scorerName}${assistName}`
                            : evt.steps?.join(" ") ||
                              evt.text ||
                              evt.description}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        isGoal
                          ? "bg-[#f59e0b]/20 text-[#fbbf24] border border-[#f59e0b]/40"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {evt.type}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Technical Match Overview Narrative */}
        <div className="bg-[#050913]/90 border border-[#1f2d47] rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1f2d47] pb-3">
            <h4 className="font-['Barlow_Condensed'] font-extrabold text-xl text-white uppercase tracking-wide flex items-center gap-2">
              <FileText size={18} className="text-[#38bdf8]" />
              <span>Teknik & Taktik Maç Analizi</span>
            </h4>
            <span className="text-xs font-mono text-[#38bdf8]">
              MATCH ANALYTICS
            </span>
          </div>

          <div className="space-y-3 text-xs font-sans leading-relaxed text-slate-300">
            <div className="p-3 bg-[#080e1c] border border-[#1f2d47]/70 rounded-xl">
              <div className="font-bold text-[#fbbf24] mb-1 font-mono uppercase text-[11px]">
                📋 Taktiksel Gelişim:
              </div>
              <p>
                {homeTeam.name} sahaya {homeTeam.formation || "4-4-2"}{" "}
                dizilişiyle çıkarken, {awayTeam.name} rakibine{" "}
                {awayTeam.formation || "4-4-2"} sistemiyle karşılık verdi. İki
                takım da orta alanda yoğun baskı kurdu.
              </p>
            </div>

            <div className="p-3 bg-[#080e1c] border border-[#1f2d47]/70 rounded-xl">
              <div className="font-bold text-[#38bdf8] mb-1 font-mono uppercase text-[11px]">
                ⚡ Maçın Kırılma Anı:
              </div>
              <p>
                {keyEvents.length > 0
                  ? `Karşılaşmanın ${keyEvents[0].min}. dakikasında yaşanan pozisyon maçın gidişatını tamamen değiştiren an oldu.`
                  : "Maç boyunca savunmalar hata yapmadı ve iki takım da disiplinli yapısını korudu."}
              </p>
            </div>

            {motm && (
              <div className="p-3 bg-[#080e1c] border border-[#1f2d47]/70 rounded-xl">
                <div className="font-bold text-[#00f59b] mb-1 font-mono uppercase text-[11px]">
                  🌟 Öne Çıkan Performans:
                </div>
                <p>
                  {motm.name}, sahada sergilediği yüksek oyun aklı, pas isabeti
                  ve kritik müdahaleleriyle maçın en değerli oyuncusu seçildi.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
