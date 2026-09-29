import React, { useState } from "react";
import { GLOBAL_PLAYER_POOL } from "../data/playerPool";
import {
  Search,
  X,
  UserPlus,
  Check,
  Sparkles,
  Shield,
  Trophy,
} from "lucide-react";

export default function PlayerSearchModal({
  isOpen,
  targetPosition,
  targetSlotIndex,
  onClose,
  onSelectPlayer,
}) {
  if (!isOpen) return null;

  const [query, setQuery] = useState("");
  const [posFilter, setPosFilter] = useState("ALL"); // ALL, GK, DEF, MID, FWD

  // Filtreleme mantığı
  const filteredPlayers = GLOBAL_PLAYER_POOL.filter((p) => {
    // Arama Sorgusu
    const matchQuery =
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.club.toLowerCase().includes(query.toLowerCase());

    // Mevki Filtresi
    if (!matchQuery) return false;
    if (posFilter === "GK") return p.pos === "GK";
    if (posFilter === "DEF")
      return (
        p.pos === "CB" ||
        p.pos === "LB" ||
        p.pos === "RB" ||
        p.pos === "LWB" ||
        p.pos === "RWB"
      );
    if (posFilter === "MID")
      return (
        p.pos === "CM" ||
        p.pos === "CDM" ||
        p.pos === "CAM" ||
        p.pos === "LM" ||
        p.pos === "RM"
      );
    if (posFilter === "FWD")
      return p.pos === "ST" || p.pos === "LW" || p.pos === "RW";
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <UserPlus className="text-emerald-400" size={22} />
              OYUNCU ARAMA & TRANSFER EDİCİ
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Saha üzerindeki{" "}
              <span className="text-emerald-400 font-bold">
                #{targetSlotIndex + 1} ({targetPosition})
              </span>{" "}
              mevkisi için yeni bir oyuncu seçin.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Search Bar & Filters */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 space-y-3">
          {/* Canlı Arama Input */}
          <div className="relative">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Oyuncu ekle"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono shadow-inner"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Mevki Filtre Butonları */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar text-xs font-mono font-bold">
            <button
              onClick={() => setPosFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                posFilter === "ALL"
                  ? "bg-emerald-500 text-slate-950 shadow"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              Tüm Oyuncular
            </button>
            <button
              onClick={() => setPosFilter("GK")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                posFilter === "GK"
                  ? "bg-amber-500 text-slate-950 shadow"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              🧤 Kaleci
            </button>
            <button
              onClick={() => setPosFilter("DEF")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                posFilter === "DEF"
                  ? "bg-blue-500 text-slate-950 shadow"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              🛡️ Defans
            </button>
            <button
              onClick={() => setPosFilter("MID")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                posFilter === "MID"
                  ? "bg-emerald-500 text-slate-950 shadow"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              ⚙️ Orta Saha
            </button>
            <button
              onClick={() => setPosFilter("FWD")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                posFilter === "FWD"
                  ? "bg-red-500 text-slate-950 shadow"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              🎯 Forvet
            </button>
          </div>
        </div>

        {/* Oyuncu Sonuç Listesi */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {filteredPlayers.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-mono text-xs">
              Aramanızla eşleşen oyuncu bulunamadı. Lütfen başka bir kelime
              deneyin.
            </div>
          ) : (
            filteredPlayers.map((player) => (
              <div
                key={player.id}
                onClick={() => onSelectPlayer(player, targetSlotIndex)}
                className="flex items-center justify-between bg-slate-900/90 hover:bg-slate-800 p-3 rounded-xl border border-slate-800 hover:border-emerald-500/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  {/* Mevki Rozeti */}
                  <span
                    className={`w-10 h-8 rounded-lg font-mono font-bold text-xs flex items-center justify-center border shadow-inner ${
                      player.pos === "GK"
                        ? "bg-amber-950/80 border-amber-700 text-amber-300"
                        : player.pos === "CB" ||
                            player.pos === "LB" ||
                            player.pos === "RB"
                          ? "bg-blue-950/80 border-blue-700 text-blue-300"
                          : player.pos === "ST" ||
                              player.pos === "LW" ||
                              player.pos === "RW"
                            ? "bg-red-950/80 border-red-700 text-red-300"
                            : "bg-emerald-950/80 border-emerald-700 text-emerald-300"
                    }`}
                  >
                    {player.pos}
                  </span>

                  <div>
                    <div className="font-extrabold text-white text-sm group-hover:text-emerald-300 transition-colors">
                      {player.name}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      {player.club}
                    </div>
                  </div>
                </div>

                {/* Detaylar & Seç Butonu */}
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex gap-2 text-[10px] font-mono text-slate-400">
                    <span className="bg-slate-950 px-2 py-1 rounded border border-slate-800">
                      HIZ:{player.pac}
                    </span>
                    <span className="bg-slate-950 px-2 py-1 rounded border border-slate-800">
                      ŞUT:{player.sho}
                    </span>
                    <span className="bg-slate-950 px-2 py-1 rounded border border-slate-800">
                      PAS:{player.pas}
                    </span>
                  </div>

                  <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-lg group-hover:scale-105">
                    <span>Kadroya Ekle</span>
                    <Check size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
