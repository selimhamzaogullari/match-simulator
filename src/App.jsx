import React, { useState, useEffect, useRef } from 'react';
import { TEAMS_DATA } from './data/teams';
import { simulateMatchWithOpenAI } from './services/openaiMatchService';
import DraftPickScreen from './components/DraftPickScreen';
import SquadSetupWizard from './components/SquadSetupWizard';
import AiSimulatingLoader from './components/AiSimulatingLoader';
import Cm0102MatchView from './components/Cm0102MatchView';
import { PlayCircle, BarChart2, MessageSquare, Award, Settings, Sparkles, Search } from 'lucide-react';

export default function App() {
  // Akış Modu: 'draft' (1. Ekran Oyuncu Arama & Seçim) -> 'tactics' (2. Ekran Taktik & Diziliş) -> 'match' (3. Ekran Saf Maç)
  const [flowState, setFlowState] = useState('draft');
  const [isAiSimulating, setIsAiSimulating] = useState(false);

  // Varsayılan Takımlar (Arama Ekranında 0/11 Boş Başlar, Oyuncu Eklemeye Hazır)
  const [homeTeam, setHomeTeam] = useState({
    id: "team_1",
    name: "Fenerbahçe Legends",
    primaryColor: "#a90429",
    secondaryColor: "#ffffff",
    logoText: "🔴",
    formation: "4-4-2",
    squad: []
  });

  const [awayTeam, setAwayTeam] = useState({
    id: "team_2",
    name: "Lüleburgazspor",
    primaryColor: "#002d62",
    secondaryColor: "#ffffff",
    logoText: "🔵",
    formation: "4-4-2",
    squad: []
  });

  const [homeFormation, setHomeFormation] = useState("4-4-2");
  const [awayFormation, setAwayFormation] = useState("4-4-2");

  // Aktif Sekme (Maç Ekranında 2D Pitch, Overview, Match Stats, Report)
  const [activeTab, setActiveTab] = useState('2d-pitch');

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
    const isHome = teamType === 'home';
    const targetTeam = isHome ? homeTeam : awayTeam;
    const squad = targetTeam.squad || [];

    if (squad.length >= 11) return;
    if (squad.some(p => p.id === player.id)) return;

    const updatedSquad = [...squad, player];
    const updatedTeam = { ...targetTeam, squad: updatedSquad };

    if (isHome) setHomeTeam(updatedTeam);
    else setAwayTeam(updatedTeam);
  };

  const handleRemovePlayerFromTeam = (teamType, playerId) => {
    const isHome = teamType === 'home';
    const targetTeam = isHome ? homeTeam : awayTeam;
    const updatedSquad = (targetTeam.squad || []).filter(p => p.id !== playerId);
    const updatedTeam = { ...targetTeam, squad: updatedSquad };

    if (isHome) setHomeTeam(updatedTeam);
    else setAwayTeam(updatedTeam);
  };

  const handleUpdateTeamName = (teamType, newName) => {
    if (teamType === 'home') {
      setHomeTeam(prev => ({ ...prev, name: newName }));
    } else {
      setAwayTeam(prev => ({ ...prev, name: newName }));
    }
  };

  const handleAutoFillTeams = () => {
    setHomeTeam({
      ...homeTeam,
      name: TEAMS_DATA[0].name,
      squad: TEAMS_DATA[0].squad
    });
    setAwayTeam({
      ...awayTeam,
      name: TEAMS_DATA[1].name,
      squad: TEAMS_DATA[1].squad
    });
  };

  // 2. EKRANA GEÇİŞ: DRAFT -> TAKTİK (11 vs 11 TAM OLMALIDIR)
  const handleProceedToTactics = () => {
    const homeCount = homeTeam.squad?.length || 0;
    const awayCount = awayTeam.squad?.length || 0;

    if (homeCount < 11 || awayCount < 11) {
      alert(`Taktiklere geçebilmek için her iki takımın da 11 oyuncusu tamamlanmalıdır.\n\n${homeTeam.name || '1. Takım'}: ${homeCount}/11\n${awayTeam.name || '2. Takım'}: ${awayCount}/11`);
      return;
    }
    setFlowState('tactics');
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
    setFlowState('match');
    setIsPlaying(true); // Canlı maçı başlat
  };

  // Zamanlayıcı Döngüsü
  useEffect(() => {
    if (isPlaying && flowState === 'match') {
      const intervalMs = 1000 / simSpeed;
      timerRef.current = setInterval(() => {
        setMatchTime(prev => {
          if (prev >= 5400) {
            setIsPlaying(false);
            setActiveTab('report');
            return 5400;
          }
          const nextTime = prev + 60;

          const currentMin = Math.floor(nextTime / 60);
          if (matchResult && matchResult.highlights) {
            const h = matchResult.highlights.find(x => x.min === currentMin);
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

  const handleTogglePlay = () => setIsPlaying(prev => !prev);
  const handleResetMatch = () => handleStartMatchSimulation();
  const handleInstantFinish = () => {
    setIsPlaying(false);
    setMatchTime(5400);
    setActiveTab('report');
  };

  const handleUpdateFormation = (teamType, fmt) => {
    if (teamType === 'home') {
      setHomeFormation(fmt);
      setHomeTeam(prev => ({ ...prev, formation: fmt }));
    } else {
      setAwayFormation(fmt);
      setAwayTeam(prev => ({ ...prev, formation: fmt }));
    }
  };

  const handleSwapSquadPlayers = (teamType, idx1, idx2) => {
    const isHome = teamType === 'home';
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
  const visibleEvents = matchResult ? matchResult.events.filter(e => e.min <= currentMin) : [];

  const liveHomeScore = visibleEvents.filter(e => e.type.includes('GOAL') && e.isHome).length;
  const liveAwayScore = visibleEvents.filter(e => e.type.includes('GOAL') && !e.isHome).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 pb-16">
      
      {/* YAPAY ZEKÂ MAÇ SİMÜLASYONU YÜKLENİYOR OVERLAY */}
      <AiSimulatingLoader 
        isVisible={isAiSimulating} 
        homeTeamName={homeTeam.name} 
        awayTeamName={awayTeam.name} 
      />

      {/* Header Banner */}
      <header className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 py-3.5 px-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-950">
              ⚽
            </div>
            <div>
              <h1 className="text-lg font-black tracking-wider text-white flex items-center gap-2">
                CM 03/04 MATCH SIMULATOR
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                  ChatGPT AI Engine
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 font-mono">OpenAI Powered Tactical Match Simulation</p>
            </div>
          </div>

          {/* Üst Yönlendirme Butonları */}
          <div className="flex items-center gap-2">
            {flowState === 'tactics' && (
              <button
                onClick={() => setFlowState('draft')}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono font-bold px-3 py-1.5 rounded-xl border border-slate-700 text-xs flex items-center gap-1.5 transition-all"
              >
                <Search size={14} />
                <span>Oyuncu Arama Ekranı</span>
              </button>
            )}

            {flowState === 'match' && (
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setFlowState('tactics');
                }}
                className="bg-slate-900 hover:bg-slate-800 text-emerald-400 font-mono font-bold px-3 py-1.5 rounded-xl border border-slate-700 text-xs flex items-center gap-1.5 transition-all"
              >
                <Settings size={14} />
                <span>⚙️ Taktiklere Dön</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Ana İçerik Konteyneri */}
      <main className="max-w-7xl mx-auto px-4 pt-6">
        
        {/* EKRAN 1: OYUN CU ARAMA VE SEÇİM EKRANI (DRAFT SCREEN) */}
        {flowState === 'draft' && (
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
        {flowState === 'tactics' && (
          <SquadSetupWizard
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            onUpdateFormation={handleUpdateFormation}
            onSwapSquadPlayers={handleSwapSquadPlayers}
            onBackToDraftScreen={() => setFlowState('draft')}
            onStartMatch={handleStartMatchSimulation}
          />
        )}

        {/* EKRAN 3: SAF MAÇ SİMÜLASYONU EKRANI (CM 01/02 STİLİ CANLI SPİKER ANLATIMI) */}
        {flowState === 'match' && (
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
