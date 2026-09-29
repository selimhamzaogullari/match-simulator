import React, { useState } from "react";
import { FORMATION_LAYOUTS } from "../data/teams";
import { ArrowLeftRight, ChevronDown } from "lucide-react";

export default function TacticalPitchBoard({
  team,
  type = "home",
  onUpdateFormation,
  onSwapSquadPlayers,
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
    <div className="w-full space-y-5">
      {/* MATCH TACTICS CONTROL HEADER (Stitch Design Header) */}
      <section className="bg-[#0c1322]/90 border border-[#1f2d47] rounded-2xl p-5 backdrop-blur-md shadow-2xl relative overflow-hidden">
        {/* Glow gradient accent */}
        <div
          className={`absolute -top-10 -left-10 w-44 h-44 rounded-full blur-3xl pointer-events-none ${
            isHome ? "bg-rose-600/10" : "bg-electric-400/10"
          }`}
        ></div>

        <div className="flex flex-wrap items-center justify-between gap-5 relative z-10">
          {/* Team Identity Block */}
          <div className="flex items-center gap-3.5">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xl font-black shadow-lg border-2 border-slate-700/50"
              style={{
                backgroundColor: team.primaryColor || "#090e1a",
                color: team.secondaryColor || "#ffffff",
              }}
            >
              {team.logoText || "⚽"}
            </div>
            <div>
              <span
                className={`block text-[11px] font-['Barlow_Condensed'] uppercase tracking-[0.2em] font-semibold mb-0.5 ${
                  isHome ? "text-[#f59e0b]" : "text-[#38bdf8]"
                }`}
              >
                {isHome ? "1. TAKIM TAKTİĞİ" : "2. TAKIM TAKTİĞİ"}
              </span>
              <h1 className="text-2xl md:text-3xl font-['Barlow_Condensed'] font-extrabold tracking-tight text-white uppercase drop-shadow-sm">
                {team.name || (isHome ? "1. Takım" : "2. Takım")}
              </h1>
            </div>
          </div>

          {/* Formation Selector Dropdown Block */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <label
                htmlFor="formation-selector"
                className="block text-[10px] font-['Barlow_Condensed'] tracking-[0.22em] font-bold text-slate-400 uppercase mb-1"
              >
                DİZİLİŞ / TAKTİK
              </label>
              <div className="relative">
                <select
                  id="formation-selector"
                  value={formationKey}
                  onChange={(e) => onUpdateFormation(e.target.value)}
                  className="appearance-none bg-[#090e1a] border border-[#10b981]/50 hover:border-[#10b981] text-[#00f59b] font-['Barlow_Condensed'] font-bold text-lg rounded-xl pl-4 pr-10 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#10b981]/40 shadow-inner cursor-pointer transition-colors"
                >
                  {Object.keys(FORMATION_LAYOUTS).map((fmt) => (
                    <option key={fmt} value={fmt}>
                      {fmt} {getFormationLabel(fmt)}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#10b981]">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Swap Helper Prompt Notification */}
        <div className="mt-4 pt-3.5 border-t border-[#1f2d47] flex items-center justify-between text-xs text-slate-300 font-medium bg-[#090e1a]/80 rounded-xl px-4 py-2.5 border-l-4 border-l-[#f59e0b]">
          <div className="flex items-center gap-2.5">
            <ArrowLeftRight size={16} className="text-[#f59e0b] shrink-0" />
            {selectedPlayerIndex !== null ? (
              <span className="text-[#fbbf24] font-bold animate-pulse font-mono">
                1. Oyuncu Seçildi ({team.squad[selectedPlayerIndex]?.name}).
                Şimdi yerini değiştirmek istediğiniz 2. oyuncuya tıklayın!
              </span>
            ) : (
              <span>
                İki oyuncunun yerini değiştirmek için sırayla üstlerine
                tıklayın.
              </span>
            )}
          </div>
          {selectedPlayerIndex !== null && (
            <button
              onClick={() => setSelectedPlayerIndex(null)}
              type="button"
              className="text-[10px] bg-[#1a2338] text-slate-300 hover:text-white px-2.5 py-1 rounded-md font-mono cursor-pointer border border-[#1f2d47]"
            >
              İptal Et
            </button>
          )}
        </div>
      </section>

      {/* FOOTBALL PITCH VISUALIZER (Stitch Design Pitch Board) */}
      <section className="relative rounded-3xl p-3 md:p-6 bg-[#0c1322]/70 border border-[#1f2d47] shadow-2xl backdrop-blur-md">
        {/* Pitch Graphic Turf Container */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] md:aspect-[16/10] max-h-[720px] rounded-2xl pitch-stripes border-2 border-[#10b981]/30 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_40px_-5px_rgba(16,185,129,0.08)] overflow-hidden select-none">
          {/* Pitch Field Markings (SVG Overlay) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none stroke-[#10b981]/30"
            fill="none"
            preserveAspectRatio="none"
            strokeWidth="2"
            viewBox="0 0 800 600"
          >
            {/* Outer Boundary */}
            <rect height="550" rx="6" width="740" x="30" y="25"></rect>
            {/* Halfway line */}
            <line strokeWidth="1.8" x1="30" x2="770" y1="300" y2="300"></line>
            {/* Center Circle & Center Spot */}
            <circle cx="400" cy="300" r="70" strokeWidth="1.8"></circle>
            <circle
              cx="400"
              cy="300"
              fill="rgba(52, 211, 153, 0.4)"
              r="3.5"
              stroke="none"
            ></circle>

            {/* TOP GOAL / ATTACKING AREA */}
            <rect height="110" width="280" x="260" y="25"></rect>
            <rect height="40" width="140" x="330" y="25"></rect>
            <path
              d="M 340 135 A 65 65 0 0 0 460 135"
              strokeDasharray="2 1"
            ></path>
            <circle
              cx="400"
              cy="90"
              fill="rgba(52, 211, 153, 0.3)"
              r="3"
              stroke="none"
            ></circle>

            {/* BOTTOM GOAL AREA */}
            <rect height="110" width="280" x="260" y="465"></rect>
            <rect height="40" width="140" x="330" y="535"></rect>
            <path
              d="M 340 465 A 65 65 0 0 1 460 465"
              strokeDasharray="2 1"
            ></path>
            <circle
              cx="400"
              cy="510"
              fill="rgba(52, 211, 153, 0.3)"
              r="3"
              stroke="none"
            ></circle>

            {/* Corner Arcs */}
            <path d="M 30 45 A 20 20 0 0 0 50 25"></path>
            <path d="M 750 25 A 20 20 0 0 0 770 45"></path>
            <path d="M 30 555 A 20 20 0 0 1 50 575"></path>
            <path d="M 750 575 A 20 20 0 0 1 770 555"></path>
          </svg>

          {/* Dynamic Pitch Lighting Vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35 pointer-events-none"></div>

          {/* 11 PLAYER TOKENS / CARDS ON TURF */}
          <div className="relative w-full h-full">
            {layout.positions.map((pos, idx) => {
              const player = team.squad[idx] || {
                name: `Oyuncu ${idx + 1}`,
                pos: pos.role,
              };
              const isSelected = selectedPlayerIndex === idx;

              // Dikey saha oranlaması
              const posY = 90 - pos.x * 0.8;
              const posX = pos.y;

              return (
                <div
                  key={player.id || idx}
                  onClick={() => handleCardClick(idx)}
                  style={{
                    top: `${posY}%`,
                    left: `${posX}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  className="absolute flex flex-col items-center cursor-pointer group z-20"
                >
                  {/* Player Token Card */}
                  <div
                    className={`player-card relative rounded-xl px-3 py-1.5 shadow-xl flex items-center gap-2 transition-all ${
                      isSelected
                        ? "bg-[#090e1a] border-2 border-[#00f59b] shadow-[0_0_25px_rgba(0,245,155,0.7)] -translate-y-1 scale-105"
                        : "bg-[#050811]/90 hover:bg-[#090e1a] border border-slate-700/80 hover:border-[#00f59b]/60"
                    }`}
                  >
                    {/* Jersey / Slot Number */}
                    <span
                      className={`w-5 h-5 rounded-md font-['Barlow_Condensed'] font-bold text-[11px] flex items-center justify-center border ${
                        isSelected
                          ? "bg-[#00f59b] text-[#050811] border-[#00f59b]"
                          : "bg-[#f59e0b]/20 text-[#fbbf24] border-[#f59e0b]/40"
                      }`}
                    >
                      {idx + 1}
                    </span>

                    <div>
                      <p className="text-xs font-bold text-white leading-tight whitespace-nowrap font-sans">
                        {player.name}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span
                          className={`text-[9px] font-bold uppercase px-1 rounded ${
                            pos.role === "GK"
                              ? "bg-[#f59e0b]/20 text-[#fbbf24]"
                              : ["CB", "LB", "RB"].includes(pos.role)
                                ? "bg-[#38bdf8]/20 text-[#38bdf8]"
                                : ["ST", "LW", "RW"].includes(pos.role)
                                  ? "bg-rose-500/20 text-rose-300"
                                  : "bg-[#10b981]/20 text-[#10b981]"
                          }`}
                        >
                          {pos.role}
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium">
                          {getRoleDescription(pos.role)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Position anchor dot on turf */}
                  <div
                    className={`w-2.5 h-2.5 mt-1.5 rounded-full ${
                      isSelected
                        ? "bg-[#00f59b] shadow-[0_0_12px_#00f59b]"
                        : "bg-[#00f59b] shadow-[0_0_8px_#00f59b] opacity-80 group-hover:opacity-100"
                    }`}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function getRoleDescription(pos) {
  switch (pos) {
    case "GK":
      return "Kaleci";
    case "CB":
      return "Stoper";
    case "LB":
      return "Sol Bek";
    case "RB":
      return "Sağ Bek";
    case "CDM":
      return "Ön Libero";
    case "CM":
      return "Orta Saha";
    case "CAM":
      return "Ofansif Orta";
    case "LM":
      return "Sol Kanat";
    case "RM":
      return "Sağ Kanat";
    case "LW":
      return "Sol Forvet";
    case "RW":
      return "Sağ Forvet";
    case "ST":
      return "Santrafor";
    default:
      return "Oyuncu";
  }
}

function getFormationLabel(fmt) {
  switch (fmt) {
    case "4-4-2":
      return "(Klasik Çift Forvet)";
    case "4-2-3-1":
      return "(Ofansif Pivot)";
    case "4-3-3":
      return "(Hücum Kanatları)";
    case "3-5-2":
      return "(Dinamik Kanat Bekler)";
    case "4-1-2-1-2":
      return "(Dar Baklava Orta Saha)";
    case "5-3-2":
      return "(Savunma Katmanı)";
    default:
      return "";
  }
}
