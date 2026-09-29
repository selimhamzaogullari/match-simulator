import React, { useState, useEffect, useRef } from "react";
import { TEAMS_DATA } from "./data/teams";
import { simulateMatchWithOpenAI } from "./services/openaiMatchService";
import DraftPickScreen from "./components/DraftPickScreen";
import SquadSetupWizard from "./components/SquadSetupWizard";
import AiSimulatingLoader from "./components/AiSimulatingLoader";
import Cm0102MatchView from "./components/Cm0102MatchView";
import {
  PlayCircle,
  BarChart2,
  MessageSquare,
  Award,
  Settings,
  Sparkles,
  Search,
} from "lucide-react";

export default function App() {
  // Akış Modu: 'draft' (1. Ekran Oyuncu Arama & Seçim) -> 'tactics' (2. Ekran Taktik & Diziliş) -> 'match' (3. Ekran Saf Maç)
  const [flowState, setFlowState] = useState("draft");
  const [isAiSimulating, setIsAiSimulating] = useState(false);

  // Varsayılan Takımlar (Arama Ekranında 0/11 Boş Başlar, Oyuncu Eklemeye Hazır)
  const [homeTeam, setHomeTeam] = useState({
    id: "team_1",
    name: "Draft-1",
    primaryColor: "#a90429",
    secondaryColor: "#ffffff",
    logoText: "🔴",
    formation: "4-4-2",
    squad: [],
  });

  const [awayTeam, setAwayTeam] = useState({
    id: "team_2",
    name: "Draft-2",
    primaryColor: "#002d62",
    secondaryColor: "#ffffff",
    logoText: "🔵",
    formation: "4-4-2",
    squad: [],
  });

  const [homeFormation, setHomeFormation] = useState("4-4-2");
  const [awayFormation, setAwayFormation] = useState("4-4-2");

  // Aktif Sekme (Maç Ekranında 2D Pitch, Overview, Match Stats, Report)
  const [activeTab, setActiveTab] = useState("2d-pitch");

  // Maç Durumu (Timer: 0 -> 5400 saniye = 90 dk)
  const [matchTime, setMatchTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [simSpeed, setSimSpeed] = useState(1);

  // Simülasyon Çıktısı (Events, Stats, Highlights)
  const [matchResult, setMatchResult] = useState(null);
  const [currentHighlight, setCurrentHighlight] = useState(null);

  const timerRef = useRef(null);

  // 1. EKRAN: DRAFT ARAMA İLE OYUNCU EKLEME / ÇIKARMA HANDLER'LARI
  const handleAddPlayerToTeam = (teamType, player) => {
    const isHome = teamType === "home";
    const targetTeam = isHome ? homeTeam : awayTeam;
    const squad = targetTeam.squad || [];

    if (squad.length >= 11) return;
    if (squad.some((p) => p.id === player.id)) return;

    const updatedSquad = [...squad, player];
    const updatedTeam = { ...targetTeam, squad: updatedSquad };

    if (isHome) setHomeTeam(updatedTeam);
    else setAwayTeam(updatedTeam);
  };

  const handleRemovePlayerFromTeam = (teamType, playerId) => {
    const isHome = teamType === "home";
    const targetTeam = isHome ? homeTeam : awayTeam;
    const updatedSquad = (targetTeam.squad || []).filter(
      (p) => p.id !== playerId,
    );
    const updatedTeam = { ...targetTeam, squad: updatedSquad };

    if (isHome) setHomeTeam(updatedTeam);
    else setAwayTeam(updatedTeam);
  };

  const handleUpdateTeamName = (teamType, newName) => {
    if (teamType === "home") {
      setHomeTeam((prev) => ({ ...prev, name: newName }));
    } else {
      setAwayTeam((prev) => ({ ...prev, name: newName }));
    }
  };

  const handleAutoFillTeams = () => {
    setHomeTeam({
      ...homeTeam,
      name: TEAMS_DATA[0].name,
      squad: TEAMS_DATA[0].squad,
    });
    setAwayTeam({
      ...awayTeam,
      name: TEAMS_DATA[1].name,
      squad: TEAMS_DATA[1].squad,
    });
  };

  // 2. EKRANA GEÇİŞ: DRAFT -> TAKTİK (11 vs 11 TAM OLMALIDIR)
  const handleProceedToTactics = () => {
    const homeCount = homeTeam.squad?.length || 0;
    const awayCount = awayTeam.squad?.length || 0;

    if (homeCount < 11 || awayCount < 11) {
      alert(
        `Taktiklere geçebilmek için her iki takımın da 11 oyuncusu tamamlanmalıdır.\n\n${homeTeam.name || "1. Takım"}: ${homeCount}/11\n${awayTeam.name || "2. Takım"}: ${awayCount}/11`,
      );
      return;
    }
    setFlowState("tactics");
  };

  // 3. EKRANA GEÇİŞ: TAKTİK -> OPENAI CHATGPT MAÇ SİMÜLASYONU
  const handleStartMatchSimulation = async () => {
    setIsAiSimulating(true);
    setIsPlaying(false);
    setMatchTime(0);

    // OpenAI ChatGPT ile Maç Simülasyonunu Çağır
    const result = await simulateMatchWithOpenAI(homeTeam, awayTeam);

    setMatchResult(result);
    setCurrentHighlight(null);
    setIsAiSimulating(false);
    setFlowState("match");
    setIsPlaying(true); // Canlı maçı başlat
  };

  // Zamanlayıcı Döngüsü
  useEffect(() => {
    if (isPlaying && flowState === "match") {
      const intervalMs = 1000 / simSpeed;
      timerRef.current = setInterval(() => {
        setMatchTime((prev) => {
          if (prev >= 5400) {
            setIsPlaying(false);
            setActiveTab("report");
            return 5400;
          }
          const nextTime = prev + 60;

          const currentMin = Math.floor(nextTime / 60);
          if (matchResult && matchResult.highlights) {
            const h = matchResult.highlights.find((x) => x.min === currentMin);
            if (h) setCurrentHighlight(h);
          }

          return nextTime;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, simSpeed, matchResult, flowState]);

  const handleTogglePlay = () => setIsPlaying((prev) => !prev);
  const handleResetMatch = () => handleStartMatchSimulation();
  const handleInstantFinish = () => {
    setIsPlaying(false);
    setMatchTime(5400);
    setActiveTab("report");
  };

  const handleUpdateFormation = (teamType, fmt) => {
    if (teamType === "home") {
      setHomeFormation(fmt);
      setHomeTeam((prev) => ({ ...prev, formation: fmt }));
    } else {
      setAwayFormation(fmt);
      setAwayTeam((prev) => ({ ...prev, formation: fmt }));
    }
  };

  const handleSwapSquadPlayers = (teamType, idx1, idx2) => {
    const isHome = teamType === "home";
    const targetTeam = isHome ? homeTeam : awayTeam;
    const newSquad = [...(targetTeam.squad || [])];

    const temp = newSquad[idx1];
    newSquad[idx1] = newSquad[idx2];
    newSquad[idx2] = temp;

    const updatedTeam = { ...targetTeam, squad: newSquad };
    if (isHome) setHomeTeam(updatedTeam);
    else setAwayTeam(updatedTeam);
  };

  const currentMin = Math.floor(matchTime / 60);
  const visibleEvents = matchResult
    ? matchResult.events.filter((e) => e.min <= currentMin)
    : [];

  const liveHomeScore = visibleEvents.filter(
    (e) => e.type.includes("GOAL") && e.isHome,
  ).length;
  const liveAwayScore = visibleEvents.filter(
    (e) => e.type.includes("GOAL") && !e.isHome,
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 pb-16">
      {/* YAPAY ZEKÂ MAÇ SİMÜLASYONU YÜKLENİYOR OVERLAY */}
      <AiSimulatingLoader
        isVisible={isAiSimulating}
        homeTeamName={homeTeam.name}
        awayTeamName={awayTeam.name}
      />

      {/* Header Banner (Tactical Match Pulse TopBrandHeader) */}
      <header className="w-full border-b border-pitch-border/80 bg-pitch-dark/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo & Badge */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-accent to-amber-soft flex items-center justify-center shadow-glow-amber">
              <span className="text-xl">⚽</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-athletic font-extrabold text-2xl tracking-wider uppercase text-white">
                  TACTICAL MATCH PULSE
                </span>
                <span className="hidden sm:inline-block text-[10px] bg-amber-accent/20 text-amber-glow font-mono px-2 py-0.5 rounded-full border border-amber-accent/40">
                  OpenAI GPT-4o
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono tracking-tight">
                Taktik ve Kadro Simülasyon Merkezi
              </p>
            </div>
          </div>

          {/* Navigation Steps Indicator */}
          <nav
            aria-label="Simülasyon Aşamaları"
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider font-athletic"
          >
            {/* Step 1: Kadro Kurulumu */}
            <div
              onClick={() => {
                if (flowState !== "match") setFlowState("draft");
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${
                flowState === "draft"
                  ? "bg-amber-accent/15 text-amber-glow border border-amber-accent/40 shadow-sm"
                  : flowState === "match"
                    ? "text-slate-600 opacity-50 cursor-not-allowed"
                    : "text-slate-400 hover:text-white cursor-pointer"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${
                  flowState === "draft"
                    ? "bg-amber-accent text-pitch-dark"
                    : "border border-slate-500"
                }`}
              >
                1
              </span>
              <span>Kadro Kurulumu</span>
            </div>

            <div className="w-4 h-[1px] bg-pitch-border"></div>

            {/* Step 2: Taktik Tahtası */}
            <div
              onClick={() => {
                if (
                  flowState !== "match" &&
                  homeTeam.squad?.length === 11 &&
                  awayTeam.squad?.length === 11
                ) {
                  setFlowState("tactics");
                }
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${
                flowState === "tactics"
                  ? "bg-amber-accent/15 text-amber-glow border border-amber-accent/40 shadow-sm"
                  : flowState === "match"
                    ? "text-slate-600 opacity-50 cursor-not-allowed"
                    : homeTeam.squad?.length === 11 &&
                        awayTeam.squad?.length === 11
                      ? "text-slate-400 hover:text-white cursor-pointer"
                      : "text-slate-600 opacity-50 cursor-not-allowed"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${
                  flowState === "tactics"
                    ? "bg-amber-accent text-pitch-dark"
                    : "border border-slate-500"
                }`}
              >
                2
              </span>
              <span>Taktik Tahtası</span>
            </div>

            <div className="w-4 h-[1px] bg-pitch-border"></div>

            {/* Step 3: Canlı Simülasyon */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${
                flowState === "match"
                  ? "bg-amber-accent/15 text-amber-glow border border-amber-accent/40 shadow-sm"
                  : "text-slate-600 opacity-50"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${
                  flowState === "match"
                    ? "bg-amber-accent text-pitch-dark"
                    : "border border-slate-500"
                }`}
              >
                3
              </span>
              <span>Canlı Simülasyon</span>
            </div>
          </nav>
        </div>
      </header>

      {/* Ana İçerik Konteyneri */}
      <main className="max-w-7xl mx-auto px-4 pt-6">
        {/* EKRAN 1: OYUN CU ARAMA VE SEÇİM EKRANI (DRAFT SCREEN) */}
        {flowState === "draft" && (
          <DraftPickScreen
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            onAddPlayerToTeam={handleAddPlayerToTeam}
            onRemovePlayerFromTeam={handleRemovePlayerFromTeam}
            onUpdateTeamName={handleUpdateTeamName}
            onAutoFillTeams={handleAutoFillTeams}
            onProceedToTactics={handleProceedToTactics}
          />
        )}

        {/* EKRAN 2: TAKTİK VE DİZİLİŞ EKRANI (TACTICAL PITCH BOARD) */}
        {flowState === "tactics" && (
          <SquadSetupWizard
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            onUpdateFormation={handleUpdateFormation}
            onSwapSquadPlayers={handleSwapSquadPlayers}
            onBackToDraftScreen={() => setFlowState("draft")}
            onStartMatch={handleStartMatchSimulation}
          />
        )}

        {/* EKRAN 3: SAF MAÇ SİMÜLASYONU EKRANI (CM 01/02 STİLİ CANLI SPİKER ANLATIMI) */}
        {flowState === "match" && (
          <div className="animate-fadeIn">
            <Cm0102MatchView
              homeTeam={homeTeam}
              awayTeam={awayTeam}
              matchResult={matchResult}
              onResetMatch={handleStartMatchSimulation}
            />
          </div>
        )}
      </main>
    </div>
  );
}
