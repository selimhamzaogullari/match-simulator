import React, { useState } from "react";
import {
  Plus,
  ArrowRight,
  Zap,
  Trash2,
  Edit3,
  CheckCircle2,
  Users,
  UserPlus,
  Lock,
  ShieldAlert,
  ArrowLeftRight,
} from "lucide-react";

export default function DraftPickScreen({
  homeTeam,
  awayTeam,
  onAddPlayerToTeam,
  onRemovePlayerFromTeam,
  onUpdateTeamName,
  onAutoFillTeams,
  onProceedToTactics,
}) {
  const [playerInput, setPlayerInput] = useState("");
  const [selectedPos, setSelectedPos] = useState("GK"); // Default match Stitch image active GK
  const [activeDraftTeam, setActiveDraftTeam] = useState("away"); // Default match Stitch image active Team 2
  const [addedToast, setAddedToast] = useState(null);
  const [warningToast, setWarningToast] = useState(null);

  const homeSquad = homeTeam.squad || [];
  const awaySquad = awayTeam.squad || [];

  const isReadyForTactics = homeSquad.length === 11 && awaySquad.length === 11;

  const activeTeamObj = activeDraftTeam === "home" ? homeTeam : awayTeam;
  const activeSquad = activeDraftTeam === "home" ? homeSquad : awaySquad;
  const activeTeamName =
    activeTeamObj.name ||
    (activeDraftTeam === "home" ? "1. Takım" : "2. Takım");

  const handleProceed = () => {
    if (!isReadyForTactics) {
      setWarningToast(
        `Taktiklere geçebilmek için her iki takımın da 11 oyuncusu tamamlanmalıdır! (${homeTeam.name || "1. Takım"}: ${homeSquad.length}/11, ${awayTeam.name || "2. Takım"}: ${awaySquad.length}/11)`,
      );
      setTimeout(() => setWarningToast(null), 4000);
      return;
    }
    onProceedToTactics();
  };

  // Oyuncuyu Doğrudan İsim Yazarak Ekleyen Fonksiyon
  const handleAddPlayer = (e) => {
    if (e) e.preventDefault();

    const nameTrimmed = playerInput.trim();
    if (!nameTrimmed) return;
    if (activeSquad.length >= 11) return;

    const newPlayer = {
      id: `player_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: nameTrimmed,
      club: activeTeamName,
      pos: selectedPos,
      ovr: 82,
      pac: 82,
      sho: 82,
      pas: 80,
      dri: 82,
      def: 65,
      phy: 78,
    };

    onAddPlayerToTeam(activeDraftTeam, newPlayer);

    // Input alanını temizle
    setPlayerInput("");

    // Sırayı otomatik olarak diğer takıma geçir! (1. Takım -> 2. Takım -> 1. Takım)
    setActiveDraftTeam((prev) => (prev === "home" ? "away" : "home"));
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* BANNER ACTION BAR (Stitch Image 1 Style) */}
      <section className="rounded-xl border border-[#1f2d47] bg-gradient-to-r from-[#0d1321] via-[#121929] to-[#0d1321] p-4 sm:p-5 shadow-lg relative overflow-hidden">
        {/* Ambient light effect */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#f59e0b]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          {/* Title and description */}
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#121929] border border-[#1f2d47] text-[#f59e0b] shadow-inner mt-0.5">
              <Users size={22} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-['Barlow_Condensed'] font-bold uppercase tracking-wide text-white flex items-center gap-2">
                TAKIM OLUŞTURMA &amp; KADRO KURULUMU
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Oyuncu ismini girin, mevkiini belirleyin ve{" "}
                <span className="text-[#fbbf24] font-medium">"Ekle"</span>{" "}
                butonuna basarak maç kadrolarınızı oluşturun.
              </p>
            </div>
          </div>

          {/* Action Control Buttons */}
          <div className="flex items-center flex-wrap gap-2.5 sm:self-end lg:self-center">
            <button
              onClick={onAutoFillTeams}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#f59e0b]/30 bg-[#121929] hover:bg-[#f59e0b]/10 text-[#fbbf24] font-medium text-xs sm:text-sm tracking-wide transition-all shadow-sm active:scale-95 cursor-pointer"
              title="Örnek kadroları hızlıca yükler"
            >
              <Zap size={15} className="text-[#f59e0b]" />
              <span>Hazır Kadroları Yükle</span>
            </button>

            <button
              onClick={handleProceed}
              type="button"
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-['Barlow_Condensed'] font-extrabold text-base tracking-wider uppercase transition-all shadow-lg active:scale-95 ${
                isReadyForTactics
                  ? "bg-gradient-to-r from-[#10b981] to-[#14b8a6] hover:from-[#34d399] hover:to-[#2dd4bf] text-[#080e1c] shadow-[#10b981]/20 cursor-pointer"
                  : "bg-[#0d1321] border border-[#1f2d47] text-slate-500 cursor-not-allowed opacity-80"
              }`}
              title={
                !isReadyForTactics
                  ? "Her iki takımın da 11 oyuncusu tamamlanmalıdır"
                  : "Taktik ve diziliş ekranına geç"
              }
            >
              {!isReadyForTactics && (
                <Lock size={16} className="text-[#f59e0b]" />
              )}
              <span>
                {isReadyForTactics
                  ? "TAKTİKLERE GEÇ ➔"
                  : `TAKTİKLERE GEÇ (${homeSquad.length}/11 - ${awaySquad.length}/11)`}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* UYARI TOAST BİLDİRİMİ (SABİT KAYMAYAN FLOATING NOTICE) */}
      {warningToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0d1321] border border-[#f59e0b] text-[#fbbf24] px-4 py-3 rounded-xl text-xs font-mono font-bold flex items-center gap-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] animate-fadeIn max-w-md">
          <ShieldAlert size={20} className="text-[#f59e0b] shrink-0" />
          <span>{warningToast}</span>
        </div>
      )}

      {/* QUICK PLAYER CONSOLE (Stitch Image 1 Style) */}
      <section className="rounded-xl border border-[#1f2d47] bg-[#121929]/90 backdrop-blur-sm p-4 sm:p-5 shadow-xl space-y-4">
        {/* Target Team Selector Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1f2d47]/70">
          <div className="flex items-center gap-2.5">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5 font-mono">
              <span
                className={`w-2 h-2 rounded-full ${activeDraftTeam === "home" ? "bg-[#f59e0b]" : "bg-[#38bdf8]"}`}
              ></span>
              OYUNCU EKLENECEK TAKIM:
            </span>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                activeDraftTeam === "home"
                  ? "bg-[#080e1c] border border-[#f59e0b]/40 text-[#fbbf24]"
                  : "bg-[#080e1c] border border-[#0284c7]/40 text-[#38bdf8]"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full animate-pulse ${activeDraftTeam === "home" ? "bg-[#f59e0b]" : "bg-[#38bdf8]"}`}
              ></span>
              <span className="font-['Barlow_Condensed'] font-bold text-sm">
                {activeDraftTeam === "home" ? "1. Takım: " : "2. Takım: "}{" "}
                {activeTeamName}
              </span>
              <span className="text-[10px] text-slate-400 bg-[#121929] px-1.5 py-0.5 rounded font-mono">
                ({activeSquad.length}/11)
              </span>
            </div>
          </div>

          {/* Switch Target Team Toggle */}
          <button
            onClick={() =>
              setActiveDraftTeam((prev) => (prev === "home" ? "away" : "home"))
            }
            type="button"
            className="self-start sm:self-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0d1321] hover:bg-[#1a2338] border border-[#1f2d47] text-xs text-slate-300 hover:text-white transition-colors cursor-pointer font-sans"
          >
            <ArrowLeftRight size={13} className="text-[#f59e0b]" />
            <span>
              {activeDraftTeam === "home"
                ? `${awayTeam.name || "2. Takım"}'a Geç`
                : `${homeTeam.name || "1. Takım"}'a Geç`}
            </span>
          </button>
        </div>

        {/* Input Controls Form */}
        <form
          onSubmit={handleAddPlayer}
          className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center"
        >
          {/* Text Input with Icon */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <UserPlus size={18} />
            </div>
            <input
              type="text"
              value={playerInput}
              onChange={(e) => setPlayerInput(e.target.value)}
              placeholder="Oyuncu adını yazın... (örn. Tuncay Şanlı, Fred, Alex)"
              className="w-full bg-[#050913] border border-[#1f2d47] hover:border-[#2a3b5c] focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 transition-all font-sans outline-none shadow-inner"
            />
          </div>

          {/* Role / Position Pills Selector */}
          <div
            aria-label="Mevki Seçimi"
            className="lg:col-span-5 grid grid-cols-4 gap-1.5"
          >
            <button
              type="button"
              onClick={() => setSelectedPos("GK")}
              className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg font-['Barlow_Condensed'] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                selectedPos === "GK"
                  ? "bg-[#f59e0b] text-[#080e1c] shadow-md shadow-[#f59e0b]/30"
                  : "bg-[#0d1321] hover:bg-[#1a2338] border border-[#1f2d47] text-slate-300"
              }`}
            >
              <span className="text-sm">🧤</span>
              <span>Kaleci</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPos("DEF")}
              className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg font-['Barlow_Condensed'] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                selectedPos === "DEF"
                  ? "bg-[#38bdf8] text-[#080e1c] shadow-md shadow-[#38bdf8]/30"
                  : "bg-[#0d1321] hover:bg-[#1a2338] border border-[#1f2d47] text-slate-300"
              }`}
            >
              <span className="text-sm">🛡️</span>
              <span>Defans</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPos("MID")}
              className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg font-['Barlow_Condensed'] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                selectedPos === "MID"
                  ? "bg-[#10b981] text-[#080e1c] shadow-md shadow-[#10b981]/30"
                  : "bg-[#0d1321] hover:bg-[#1a2338] border border-[#1f2d47] text-slate-300"
              }`}
            >
              <span className="text-sm">⚙️</span>
              <span>Orta Saha</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPos("FWD")}
              className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg font-['Barlow_Condensed'] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                selectedPos === "FWD"
                  ? "bg-[#f43f5e] text-white shadow-md shadow-[#f43f5e]/30"
                  : "bg-[#0d1321] hover:bg-[#1a2338] border border-[#1f2d47] text-slate-300"
              }`}
            >
              <span className="text-sm">🎯</span>
              <span>Forvet</span>
            </button>
          </div>

          {/* Submit Button */}
          <div className="lg:col-span-2">
            <button
              type="submit"
              disabled={!playerInput.trim() || activeSquad.length >= 11}
              className="w-full h-full py-2.5 rounded-lg bg-[#0d1321] hover:bg-[#f59e0b] hover:text-[#080e1c] text-slate-300 border border-[#1f2d47] hover:border-[#f59e0b] font-['Barlow_Condensed'] font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-1.5 transition-all duration-150 disabled:bg-[#0d1321] disabled:text-slate-600 disabled:border-[#1f2d47] disabled:cursor-not-allowed cursor-pointer"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Ekle</span>
            </button>
          </div>
        </form>
      </section>

      {/* TWO SQUAD COLUMNS (Stitch Image 1 Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ================= TEAM 1 COLUMN ================= */}
        <div
          className={`rounded-xl border-2 bg-[#121929] shadow-xl overflow-hidden flex flex-col transition-all ${
            activeDraftTeam === "home"
              ? "border-[#f59e0b] shadow-[0_0_25px_-5px_rgba(245,158,11,0.35)]"
              : "border-[#1f2d47] hover:border-[#2a3b5c]"
          }`}
        >
          {/* Always-rendered fixed-height Top Ribbon */}
          <div
            onClick={() => setActiveDraftTeam("home")}
            className={`px-4 py-1.5 border-b flex items-center justify-between text-[11px] font-mono transition-colors cursor-pointer ${
              activeDraftTeam === "home"
                ? "bg-[#f59e0b]/15 border-[#f59e0b]/30 text-[#fbbf24]"
                : "bg-[#0d1321] border-[#1f2d47] text-slate-500 hover:text-slate-300"
            }`}
          >
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
              <span
                className={`w-2 h-2 rounded-full ${activeDraftTeam === "home" ? "bg-[#f59e0b] animate-pulse" : "bg-slate-600"}`}
              ></span>
              {activeDraftTeam === "home"
                ? "AKTİF DÜZENLENEN TAKIM"
                : "SEÇMEK İÇİN TIKLAYIN"}
            </span>
            <span>
              {activeDraftTeam === "home"
                ? `Hedef Slot: ${homeSquad.length + 1}. Oyuncu`
                : `${homeSquad.length}/11 Oyuncu`}
            </span>
          </div>

          {/* Team 1 Header */}
          <div className="p-4 sm:p-5 border-b border-[#1f2d47] bg-[#0d1321]/80">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span>
                <span className="font-mono text-xs uppercase text-[#f59e0b] tracking-wider font-bold">
                  1. TAKIM
                </span>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#f59e0b]/15 text-[#fbbf24] border border-[#f59e0b]/30">
                {homeSquad.length} / 11 Oyuncu
              </span>
            </div>

            {/* Editable Team Name */}
            <div className="relative group mt-1">
              <input
                type="text"
                value={homeTeam.name || ""}
                onChange={(e) => onUpdateTeamName("home", e.target.value)}
                placeholder="1. Takım İsmini Yazın"
                className="w-full bg-[#050913]/80 border border-[#1f2d47] group-hover:border-slate-600 focus:border-[#f59e0b] rounded-lg px-3.5 py-2 text-base font-['Barlow_Condensed'] font-bold uppercase tracking-wider text-white transition-colors outline-none"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                <Edit3 size={15} />
              </div>
            </div>

            {/* Progress Trackers (11 Slot Dots) */}
            <div
              className="grid grid-cols-11 gap-1.5 mt-3.5"
              title={`Kadro doluluk oranı: ${homeSquad.length}/11`}
            >
              {[...Array(11)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i < homeSquad.length
                      ? "bg-[#f59e0b] shadow-sm"
                      : "bg-[#1f2d47]"
                  }`}
                ></div>
              ))}
            </div>
          </div>

          {/* Team 1 Squad List Content */}
          <div className="p-4 space-y-2.5 min-h-[360px]">
            {homeSquad.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center p-4 text-slate-500 font-mono text-xs space-y-2">
                <div className="p-3 rounded-2xl bg-[#080e1c] border border-[#1f2d47] text-slate-600 mb-1">
                  <Users size={32} className="opacity-40" />
                </div>
                <p className="font-['Barlow_Condensed'] font-bold uppercase tracking-wider text-slate-300 text-base">
                  HENÜZ OYUNCU EKLENMEDİ
                </p>
                <p className="text-xs text-slate-500 max-w-xs font-sans">
                  Yukarıdaki kontrol kutusundan oyuncu adı yazıp mevki seçerek
                  kadroyu tamamlamaya başlayın.
                </p>
              </div>
            ) : (
              homeSquad.map((player, idx) => (
                <div
                  key={player.id || `home_p_${idx}`}
                  className="flex items-center justify-between bg-[#050913] border border-[#f59e0b]/30 rounded-lg p-3 hover:border-[#f59e0b]/60 transition-colors shadow-sm group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-mono font-bold text-xs text-slate-500">
                      {idx + 1}.
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-['Barlow_Condensed'] font-bold tracking-wider border ${
                        player.pos === "GK"
                          ? "bg-[#f59e0b]/20 text-[#fbbf24] border-[#f59e0b]/30"
                          : player.pos === "DEF"
                            ? "bg-[#38bdf8]/20 text-[#38bdf8] border-[#38bdf8]/30"
                            : player.pos === "MID"
                              ? "bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30"
                              : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                      }`}
                    >
                      {player.pos}
                    </span>

                    <span className="font-['Barlow_Condensed'] font-bold text-base tracking-wide text-white group-hover:text-[#fbbf24] transition-colors">
                      {player.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onRemovePlayerFromTeam("home", player.id)}
                      type="button"
                      className="p-1.5 rounded hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Oyuncuyu sil"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Empty Slot Placeholders (Matching Stitch Image 1) */}
            {homeSquad.length > 0 &&
              [...Array(Math.max(0, 11 - homeSquad.length))]
                .slice(0, 3)
                .map((_, i) => {
                  const slotNum = homeSquad.length + i + 1;
                  return (
                    <div
                      key={`home_empty_${i}`}
                      className="flex items-center justify-between border border-dashed border-[#1f2d47]/80 rounded-lg p-3 text-slate-600 bg-[#050913]/30"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 text-center font-mono text-xs text-slate-600">
                          {slotNum}.
                        </span>
                        <span className="text-xs uppercase font-['Barlow_Condensed'] tracking-wider text-slate-500 font-semibold">
                          + BOŞ POZİSYON
                        </span>
                      </div>
                      <span className="text-xs text-slate-600 font-mono">
                        Bekleniyor
                      </span>
                    </div>
                  );
                })}

            {homeSquad.length > 0 && 11 - homeSquad.length > 3 && (
              <div className="p-3 text-center rounded-lg bg-[#050913]/40 border border-[#1f2d47]/40 text-xs text-slate-500 font-mono">
                ve {11 - homeSquad.length - 3} boş oyuncu yuvası daha
              </div>
            )}
          </div>
        </div>

        {/* ================= TEAM 2 COLUMN (Active Target Team in Stitch Image 1) ================= */}
        <div
          className={`rounded-xl border-2 bg-[#121929] shadow-xl overflow-hidden flex flex-col relative transition-all ${
            activeDraftTeam === "away"
              ? "border-[#0284c7] shadow-[0_0_25px_-5px_rgba(56,189,248,0.35)]"
              : "border-[#1f2d47] hover:border-[#2a3b5c]"
          }`}
        >
          {/* Always-rendered fixed-height Top Ribbon */}
          <div
            onClick={() => setActiveDraftTeam("away")}
            className={`px-4 py-1.5 border-b flex items-center justify-between text-[11px] font-mono transition-colors cursor-pointer ${
              activeDraftTeam === "away"
                ? "bg-[#0284c7]/20 border-[#0284c7]/30 text-[#38bdf8]"
                : "bg-[#0d1321] border-[#1f2d47] text-slate-500 hover:text-slate-300"
            }`}
          >
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
              <span
                className={`w-2 h-2 rounded-full ${activeDraftTeam === "away" ? "bg-[#38bdf8] animate-pulse" : "bg-slate-600"}`}
              ></span>
              {activeDraftTeam === "away"
                ? "AKTİF DÜZENLENEN TAKIM"
                : "SEÇMEK İÇİN TIKLAYIN"}
            </span>
            <span>
              {activeDraftTeam === "away"
                ? `Hedef Slot: ${awaySquad.length + 1}. Oyuncu`
                : `${awaySquad.length}/11 Oyuncu`}
            </span>
          </div>

          {/* Team 2 Header */}
          <div className="p-4 sm:p-5 border-b border-[#1f2d47] bg-[#0d1321]/80">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]"></span>
                <span className="font-mono text-xs uppercase text-[#38bdf8] tracking-wider font-bold">
                  2. TAKIM
                </span>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#0284c7]/20 text-[#38bdf8] border border-[#0284c7]/40">
                {awaySquad.length} / 11 Oyuncu
              </span>
            </div>

            {/* Editable Team Name */}
            <div className="relative group mt-1">
              <input
                type="text"
                value={awayTeam.name || ""}
                onChange={(e) => onUpdateTeamName("away", e.target.value)}
                placeholder="2. Takım İsmini Yazın"
                className="w-full bg-[#050913]/80 border border-[#1f2d47] group-hover:border-slate-600 focus:border-[#0284c7] rounded-lg px-3.5 py-2 text-base font-['Barlow_Condensed'] font-bold uppercase tracking-wider text-white transition-colors outline-none"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                <Edit3 size={15} />
              </div>
            </div>

            {/* Progress Trackers (11 Slot Dots) */}
            <div
              className="grid grid-cols-11 gap-1.5 mt-3.5"
              title={`Kadro doluluk oranı: ${awaySquad.length}/11`}
            >
              {[...Array(11)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i < awaySquad.length
                      ? "bg-[#38bdf8] shadow-sm"
                      : "bg-[#1f2d47]"
                  }`}
                ></div>
              ))}
            </div>
          </div>

          {/* Team 2 Squad List Content */}
          <div className="p-4 space-y-2.5 min-h-[360px] flex flex-col justify-center">
            {awaySquad.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-4 text-slate-500 font-mono text-xs space-y-3">
                <div className="p-4 rounded-2xl bg-[#080e1c] border border-[#1f2d47] text-slate-600 mb-1 shadow-inner">
                  <Users size={36} className="opacity-40" />
                </div>
                <p className="font-['Barlow_Condensed'] font-bold uppercase tracking-wider text-slate-200 text-lg">
                  HENÜZ OYUNCU EKLENMEDİ
                </p>
                <p className="text-xs text-slate-400 max-w-xs font-sans leading-relaxed">
                  Yukarıdaki kontrol kutusundan oyuncu adı yazıp mevki seçerek
                  kadroyu tamamlamaya başlayın.
                </p>
              </div>
            ) : (
              awaySquad.map((player, idx) => (
                <div
                  key={player.id || `away_p_${idx}`}
                  className="flex items-center justify-between bg-[#050913] border border-[#0284c7]/30 rounded-lg p-3 hover:border-[#0284c7]/60 transition-colors shadow-sm group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-mono font-bold text-xs text-slate-500">
                      {idx + 1}.
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-['Barlow_Condensed'] font-bold tracking-wider border ${
                        player.pos === "GK"
                          ? "bg-[#f59e0b]/20 text-[#fbbf24] border-[#f59e0b]/30"
                          : player.pos === "DEF"
                            ? "bg-[#38bdf8]/20 text-[#38bdf8] border-[#38bdf8]/30"
                            : player.pos === "MID"
                              ? "bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30"
                              : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                      }`}
                    >
                      {player.pos}
                    </span>

                    <span className="font-['Barlow_Condensed'] font-bold text-base tracking-wide text-white group-hover:text-[#38bdf8] transition-colors">
                      {player.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onRemovePlayerFromTeam("away", player.id)}
                      type="button"
                      className="p-1.5 rounded hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Oyuncuyu sil"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Empty Slot Placeholders (Matching Stitch Image 1) */}
            {awaySquad.length > 0 &&
              [...Array(Math.max(0, 11 - awaySquad.length))]
                .slice(0, 3)
                .map((_, i) => {
                  const slotNum = awaySquad.length + i + 1;
                  return (
                    <div
                      key={`away_empty_${i}`}
                      className="flex items-center justify-between border border-dashed border-[#1f2d47]/80 rounded-lg p-3 text-slate-600 bg-[#050913]/30"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 text-center font-mono text-xs text-slate-600">
                          {slotNum}.
                        </span>
                        <span className="text-xs uppercase font-['Barlow_Condensed'] tracking-wider text-slate-500 font-semibold">
                          + BOŞ POZİSYON
                        </span>
                      </div>
                      <span className="text-xs text-slate-600 font-mono">
                        Bekleniyor
                      </span>
                    </div>
                  );
                })}

            {awaySquad.length > 0 && 11 - awaySquad.length > 3 && (
              <div className="p-3 text-center rounded-lg bg-[#050913]/40 border border-[#1f2d47]/40 text-xs text-slate-500 font-mono">
                ve {11 - awaySquad.length - 3} boş oyuncu yuvası daha
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER BAR (Matching Stitch Image 1 Bottom Bar) */}
      <footer className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 pt-4 border-t border-[#1f2d47]/60 gap-2">
        <div>
          <span className="text-[#f59e0b] font-bold">İpucu:</span> Maç motoru,
          her iki takımda da en az 11 oyuncu tamamlandığında tam simülasyonu
          başlatır.
        </div>
        <div>Tactical Match Pulse © 2026</div>
      </footer>
    </div>
  );
}
