import React, { useState } from 'react';
import { Plus, ArrowRight, Zap, Trash2, Edit3, CheckCircle2, Users, UserPlus, Lock, ShieldAlert } from 'lucide-react';

export default function DraftPickScreen({
  homeTeam,
  awayTeam,
  onAddPlayerToTeam,
  onRemovePlayerFromTeam,
  onUpdateTeamName,
  onAutoFillTeams,
  onProceedToTactics
}) {
  const [playerInput, setPlayerInput] = useState("");
  const [selectedPos, setSelectedPos] = useState("FWD"); // "GK" | "DEF" | "MID" | "FWD"
  const [activeDraftTeam, setActiveDraftTeam] = useState("home"); // "home" = 1. Takım, "away" = 2. Takım
  const [addedToast, setAddedToast] = useState(null);
  const [warningToast, setWarningToast] = useState(null);

  const homeSquad = homeTeam.squad || [];
  const awaySquad = awayTeam.squad || [];

  const isReadyForTactics = homeSquad.length === 11 && awaySquad.length === 11;

  const activeTeamObj = activeDraftTeam === "home" ? homeTeam : awayTeam;
  const activeSquad = activeDraftTeam === "home" ? homeSquad : awaySquad;
  const activeTeamName = activeTeamObj.name || (activeDraftTeam === "home" ? "1. Takım" : "2. Takım");

  const handleProceed = () => {
    if (!isReadyForTactics) {
      setWarningToast(`Taktiklere geçebilmek için her iki takımın da 11 oyuncusu tamamlanmalıdır! (${homeTeam.name || '1. Takım'}: ${homeSquad.length}/11, ${awayTeam.name || '2. Takım'}: ${awaySquad.length}/11)`);
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
      phy: 78
    };

    onAddPlayerToTeam(activeDraftTeam, newPlayer);

    // Bildirim Toast'ı
    setAddedToast({
      playerName: nameTrimmed,
      teamName: activeTeamName
    });
    setTimeout(() => setAddedToast(null), 2500);

    // Input alanını temizle
    setPlayerInput("");

    // Sırayı otomatik olarak diğer takıma geçir! (1. Takım -> 2. Takım -> 1. Takım)
    setActiveDraftTeam(prev => (prev === "home" ? "away" : "home"));
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* ÜST BAR: BAŞLIK, HIZLI DOLDURMA VE TAKTİKLERE GEÇİŞ */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Users className="text-emerald-400" size={24} />
            <span>Takım Oluşturma & Oyuncu Ekleme</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Oyuncu ismini yazın, mevkisini seçin ve "Ekle" butonuna basarak kadronuzu oluşturun.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onAutoFillTeams}
            className="text-xs text-slate-400 hover:text-emerald-400 font-mono font-bold px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center gap-1.5 transition-all"
            title="Örnek yıldız kadroları hızlıca yükler"
          >
            <Zap size={14} className="text-amber-400" />
            <span>Hazır Kadroları Yükle</span>
          </button>

          <button
            onClick={handleProceed}
            className={`font-black px-6 py-2.5 rounded-xl shadow-xl flex items-center gap-2 transition-all text-sm ${
              isReadyForTactics
                ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:scale-105 cursor-pointer shadow-emerald-950/50"
                : "bg-slate-900 border border-slate-800 text-slate-400 cursor-not-allowed opacity-80"
            }`}
            title={!isReadyForTactics ? "Her iki takımın da 11 oyuncusu tamamlanmalıdır" : "Taktik ekranına geç"}
          >
            {!isReadyForTactics && <Lock size={16} className="text-amber-400" />}
            <span>
              {isReadyForTactics
                ? "Taktiklere Geç"
                : `Taktiklere Geç (${homeSquad.length}/11 - ${awaySquad.length}/11)`}
            </span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* UYARI BANNER'I */}
      {warningToast && (
        <div className="bg-amber-950/90 border border-amber-500 text-amber-300 px-4 py-3 rounded-xl text-xs font-mono font-bold flex items-center gap-2 animate-fadeIn">
          <ShieldAlert size={18} className="text-amber-400 shrink-0" />
          <span>{warningToast}</span>
        </div>
      )}

      {/* OYUNCU EKLEME FORMU & AKTİF SIRA BANNER'I */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
        
        {/* AKTİF SIRA BANNER'I */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono font-bold">🎯 Oyuncu Eklenecek Takım:</span>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-black transition-all ${
              activeDraftTeam === 'home' 
                ? 'bg-red-950/90 text-red-300 border border-red-700 shadow-md shadow-red-950/50' 
                : 'bg-blue-950/90 text-blue-300 border border-blue-700 shadow-md shadow-blue-950/50'
            }`}>
              <span className="w-2.5 h-2.5 rounded-full animate-pulse bg-current"></span>
              <span>{activeTeamName}</span>
              <span className="text-xs opacity-75 font-mono">({activeSquad.length}/11)</span>
            </div>
          </div>

          <button
            onClick={() => setActiveDraftTeam(prev => (prev === 'home' ? 'away' : 'home'))}
            className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <span>{activeDraftTeam === 'home' ? `➡️ ${awayTeam.name || '2. Takım'}'a Geç` : `➡️ ${homeTeam.name || '1. Takım'}'a Geç`}</span>
          </button>
        </div>

        {/* EKLENDİ TOAST BİLDİRİMİ */}
        {addedToast && (
          <div className="bg-emerald-950/90 border border-emerald-500 text-emerald-300 px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span><strong>"{addedToast.playerName}"</strong> oyuncusu <strong>{addedToast.teamName}</strong> kadrosuna eklendi! Sıra diğer takıma geçti.</span>
            </div>
          </div>
        )}

        {/* INPUT VE EKLEME FORMU */}
        <form onSubmit={handleAddPlayer} className="space-y-3">
          <div className="flex flex-col md:flex-row items-center gap-3">
            
            {/* Metin Kutusu (Player Name Input) */}
            <div className="relative flex-1 w-full">
              <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                value={playerInput}
                onChange={(e) => setPlayerInput(e.target.value)}
                placeholder="Oyuncu adını yazın... (örn. Tuncay Şanlı, Fred, Alex, Osimhen)"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-base text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono shadow-inner"
              />
            </div>

            {/* Mevki Seçim Butonları */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs font-mono font-bold w-full md:w-auto justify-center">
              <button
                type="button"
                onClick={() => setSelectedPos("GK")}
                className={`px-3 py-2 rounded-lg transition-all ${
                  selectedPos === "GK" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                🧤 Kaleci
              </button>
              <button
                type="button"
                onClick={() => setSelectedPos("DEF")}
                className={`px-3 py-2 rounded-lg transition-all ${
                  selectedPos === "DEF" ? "bg-blue-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                🛡️ Defans
              </button>
              <button
                type="button"
                onClick={() => setSelectedPos("MID")}
                className={`px-3 py-2 rounded-lg transition-all ${
                  selectedPos === "MID" ? "bg-emerald-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                ⚙️ Orta Saha
              </button>
              <button
                type="button"
                onClick={() => setSelectedPos("FWD")}
                className={`px-3 py-2 rounded-lg transition-all ${
                  selectedPos === "FWD" ? "bg-red-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                🎯 Forvet
              </button>
            </div>

            {/* Ekle Butonu */}
            <button
              type="submit"
              disabled={!playerInput.trim() || activeSquad.length >= 11}
              className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-black px-7 py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all text-sm disabled:cursor-not-allowed"
            >
              <Plus size={18} />
              <span>Ekle</span>
            </button>
          </div>
        </form>

      </div>

      {/* HER İKİ TAKIMIN KADRO LİSTESİ (SIDE-BY-SIDE PANELS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. TAKIM KADRO KARTI */}
        <div className={`bg-slate-950 border-2 rounded-2xl p-5 shadow-2xl space-y-4 transition-all ${
          activeDraftTeam === 'home' ? 'border-red-500/80 ring-2 ring-red-500/20' : 'border-slate-800'
        }`}>
          
          {/* Takım İsmi Düzenleme Input & Başlık */}
          <div className="space-y-2 pb-3 border-b border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-red-400">
              <span className="flex items-center gap-1.5">
                <Edit3 size={13} />
                <span>1. TAKIM İSMİ</span>
              </span>
              <span className="bg-slate-900 px-2.5 py-1 rounded text-slate-300 border border-slate-700">
                {homeSquad.length} / 11 Oyuncu
              </span>
            </div>

            <input
              type="text"
              value={homeTeam.name || ""}
              onChange={(e) => onUpdateTeamName('home', e.target.value)}
              placeholder="1. Takım İsmini Yazın (örn. Fenerbahçe Legends)"
              className="w-full bg-slate-900 border border-slate-700 focus:border-red-500 rounded-xl px-3 py-2 text-base font-black text-white focus:outline-none transition-all"
            />

            {/* İlerleme Noktaları */}
            <div className="flex gap-1 pt-1">
              {[...Array(11)].map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 flex-1 rounded-full transition-all ${
                    i < homeSquad.length ? "bg-red-500 shadow-sm shadow-red-500" : "bg-slate-800"
                  }`}
                ></div>
              ))}
            </div>
          </div>

          {/* Eklenen Oyuncular Listesi */}
          <div className="space-y-2 min-h-[240px] max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
            {homeSquad.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-800 rounded-xl text-slate-500 font-mono text-xs space-y-2">
                <Users size={28} className="opacity-40" />
                <p>Henüz oyuncu eklenmedi.</p>
                <p className="text-[11px] text-slate-600">Yukarıdaki kutuya oyuncu adı yazıp "Ekle" butonuna basın.</p>
              </div>
            ) : (
              homeSquad.map((player, idx) => (
                <div
                  key={player.id || `home_p_${idx}`}
                  className="flex items-center justify-between bg-slate-900/90 hover:bg-slate-900 p-3 rounded-xl border border-slate-800 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-500 w-5">
                      {idx + 1}.
                    </span>

                    <span className={`w-9 h-7 rounded font-mono font-bold text-[11px] flex items-center justify-center border ${
                      player.pos === 'GK' ? 'bg-amber-950/80 border-amber-700 text-amber-300' :
                      player.pos === 'DEF' || player.pos === 'CB' || player.pos === 'LB' || player.pos === 'RB' ? 'bg-blue-950/80 border-blue-700 text-blue-300' :
                      player.pos === 'FWD' || player.pos === 'ST' || player.pos === 'LW' || player.pos === 'RW' ? 'bg-red-950/80 border-red-700 text-red-300' :
                      'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                    }`}>
                      {player.pos}
                    </span>

                    <div className="font-bold text-white text-sm">
                      {player.name}
                    </div>
                  </div>

                  <button
                    onClick={() => onRemovePlayerFromTeam('home', player.id)}
                    className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-950/40 transition-colors"
                    title="Kadroya Çıkar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 2. TAKIM KADRO KARTI */}
        <div className={`bg-slate-950 border-2 rounded-2xl p-5 shadow-2xl space-y-4 transition-all ${
          activeDraftTeam === 'away' ? 'border-blue-500/80 ring-2 ring-blue-500/20' : 'border-slate-800'
        }`}>
          
          {/* Takım İsmi Düzenleme Input & Başlık */}
          <div className="space-y-2 pb-3 border-b border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-blue-400">
              <span className="flex items-center gap-1.5">
                <Edit3 size={13} />
                <span>2. TAKIM İSMİ</span>
              </span>
              <span className="bg-slate-900 px-2.5 py-1 rounded text-slate-300 border border-slate-700">
                {awaySquad.length} / 11 Oyuncu
              </span>
            </div>

            <input
              type="text"
              value={awayTeam.name || ""}
              onChange={(e) => onUpdateTeamName('away', e.target.value)}
              placeholder="2. Takım İsmini Yazın (örn. Lüleburgazspor)"
              className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-xl px-3 py-2 text-base font-black text-white focus:outline-none transition-all"
            />

            {/* İlerleme Noktaları */}
            <div className="flex gap-1 pt-1">
              {[...Array(11)].map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 flex-1 rounded-full transition-all ${
                    i < awaySquad.length ? "bg-blue-500 shadow-sm shadow-blue-500" : "bg-slate-800"
                  }`}
                ></div>
              ))}
            </div>
          </div>

          {/* Eklenen Oyuncular Listesi */}
          <div className="space-y-2 min-h-[240px] max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
            {awaySquad.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-800 rounded-xl text-slate-500 font-mono text-xs space-y-2">
                <Users size={28} className="opacity-40" />
                <p>Henüz oyuncu eklenmedi.</p>
                <p className="text-[11px] text-slate-600">Yukarıdaki kutuya oyuncu adı yazıp "Ekle" butonuna basın.</p>
              </div>
            ) : (
              awaySquad.map((player, idx) => (
                <div
                  key={player.id || `away_p_${idx}`}
                  className="flex items-center justify-between bg-slate-900/90 hover:bg-slate-900 p-3 rounded-xl border border-slate-800 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-500 w-5">
                      {idx + 1}.
                    </span>

                    <span className={`w-9 h-7 rounded font-mono font-bold text-[11px] flex items-center justify-center border ${
                      player.pos === 'GK' ? 'bg-amber-950/80 border-amber-700 text-amber-300' :
                      player.pos === 'DEF' || player.pos === 'CB' || player.pos === 'LB' || player.pos === 'RB' ? 'bg-blue-950/80 border-blue-700 text-blue-300' :
                      player.pos === 'FWD' || player.pos === 'ST' || player.pos === 'LW' || player.pos === 'RW' ? 'bg-red-950/80 border-red-700 text-red-300' :
                      'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                    }`}>
                      {player.pos}
                    </span>

                    <div className="font-bold text-white text-sm">
                      {player.name}
                    </div>
                  </div>

                  <button
                    onClick={() => onRemovePlayerFromTeam('away', player.id)}
                    className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-950/40 transition-colors"
                    title="Kadroya Çıkar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
