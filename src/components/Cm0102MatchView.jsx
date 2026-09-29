import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  MessageSquare,
  BarChart2,
  Shield,
  Award,
  Users,
  Trophy,
  Lock,
  Zap,
  Flame,
  FileText,
  Activity,
} from "lucide-react";
import MatchStats from "./MatchStats";
import MatchReport from "./MatchReport";
import PlayerRatings from "./PlayerRatings";

export default function Cm0102MatchView({
  homeTeam,
  awayTeam,
  matchResult,
  onResetMatch,
}) {
  const [matchTimeSec, setMatchTimeSec] = useState(0); // 0 -> (90+extra) * 60 saniye
  const [isPlaying, setIsPlaying] = useState(false); // MANUEL KICK-OFF İÇİN BAŞLANGIÇTA DURAKLATILMIŞ
  const [hasStarted, setHasStarted] = useState(false);
  const [simSpeed, setSimSpeed] = useState(1); // 1x, 2x, 5x
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'stats' | 'ratings' | 'report'

  // Rastgele Uzatma Süreleri (Maç Başına Üretilir)
  const [stoppageTime] = useState(() => ({
    firstHalf: Math.floor(Math.random() * 4) + 1, // +1 ile +4 dakika arası
    secondHalf: Math.floor(Math.random() * 5) + 2, // +2 ile +6 dakika arası
  }));

  // Canlı Takip State'leri
  const [activeSentence, setActiveSentence] = useState(
    "Karşılaşma başlamak üzere. Başlat butonuna basarak düdüğü çalabilirsiniz.",
  );
  const [visibleEvents, setVisibleEvents] = useState([]);

  // Devre Arası, Gol Kutlaması ve Pozisyon Adımı State'leri
  const [isHalfTime, setIsHalfTime] = useState(false);
  const [goalOverlay, setGoalOverlay] = useState(null); // { isHome: bool, scorer: string, min: number }
  const [isSteppingState, setIsSteppingState] = useState(false); // Dakika sayacını pozisyonda kesin dondurma

  // İşlenmiş olay takibi (Aynı dakikadaki çoklu olayları atlamamak için)
  const processedEventIdsRef = useRef(new Set());
  const isSteppingRef = useRef(false);
  const isGoalCelebratingRef = useRef(false);
  const timerRef = useRef(null);

  const events = matchResult?.events || [];
  const currentMinute = Math.floor(matchTimeSec / 60);

  const maxMatchMin = 90 + stoppageTime.secondHalf;
  const maxFirstHalfMin = 45 + stoppageTime.firstHalf;
  const isMatchEnded =
    currentMinute >= maxMatchMin || matchTimeSec >= maxMatchMin * 60;

  // Dakika Biçimlendirici (45+2', 90+4')
  const getDisplayMinute = (min) => {
    if (min > 45 && min <= maxFirstHalfMin) {
      return `45+${min - 45}'`;
    }
    if (min > 90) {
      return `90+${min - 90}'`;
    }
    return `${min}'`;
  };

  // 1. ZAMANLAYICI VE CANLI CÜMLE AKIŞ MOTORU (CM 01/02 TIMELINE ENGINE)
  useEffect(() => {
    if (
      !isPlaying ||
      isHalfTime ||
      isGoalCelebratingRef.current ||
      isSteppingState ||
      !hasStarted
    ) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = 1000 / simSpeed;

    timerRef.current = setInterval(() => {
      setMatchTimeSec((prevSec) => {
        const totalMaxSec = maxMatchMin * 60;

        if (prevSec >= totalMaxSec) {
          setIsPlaying(false);
          const motm = matchResult?.manOfTheMatch;
          const motmText = motm
            ? ` 🌟 Maçın Adamı: ${motm.name} (${motm.rating} Puan).`
            : "";
          setActiveSentence(
            `🏆 MAÇ BİTTİ! Hakem son düdüğü çaldı.${motmText} Karşılaşma sona erdi!`,
          );
          setActiveTab("report");
          return totalMaxSec;
        }

        const nextSec = prevSec + 60; // 1 dk ilerle
        const min = Math.floor(nextSec / 60);

        // 45. Dakikada 4. Hakem Duyurusu
        if (min === 45 && prevSec === 44 * 60) {
          setActiveSentence(
            `📢 Dördüncü hakem tabelayı kaldırdı: İlk yarının sonuna en az +${stoppageTime.firstHalf} dakika ek süre ilave edildi!`,
          );
        }

        // 90. Dakikada 4. Hakem Duyurusu
        if (min === 90 && prevSec === 89 * 60) {
          setActiveSentence(
            `📢 Dördüncü hakem tabelayı kaldırdı: Maçın sonuna en az +${stoppageTime.secondHalf} dakika ek süre ilave edildi!`,
          );
        }

        // İlk Yarı Sonu Duraklatması (45 + Uzatma)
        if (min >= maxFirstHalfMin && prevSec < maxFirstHalfMin * 60) {
          setIsPlaying(false);
          setIsHalfTime(true);
          setActiveSentence(
            "İlk yarı sona erdi. Takımlar soyunma odasına gidiyor.",
          );
          return maxFirstHalfMin * 60;
        }

        // Dakikaya Denk Gelen Olayları İşle
        const minuteEvents = events.filter(
          (e) =>
            e.min === min &&
            !processedEventIdsRef.current.has(e.id || `${e.min}_${e.type}`),
        );
        if (minuteEvents.length > 0 && !isSteppingRef.current) {
          triggerSequentialEventsQueue(minuteEvents, min);
        } else if (
          minuteEvents.length === 0 &&
          !isSteppingRef.current &&
          !isGoalCelebratingRef.current
        ) {
          // Sıradan Maç İçi Anlatım Cümlesi
          if (min > 0 && min % 6 === 0) {
            setActiveSentence(
              getAmbientSentence(min, homeTeam.name, awayTeam.name),
            );
          }
        }

        return nextSec;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [
    isPlaying,
    isHalfTime,
    isSteppingState,
    hasStarted,
    simSpeed,
    events,
    maxMatchMin,
    maxFirstHalfMin,
    matchResult,
    stoppageTime,
  ]);

  // 2. SIRALI ÇOKLU OLAY İŞLEME MOTORU (Sequential Event Queue)
  const triggerSequentialEventsQueue = async (minuteEvents, currentMin) => {
    isSteppingRef.current = true;
    setIsSteppingState(true);

    for (const eventItem of minuteEvents) {
      const eventId = eventItem.id || `${eventItem.min}_${eventItem.type}`;
      processedEventIdsRef.current.add(eventId);

      const steps = eventItem.steps || [eventItem.description];
      const isGoalEvent = eventItem.type.includes("GOAL");

      const buildUpSteps =
        isGoalEvent && steps.length > 1
          ? steps.slice(0, steps.length - 1)
          : steps;
      const finalGoalStep =
        isGoalEvent && steps.length > 1 ? steps[steps.length - 1] : null;

      // Gelişme Cümlelerini Sırayla Oynat
      for (let i = 0; i < buildUpSteps.length; i++) {
        setActiveSentence(buildUpSteps[i]);
        const stepDelay = Math.max(1800, 2400 / simSpeed);
        await new Promise((resolve) => setTimeout(resolve, stepDelay));
      }

      // Gol Olayı İse Kutlama Efekti & Final Cümlesi
      if (isGoalEvent) {
        isGoalCelebratingRef.current = true;
        setGoalOverlay({
          isHome: eventItem.isHome,
          scorer: eventItem.scorer || eventItem.player || "Oyuncu",
          assist: eventItem.assist || null,
          min: currentMin,
        });

        // 4.5 saniye gol kutlamasında zaman ve sayaç tamamen donar
        await new Promise((resolve) => setTimeout(resolve, 4500));
        setGoalOverlay(null);
        isGoalCelebratingRef.current = false;

        if (finalGoalStep) {
          setActiveSentence(finalGoalStep);
          const finalDelay = Math.max(2500, 3200 / simSpeed);
          await new Promise((resolve) => setTimeout(resolve, finalDelay));
        }
      }

      // Olayı Sol/Alt Geçmiş Listesine Ekle
      setVisibleEvents((prev) => {
        if (prev.some((e) => e.id === eventId)) return prev;
        return [eventItem, ...prev];
      });
    }

    isSteppingRef.current = false;
    setIsSteppingState(false);
  };

  // Başlat / Duraklat Buton Handler'ı
  const handleTogglePlay = () => {
    if (!hasStarted) {
      setHasStarted(true);
      setActiveSentence(
        `🗣️ Hakem başlama düdüğünü çaldı! ${homeTeam.name} - ${awayTeam.name} karşılaşması başladı.`,
      );
    }
    setIsPlaying((prev) => !prev);
  };

  // İkinci Yarıyı Başlat Buton Handler'ı
  const handleStartSecondHalf = () => {
    setIsHalfTime(false);
    setIsPlaying(true);
    setActiveSentence(`🔔 İkinci yarı başladı! Her iki takıma da başarılar.`);
  };

  // Canlı Skor Hesaplama
  const liveHomeScore = visibleEvents.filter(
    (e) => e.type.includes("GOAL") && e.isHome,
  ).length;
  const liveAwayScore = visibleEvents.filter(
    (e) => e.type.includes("GOAL") && !e.isHome,
  ).length;

  // Gol Atanlar Listesi
  const homeGoals = visibleEvents.filter(
    (e) => e.type.includes("GOAL") && e.isHome,
  );
  const awayGoals = visibleEvents.filter(
    (e) => e.type.includes("GOAL") && !e.isHome,
  );

  // Dynamic 5-Min Possession Tracker (% calculation)
  const getDynamic5MinPossession = () => {
    const recent = visibleEvents.slice(0, 5);
    const homeCount = recent.filter((e) => e.isHome).length;
    const awayCount = recent.filter((e) => !e.isHome).length;
    if (homeCount === 0 && awayCount === 0) return { home: 54, away: 46 };
    const homePct = Math.round((homeCount / (homeCount + awayCount)) * 100);
    return {
      home: Math.max(30, Math.min(70, homePct)),
      away: 100 - Math.max(30, Math.min(70, homePct)),
    };
  };

  const dynamicPoss = getDynamic5MinPossession();

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-28">
      {/* 1. SCOREBOARD HERO SECTION (Stitch Design Scoreboard) */}
      <section className="glass-panel rounded-2xl p-5 lg:p-7 relative overflow-hidden shadow-2xl">
        {/* Ambient Team Light Glows in Background */}
        <div className="absolute -left-20 -top-20 w-72 h-72 bg-rose-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -right-20 -top-20 w-72 h-72 bg-amber-400/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute inset-0 tactical-grid opacity-30 pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-12 items-center gap-4">
          {/* Home Team (Team 1) */}
          <div className="col-span-5 flex items-center justify-end space-x-4 lg:space-x-6 text-right">
            <div>
              <div className="flex items-center justify-end space-x-2">
                <span className="text-xs text-amber-accent font-mono uppercase font-bold">
                  1. TAKIM
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  ({homeTeam.formation || "4-4-2"})
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-['Barlow_Condensed'] font-extrabold tracking-tight text-white mt-0.5 uppercase drop-shadow-sm">
                {homeTeam.name || "1. Takım"}
              </h2>

              {/* Goal Scorers List */}
              <div className="mt-2 flex flex-col items-end space-y-1">
                {homeGoals.map((g, idx) => {
                  const scorerName = g.scorer || g.player || "Gol";
                  return (
                    <div
                      key={idx}
                      className="inline-flex items-center space-x-1.5 text-xs text-[#fbbf24] font-medium font-sans"
                    >
                      <span>
                        {scorerName}
                        {g.assist ? ` (${g.assist})` : ""}
                      </span>
                      <span className="font-mono bg-[#f59e0b]/20 px-1.5 py-0.2 rounded border border-[#f59e0b]/30 text-[10px]">
                        {getDisplayMinute(g.min)}
                      </span>
                      <span className="text-slate-300">⚽</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Scoreboard Center Display */}
          <div className="col-span-2 flex flex-col items-center justify-center">
            <div className="flex items-center space-x-2 sm:space-x-3 bg-[#050913]/90 border border-[#1f2d47] rounded-xl px-4 py-2.5 shadow-2xl">
              <span className="font-['Chakra_Petch'] font-black text-4xl sm:text-5xl lg:text-6xl text-[#fbbf24] tracking-tight leading-none drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]">
                {liveHomeScore}
              </span>
              <span className="text-slate-600 font-light text-2xl sm:text-3xl">
                :
              </span>
              <span className="font-['Chakra_Petch'] font-black text-4xl sm:text-5xl lg:text-6xl text-[#38bdf8] tracking-tight leading-none drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]">
                {liveAwayScore}
              </span>
            </div>

            {/* Display Minute Badge */}
            <div className="mt-2 text-center">
              <span className="inline-block bg-[#0b1329] text-xs font-mono font-bold text-slate-200 px-3 py-1 rounded-full border border-[#1f2d47] shadow-sm">
                {getDisplayMinute(currentMinute)}
              </span>
            </div>
          </div>

          {/* Away Team (Team 2) */}
          <div className="col-span-5 flex items-center justify-start space-x-4 lg:space-x-6 text-left">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-[#38bdf8] font-mono uppercase font-bold">
                  2. TAKIM
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  ({awayTeam.formation || "4-4-2"})
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-['Barlow_Condensed'] font-extrabold tracking-tight text-white mt-0.5 uppercase drop-shadow-sm">
                {awayTeam.name || "2. Takım"}
              </h2>

              {/* Goal Scorers List */}
              <div className="mt-2 flex flex-col items-start space-y-1">
                {awayGoals.length === 0 ? (
                  <span className="text-xs text-slate-500 italic font-mono">
                    Henüz gol bulunmuyor
                  </span>
                ) : (
                  awayGoals.map((g, idx) => {
                    const scorerName = g.scorer || g.player || "Gol";
                    return (
                      <div
                        key={idx}
                        className="inline-flex items-center space-x-1.5 text-xs text-[#38bdf8] font-medium font-sans"
                      >
                        <span className="text-[#38bdf8]">⚽</span>
                        <span className="font-mono bg-[#0284c7]/20 px-1.5 py-0.2 rounded border border-[#0284c7]/30 text-[10px]">
                          {getDisplayMinute(g.min)}
                        </span>
                        <span>
                          {scorerName}
                          {g.assist ? ` (${g.assist})` : ""}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NAVIGATION TABS (Anti-Spoiler Lock Protected) */}
      <nav className="flex items-center justify-between border-b border-[#1f2d47] pb-1 overflow-x-auto custom-scrollbar">
        <div className="flex space-x-1 sm:space-x-2 min-w-max font-['Barlow_Condensed']">
          {/* CANLI ANLATIM TAB */}
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg font-bold text-xs sm:text-sm tracking-wide flex items-center space-x-2 transition cursor-pointer ${
              activeTab === "overview"
                ? "bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-[#080e1c] shadow-glow-amber font-extrabold"
                : "text-slate-300 hover:text-white hover:bg-[#11192b] border border-[#1f2d47]/50"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current animate-ping"></span>
            <span>CANLI ANLATIM</span>
          </button>

          {/* MAÇ İSTATİSTİKLERİ TAB (Spoiler Lock) */}
          <button
            onClick={() => {
              if (isMatchEnded) setActiveTab("stats");
            }}
            disabled={!isMatchEnded}
            className={`px-4 py-2 rounded-lg font-bold text-xs sm:text-sm tracking-wide flex items-center space-x-1.5 transition ${
              activeTab === "stats"
                ? "bg-gradient-to-r from-[#10b981] to-[#059669] text-[#050811] shadow-glow-emerald"
                : isMatchEnded
                  ? "text-slate-300 hover:text-white hover:bg-[#11192b] border border-[#1f2d47]/50 cursor-pointer"
                  : "text-slate-600 border border-[#1f2d47]/40 bg-[#080e1c]/40 cursor-not-allowed"
            }`}
          >
            {!isMatchEnded && <Lock size={13} className="text-amber-500" />}
            <span>MAÇ İSTATİSTİKLERİ</span>
          </button>

          {/* OYUNCU REYTİNGLERİ TAB (Spoiler Lock) */}
          <button
            onClick={() => {
              if (isMatchEnded) setActiveTab("ratings");
            }}
            disabled={!isMatchEnded}
            className={`px-4 py-2 rounded-lg font-bold text-xs sm:text-sm tracking-wide flex items-center space-x-1.5 transition ${
              activeTab === "ratings"
                ? "bg-gradient-to-r from-[#10b981] to-[#059669] text-[#050811] shadow-glow-emerald"
                : isMatchEnded
                  ? "text-slate-300 hover:text-white hover:bg-[#11192b] border border-[#1f2d47]/50 cursor-pointer"
                  : "text-slate-600 border border-[#1f2d47]/40 bg-[#080e1c]/40 cursor-not-allowed"
            }`}
          >
            {!isMatchEnded && <Lock size={13} className="text-amber-500" />}
            <span>OYUNCU REYTİNGLERİ</span>
          </button>

          {/* MAÇ RAPORU TAB (Spoiler Lock) */}
          <button
            onClick={() => {
              if (isMatchEnded) setActiveTab("report");
            }}
            disabled={!isMatchEnded}
            className={`px-4 py-2 rounded-lg font-bold text-xs sm:text-sm tracking-wide flex items-center space-x-1.5 transition ${
              activeTab === "report"
                ? "bg-gradient-to-r from-[#10b981] to-[#059669] text-[#050811] shadow-glow-emerald"
                : isMatchEnded
                  ? "text-slate-300 hover:text-white hover:bg-[#11192b] border border-[#1f2d47]/50 cursor-pointer"
                  : "text-slate-600 border border-[#1f2d47]/40 bg-[#080e1c]/40 cursor-not-allowed"
            }`}
          >
            {!isMatchEnded && <Lock size={13} className="text-amber-500" />}
            <span>MAÇ RAPORU</span>
          </button>
        </div>
      </nav>

      {/* 3. TAB 1: OVERVIEW & LIVE COMMENTARY SPOTLIGHT */}
      {activeTab === "overview" && (
        <div className="space-y-5 animate-fadeIn">
          {/* ACTIVE COMMENTARY / GOAL SPOTLIGHT CARD (In-place replacement with zero layout jump) */}
          {goalOverlay ? (
            <div className="relative overflow-hidden rounded-2xl border-2 border-[#00f59b] bg-gradient-to-r from-[#10b981]/30 via-[#00f59b]/40 to-[#10b981]/30 p-6 sm:p-8 shadow-[0_0_40px_rgba(0,245,155,0.7)] backdrop-blur-md text-center transition-all animate-goal-flash">
              <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-[#00f59b]/20 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute left-1/2 top-0 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#00f59b] to-transparent"></div>

              <div className="flex items-center justify-between mb-2">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#10b981] text-[#050811] font-black text-xs uppercase tracking-wider shadow font-['Barlow_Condensed']">
                  <span>
                    ⚽ GOL KUTLAMASI // {getDisplayMinute(goalOverlay.min)}
                  </span>
                </div>

                <span className="text-xs font-mono font-bold text-[#00f59b] flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-[#00f59b] inline-block animate-ping"></span>
                  <span>TOP AĞLARDA!</span>
                </span>
              </div>

              <div className="text-3xl sm:text-4xl lg:text-5xl font-['Barlow_Condensed'] font-extrabold uppercase text-white tracking-widest drop-shadow-[0_0_25px_rgba(0,245,155,0.8)] mt-1">
                ⚽ GOOOOOLLLLLL! ⚽
              </div>

              <div className="text-xl sm:text-2xl font-black text-[#fbbf24] mt-2 font-mono">
                {goalOverlay.scorer}
                {goalOverlay.assist ? ` (Asist: ${goalOverlay.assist})` : ""} (
                {goalOverlay.isHome ? homeTeam.name : awayTeam.name})
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-2xl border-2 border-[#f59e0b]/80 bg-gradient-to-r from-[#f59e0b]/15 via-[#fbbf24]/20 to-[#f59e0b]/15 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
              <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-[#f59e0b]/20 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute left-1/2 top-0 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent"></div>

              <div className="flex items-center justify-between mb-3">
                <div className="inline-flex items-center space-x-2.5 px-3.5 py-1 rounded-full bg-[#f59e0b] text-[#080e1c] font-black text-xs uppercase tracking-wider shadow">
                  <Flame size={14} className="fill-current" />
                  <span className="font-['Barlow_Condensed'] font-bold">
                    CANLI SPİKER ANLATIMI // {getDisplayMinute(currentMinute)}
                  </span>
                </div>

                <span className="text-xs font-mono font-bold text-[#fbbf24] flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b] inline-block animate-ping"></span>
                  <span>KRİTİK AN</span>
                </span>
              </div>

              <p className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-snug drop-shadow-md font-sans">
                {activeSentence}
              </p>
            </div>
          )}

          {/* PREVIOUS SIMULATION EVENTS STREAM TICKER */}
          <div className="glass-panel rounded-xl p-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3 px-1 flex items-center justify-between pb-2 border-b border-[#1f2d47]">
              <span>
                Önceki Pozisyon Akışı ({visibleEvents.length} Pozisyon)
              </span>
              <span className="text-[11px] text-slate-500 font-normal">
                Canlı Güncelleniyor
              </span>
            </h4>

            {visibleEvents.length === 0 ? (
              <div className="py-6 text-center text-xs font-mono text-slate-500">
                Karşılaşmada henüz pozisyon yaşanmadı.
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto pr-1 space-y-1.5 custom-scrollbar divide-y divide-[#1f2d47]/40">
                {visibleEvents.map((evt, idx) => {
                  const isGoal = evt.type.includes("GOAL");
                  const isCard =
                    evt.type.includes("YELLOW") || evt.type.includes("RED");
                  const commentaryText = evt.steps
                    ? evt.steps.join(" ")
                    : evt.text || evt.description || "";

                  return (
                    <div
                      key={evt.id || idx}
                      className={`pt-2.5 pb-1 px-2 flex items-start space-x-3.5 hover:bg-[#11192b]/40 rounded-lg transition-colors ${
                        isGoal ? "bg-rose-950/20" : ""
                      }`}
                    >
                      <span
                        className={`font-mono text-xs font-bold px-2 py-0.5 rounded border shrink-0 ${
                          isGoal
                            ? "bg-red-950/80 text-[#fbbf24] border-red-700/60"
                            : "bg-[#090e1a] text-slate-400 border-[#1f2d47]"
                        }`}
                      >
                        {getDisplayMinute(evt.min)}
                      </span>

                      <div className="flex-1 flex items-start justify-between gap-2">
                        <div className="text-xs text-slate-200">
                          {isGoal && <span className="mr-1.5">⚽</span>}
                          {isCard && (
                            <span className="inline-block w-2.5 h-3.5 bg-amber-400 rounded-sm mr-2 align-middle"></span>
                          )}
                          <span className="font-bold text-white mr-1.5">
                            [{evt.isHome ? homeTeam.name : awayTeam.name}]
                          </span>
                          <span className="text-slate-300">{commentaryText}</span>
                        </div>

                        <span
                          className={`text-[11px] font-mono font-semibold uppercase shrink-0 ${
                            isGoal
                              ? "text-[#fbbf24] font-bold"
                              : isCard
                                ? "text-amber-400"
                                : "text-slate-400"
                          }`}
                        >
                          {evt.type}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* MOMENTUM & 5-MIN POSSESSION TRACKER (Stitch Design Momentum Bar) */}
          <div className="glass-panel rounded-xl p-4 lg:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  Son 5 Dk. Baskı &amp; Topla Oynama (Momentum)
                </span>
                <span className="text-[10px] bg-[#0b1329] text-[#38bdf8] border border-[#38bdf8]/30 px-2 py-0.5 rounded font-mono font-bold">
                  CANLI ANALİZ
                </span>
              </div>

              {/* Live Percentage breakdown */}
              <div className="flex items-center space-x-4 text-xs font-mono">
                <span className="text-[#fbbf24] font-bold">
                  {homeTeam.name}: %{dynamicPoss.home}
                </span>
                <span className="text-slate-600">—</span>
                <span className="text-[#38bdf8] font-bold">
                  %{dynamicPoss.away} :{awayTeam.name}
                </span>
              </div>
            </div>

            {/* Dual-Progress Momentum Bar */}
            <div className="relative w-full h-3.5 bg-[#050913] rounded-full overflow-hidden p-0.5 border border-[#1f2d47]">
              <div className="flex h-full rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-[#f59e0b] rounded-l-full relative transition-all duration-700 shadow-[0_0_12px_rgba(245,158,11,0.6)]"
                  style={{ width: `${dynamicPoss.home}%` }}
                >
                  <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                </div>

                <div
                  className="h-full bg-gradient-to-r from-[#38bdf8] to-blue-600 rounded-r-full relative transition-all duration-700 shadow-[0_0_12px_rgba(56,189,248,0.6)]"
                  style={{ width: `${dynamicPoss.away}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: MATCH STATS */}
      {activeTab === "stats" && (
        <div className="animate-fadeIn">
          <MatchStats
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            stats={matchResult?.stats}
          />
        </div>
      )}

      {/* 5. TAB 3: PLAYER RATINGS */}
      {activeTab === "ratings" && (
        <div className="animate-fadeIn">
          <PlayerRatings
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            matchResult={matchResult}
            playerStats={matchResult?.playerStats}
          />
        </div>
      )}

      {/* 6. TAB 4: MATCH REPORT */}
      {activeTab === "report" && (
        <div className="animate-fadeIn">
          <MatchReport
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            matchResult={matchResult}
            playerStats={matchResult?.playerStats}
          />
        </div>
      )}

      {/* 7. BOTTOM SIMULATION CONTROL FOOTER (Fixed Control Bar) */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-[#080e1c]/95 border-t border-[#1f2d47] p-3 sm:p-4 backdrop-blur-xl shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Left: Play / Pause Button & Speed Controls */}
          <div className="flex items-center space-x-3">
            {isHalfTime ? (
              <button
                onClick={handleStartSecondHalf}
                type="button"
                className="flex items-center space-x-2 bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] text-[#050811] font-black font-['Barlow_Condensed'] text-sm px-6 py-2.5 rounded-xl shadow-glow-emerald transition transform active:scale-95 uppercase tracking-wider cursor-pointer"
              >
                <Play size={18} fill="currentColor" />
                <span>İKINCI YARIYI BAŞLAT ➔</span>
              </button>
            ) : (
              <button
                onClick={handleTogglePlay}
                type="button"
                className={`flex items-center space-x-2 font-black font-['Barlow_Condensed'] text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-glow-amber transition transform active:scale-95 uppercase tracking-wider cursor-pointer ${
                  isPlaying
                    ? "bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#fbbf24] hover:to-[#f59e0b] text-[#080e1c]"
                    : "bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] text-[#050811]"
                }`}
              >
                {isPlaying ? (
                  <Pause size={16} />
                ) : (
                  <Play size={16} fill="currentColor" />
                )}
                <span>
                  {isPlaying
                    ? "DURAKLAT (PAUSE)"
                    : hasStarted
                      ? "DEVAM ET (RESUME)"
                      : "MAÇI BAŞLAT (KICK-OFF)"}
                </span>
              </button>
            )}

            {/* Speed Switcher Pills */}
            <div className="flex items-center bg-[#090e1a] border border-[#1f2d47] rounded-xl p-1 space-x-1 font-mono text-xs">
              <span className="text-slate-400 text-[10px] px-2 font-bold uppercase hidden sm:inline">
                HIZ:
              </span>
              <button
                onClick={() => setSimSpeed(1)}
                type="button"
                className={`px-3 py-1 rounded-lg transition font-bold ${
                  simSpeed === 1
                    ? "bg-[#38bdf8] text-[#080e1c] shadow-[0_0_12px_rgba(56,189,248,0.5)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                1x
              </button>
              <button
                onClick={() => setSimSpeed(2)}
                type="button"
                className={`px-3 py-1 rounded-lg transition font-bold ${
                  simSpeed === 2
                    ? "bg-[#38bdf8] text-[#080e1c] shadow-[0_0_12px_rgba(56,189,248,0.5)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                2x
              </button>
              <button
                onClick={() => setSimSpeed(5)}
                type="button"
                className={`px-3.5 py-1 rounded-lg transition font-bold ${
                  simSpeed === 5
                    ? "bg-[#38bdf8] text-[#080e1c] shadow-[0_0_12px_rgba(56,189,248,0.5)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                5x
              </button>
            </div>
          </div>

          {/* Right: Simulation Actions (Restart Match) */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onResetMatch}
              type="button"
              className="flex items-center space-x-2 bg-[#090e1a] hover:bg-[#11192b] text-slate-300 hover:text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-[#1f2d47] transition hover:border-slate-400 cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Yeniden Simüle Et</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function getAmbientSentence(min, homeName, awayName) {
  const sentences = [
    `Tribünlerden coşkulu tezahüratlar yükseliyor, ${homeName} taraftarları takımlarına büyük destek veriyor.`,
    `Orta sahada kıyasıya ikili mücadeleler yaşanıyor, ${awayName} presle topu kapmaya çalışıyor.`,
    `Maçın temposu oldukça yüksek, iki takım da disiplinli savunma anlayışını koruyor.`,
    `Teknik direktörler saha kenarında oyuncularına uyarılarda bulunuyor.`,
    `Orta alanda kısa paslarla oyun yeniden kuruluyor.`,
  ];
  return sentences[min % sentences.length];
}
