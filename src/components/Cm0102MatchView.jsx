import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward, MessageSquare, BarChart2, Shield, Award, Users, Trophy, Lock } from 'lucide-react';
import MatchStats from './MatchStats';
import MatchReport from './MatchReport';

export default function Cm0102MatchView({
  homeTeam,
  awayTeam,
  matchResult,
  onResetMatch
}) {
  const [matchTimeSec, setMatchTimeSec] = useState(0); // 0 -> (90+extra) * 60 saniye
  const [isPlaying, setIsPlaying] = useState(false); // BAŞLANGIÇTA DURAKLATILMIŞ (MANUEL KICK-OFF)
  const [hasStarted, setHasStarted] = useState(false);
  const [simSpeed, setSimSpeed] = useState(1); // 1x, 2x, 5x
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'stats' | 'ratings' | 'report'

  // Rastgele Uzatma Süreleri (Maç Başına Üretilir)
  const [stoppageTime] = useState(() => ({
    firstHalf: Math.floor(Math.random() * 4) + 1, // +1 ile +4 dakika arası
    secondHalf: Math.floor(Math.random() * 5) + 2  // +2 ile +6 dakika arası
  }));

  // Canlı Takip State'leri
  const [activeSentence, setActiveSentence] = useState("Karşılaşma başlamak üzere...");
  const [visibleEvents, setVisibleEvents] = useState([]);
  const [liveHomeScore, setLiveHomeScore] = useState(0);
  const [liveAwayScore, setLiveAwayScore] = useState(0);

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
  const isMatchEnded = currentMinute >= maxMatchMin || matchTimeSec >= maxMatchMin * 60;

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

  // 1. ZAMANLAYICI VE CANLI CÜMLE AKIŞ MOTORU (CM 01/02 TIMELINE ENGINE - KESİN ZAMAN KİLİTLİ)
  useEffect(() => {
    if (!isPlaying || isHalfTime || isGoalCelebratingRef.current || isSteppingState || !hasStarted) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = 1000 / simSpeed;

    timerRef.current = setInterval(() => {
      setMatchTimeSec(prevSec => {
        const totalMaxSec = maxMatchMin * 60;

        if (prevSec >= totalMaxSec) {
          setIsPlaying(false);
          const motm = matchResult?.manOfTheMatch;
          const motmText = motm ? ` 🌟 Maçın Adamı: ${motm.name} (${motm.rating} Puan).` : '';
          setActiveSentence(`🏆 MAÇ BİTTİ! Hakem son düdüğü çaldı.${motmText} Karşılaşma sona erdi!`);
          setActiveTab('report');
          return totalMaxSec;
        }

        const nextSec = prevSec + 60; // 1 dk ilerle
        const min = Math.floor(nextSec / 60);

        // 45. Dakikada 4. Hakem Duyurusu
        if (min === 45 && prevSec === 44 * 60) {
          setActiveSentence(`📢 Dördüncü hakem tabelayı kaldırdı: İlk yarının sonuna en az +${stoppageTime.firstHalf} dakika ek süre ilave edildi!`);
        }

        // 90. Dakikada 4. Hakem Duyurusu
        if (min === 90 && prevSec === 89 * 60) {
          setActiveSentence(`📢 Dördüncü hakem tabelayı kaldırdı: Maçın sonuna en az +${stoppageTime.secondHalf} dakika ek süre ilave edildi!`);
        }

        // İlk Yarı Sonu Duraklatması (45 + Uzatma)
        if (min >= maxFirstHalfMin && prevSec < maxFirstHalfMin * 60) {
          setIsPlaying(false);
          setIsHalfTime(true);
          setActiveSentence("İlk yarı sona erdi. Takımlar soyunma odasına gidiyor.");
          return maxFirstHalfMin * 60;
        }

        // O anki dakikadaki henüz İŞLENMEMİŞ tüm olayları bul
        const unprocessedForMin = events.filter(e => e.min === min && !processedEventIdsRef.current.has(e.id || `${e.min}_${e.type}_${e.scorer}`));

        if (unprocessedForMin.length > 0) {
          // Dakikadaki tüm olayları sırayla çalıştır
          triggerSequentialEventsQueue(unprocessedForMin);
        } else if (!isSteppingRef.current && min !== 45 && min !== 90) {
          // Akıllı Boş Dakika Cümle Mantığı (10 Dk Kuralı)
          const idleText = getSmartIdleSentence(min, events);
          setActiveSentence(idleText);
        }

        return nextSec;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHalfTime, isSteppingState, hasStarted, simSpeed, events, maxFirstHalfMin, maxMatchMin, stoppageTime, matchResult]);

  // AKILLI BOŞ DAKİKA CÜMLE MANTIĞI (10 Dk Aralık Kuralı)
  const getSmartIdleSentence = (min, eventList) => {
    if (min === maxFirstHalfMin + 1) return "İkinci yarı başladı!";

    const nextEvent = eventList.find(e => e.min > min);
    const prevEvents = eventList.filter(e => e.min < min);
    const lastEvent = prevEvents.length > 0 ? prevEvents[prevEvents.length - 1] : null;

    const timeToNext = nextEvent ? (nextEvent.min - min) : 99;
    const timeSinceLast = lastEvent ? (min - lastEvent.min) : min;

    if (timeToNext < 10) {
      return "Maç devam ediyor...";
    }

    if (timeSinceLast <= 4) {
      return "Maç devam ediyor...";
    }

    if (timeSinceLast >= 5 && timeSinceLast <= 8) {
      return "Tribünlerden coşkulu tezahüratlar yükseliyor...";
    }

    if (timeSinceLast >= 9 && timeSinceLast <= 12) {
      return "Orta alanda kıran kırana taktiksel mücadele sürerken tempo dengeleniyor.";
    }

    return "Maç devam ediyor...";
  };

  // SİNEMATİK GOL AKIŞI & OKUMA SÜRESİ 2.4S
  const triggerSequentialEventsQueue = (eventItems) => {
    if (isSteppingRef.current || eventItems.length === 0) return;
    isSteppingRef.current = true;
    setIsSteppingState(true); // Dakika sayacını dondur!

    let eventIdx = 0;

    const processNextEvent = () => {
      if (eventIdx >= eventItems.length) {
        isSteppingRef.current = false;
        setIsSteppingState(false); // Tüm olaylar bitti, sayacı çöz!
        return;
      }

      const eventItem = eventItems[eventIdx];
      const eventKey = eventItem.id || `${eventItem.min}_${eventIdx}_${eventItem.type}`;
      processedEventIdsRef.current.add(eventKey);

      const steps = eventItem.steps || [eventItem.text || "Pozisyon gelişiyor..."];
      const isGoalEvent = eventItem.type.includes('GOAL');
      let stepIdx = 0;

      // Gol olaylarında son cümle (filelere gitti cümlesi) öncesine kadar pre-goal adımları oynatılır
      const maxPreGoalStepIdx = isGoalEvent && steps.length >= 2 ? steps.length - 2 : steps.length - 1;

      const stepInterval = setInterval(() => {
        if (stepIdx <= maxPreGoalStepIdx) {
          const sentence = steps[stepIdx];
          
          setActiveSentence(sentence);

          // GOL PATLAMASI KONTROLÜ (Şut/Kafa vuruşu cümlesinden sonra patlar)
          if (isGoalEvent && stepIdx === maxPreGoalStepIdx && !isGoalCelebratingRef.current) {
            clearInterval(stepInterval);
            isGoalCelebratingRef.current = true;

            // 1. SKORU GÜNCELLE VE KOCAMAN GOL KARTINI AÇ
            if (eventItem.isHome) {
              setLiveHomeScore(prev => Math.max(prev, countGoalsUntil(eventItem.min, true, eventKey)));
            } else {
              setLiveAwayScore(prev => Math.max(prev, countGoalsUntil(eventItem.min, false, eventKey)));
            }

            setGoalOverlay({
              isHome: eventItem.isHome,
              teamName: eventItem.isHome ? (homeTeam.name || 'Ev Sahibi') : (awayTeam.name || 'Deplasman'),
              scorer: eventItem.scorer || 'Gol',
              min: eventItem.min
            });

            // 2. 4.5 SANİYE SEVİNÇTEN SONRA SON GOL CÜMLESİNİ (AĞLARA GİTTİ) SARI BANDA BAS
            setTimeout(() => {
              setGoalOverlay(null);
              isGoalCelebratingRef.current = false;

              const finalNetSentence = steps[steps.length - 1]; // Son gol cümlesi
              setActiveSentence(finalNetSentence);

              // 3. Son gol cümlesi ekranda 3.5 saniye dursun, sonra maça devam et
              setTimeout(() => {
                setVisibleEvents(prev => {
                  if (prev.some(e => (e.id && e.id === eventKey) || (e.min === eventItem.min && e.type === eventItem.type && e.scorer === eventItem.scorer))) return prev;
                  return [...prev, eventItem];
                });

                eventIdx++;
                processNextEvent();
              }, 3500 / simSpeed);

            }, 4500);

            return;
          }

          stepIdx++;
        } else {
          clearInterval(stepInterval);

          setVisibleEvents(prev => {
            if (prev.some(e => (e.id && e.id === eventKey) || (e.min === eventItem.min && e.type === eventItem.type && e.scorer === eventItem.scorer))) return prev;
            return [...prev, eventItem];
          });

          eventIdx++;
          processNextEvent();
        }
      }, 2400 / simSpeed); // 2.4 saniye okuma süresi
    };

    processNextEvent();
  };

  const countGoalsUntil = (targetMin, isHome, currentEventKey) => {
    let count = 0;
    events.forEach(e => {
      const eKey = e.id || `${e.min}_${e.type}`;
      if (e.type.includes('GOAL') && e.isHome === isHome) {
        if (e.min < targetMin || (e.min === targetMin && (processedEventIdsRef.current.has(eKey) || eKey === currentEventKey))) {
          count++;
        }
      }
    });
    return count;
  };

  // DİNAMİK 5 DAKİKALIK TOPLA OYNAMA ORANI HESAPLAMA
  const getDynamic5MinPossession = () => {
    const overallHomePoss = matchResult?.stats?.homePossession || 50;

    const recentEvents = events.filter(e => e.min >= currentMinute - 5 && e.min <= currentMinute);
    const homeRecentAttacks = recentEvents.filter(e => e.isHome).length;
    const awayRecentAttacks = recentEvents.filter(e => !e.isHome).length;

    let homeDynamic = overallHomePoss;
    if (homeRecentAttacks > awayRecentAttacks) {
      homeDynamic += Math.min(18, (homeRecentAttacks - awayRecentAttacks) * 6);
    } else if (awayRecentAttacks > homeRecentAttacks) {
      homeDynamic -= Math.min(18, (awayRecentAttacks - homeRecentAttacks) * 6);
    } else {
      const wave = Math.round(Math.sin(currentMinute * 0.5) * 4);
      homeDynamic += wave;
    }

    const finalHomePoss = Math.min(82, Math.max(18, Math.round(homeDynamic)));
    const finalAwayPoss = 100 - finalHomePoss;

    return { home: finalHomePoss, away: finalAwayPoss };
  };

  const dynamicPoss = getDynamic5MinPossession();

  // Gol atanlar listesi
  const homeGoalScorers = visibleEvents.filter(e => e.isHome && e.type.includes('GOAL'));
  const awayGoalScorers = visibleEvents.filter(e => !e.isHome && e.type.includes('GOAL'));

  // İlk Yarı Maçı Başlat (Kick Off Duyurusuyla) Handler'ı
  const handleKickOffMatch = () => {
    setHasStarted(true);
    setActiveSentence("Hakem ilk düdüğü çaldı! Maç başladı!");
    setTimeout(() => {
      setIsPlaying(true);
    }, 2400 / simSpeed);
  };

  // İkinci Yarıyı Başlat Handler'ı
  const handleStartSecondHalf = () => {
    setMatchTimeSec((maxFirstHalfMin + 1) * 60); // İkinci yarı başlangıç dakikası
    setIsHalfTime(false);
    setIsPlaying(true);
    setActiveSentence("İkinci yarı başladı! İki takıma da başarılar.");
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-[#070d1e] text-slate-100 rounded-2xl border-4 border-[#1e295d] shadow-2xl overflow-hidden font-sans select-none my-2 relative">
      
      {/* KOCAMAN GOL ANİMASYONU OVERLAY (GOAL CELEBRATION OVERLAY) */}
      {goalOverlay && (
        <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center animate-fadeIn p-6">
          <div className="relative group text-center">
            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500 via-amber-300 to-yellow-500 rounded-3xl blur-xl opacity-80 animate-pulse"></div>
            
            <div className="relative bg-gradient-to-b from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 px-10 py-8 rounded-2xl border-8 border-yellow-300 shadow-2xl transform scale-105 transition-all">
              <div className="flex items-center justify-center gap-3 text-4xl sm:text-6xl font-black mb-2 animate-bounce">
                <span>⚽</span>
                <span className="tracking-widest">GOOOOOLLLL!</span>
                <span>⚽</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 uppercase tracking-wide mb-2">
                {goalOverlay.teamName}
              </h2>

              <div className="bg-slate-950/90 text-yellow-300 px-6 py-2 rounded-xl text-lg sm:text-2xl font-black font-mono inline-block border border-yellow-400/50 shadow-inner">
                {goalOverlay.scorer} {getDisplayMinute(goalOverlay.min)}
              </div>

              <p className="text-xs font-mono font-bold text-slate-900 mt-4 tracking-wider uppercase">
                Skor Güncellendi: {liveHomeScore} - {liveAwayScore}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 1. EFSANEVİ CM 01/02 RETRO SKOR TABELASI (TOP SCOREBOARD) */}
      <div className="bg-gradient-to-b from-[#0e1b40] to-[#09122c] border-b-4 border-[#1e2e67] p-3 sm:p-5 relative">
        <div className="flex items-center justify-between max-w-4xl mx-auto gap-2">
          
          {/* Ev Sahibi Takım Kutusu */}
          <div className="flex-1 flex items-center justify-end gap-3 sm:gap-4">
            <div className="text-right">
              <h2 className="text-lg sm:text-2xl font-black tracking-wide text-blue-400 drop-shadow-md">
                {homeTeam.name || 'Ev Sahibi'}
              </h2>
              <div className="text-[11px] text-slate-300 font-mono flex flex-wrap justify-end gap-x-2">
                {homeGoalScorers.map((g, idx) => (
                  <span key={idx} className="text-yellow-400 font-semibold">
                    {g.scorer || 'Gol'} {getDisplayMinute(g.min)}
                  </span>
                ))}
              </div>
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#001038] border-2 border-yellow-400 rounded-lg flex items-center justify-center text-2xl sm:text-3xl font-black text-yellow-400 shadow-inner">
              {liveHomeScore}
            </div>
          </div>

          {/* Orta Dakika Kutusu */}
          <div className="flex flex-col items-center justify-center px-2">
            <div className="bg-[#000b26] border border-blue-500/50 px-3 py-1 rounded text-yellow-300 font-mono font-black text-base sm:text-xl shadow-md min-w-[70px] text-center">
              {getDisplayMinute(currentMinute)}
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
              {!hasStarted ? 'HAZIR' : isHalfTime ? 'DEVRE ARASI' : isMatchEnded ? 'BİTTİ' : 'CANLI'}
            </span>
          </div>

          {/* Deplasman Takım Kutusu */}
          <div className="flex-1 flex items-center justify-start gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#001038] border-2 border-yellow-400 rounded-lg flex items-center justify-center text-2xl sm:text-3xl font-black text-yellow-400 shadow-inner">
              {liveAwayScore}
            </div>
            <div className="text-left">
              <h2 className="text-lg sm:text-2xl font-black tracking-wide text-blue-400 drop-shadow-md">
                {awayTeam.name || 'Deplasman'}
              </h2>
              <div className="text-[11px] text-slate-300 font-mono flex flex-wrap justify-start gap-x-2">
                {awayGoalScorers.map((g, idx) => (
                  <span key={idx} className="text-yellow-400 font-semibold">
                    {g.scorer || 'Gol'} {getDisplayMinute(g.min)}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. CM 01/02 RETRO SEKMELER (TOP TAB BAR) */}
      <div className="bg-[#0b1736] border-b-2 border-[#1a2b5c] px-4 py-2 flex items-center justify-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-1.5 rounded text-xs font-black tracking-wider transition-all border cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-yellow-400 text-slate-950 border-yellow-300 shadow-md scale-105'
              : 'bg-[#0f2048] text-blue-200 border-blue-800/60 hover:bg-[#162d66]'
          }`}
        >
          MATCH OVERVIEW
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-1.5 rounded text-xs font-black tracking-wider transition-all border cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'stats'
              ? 'bg-yellow-400 text-slate-950 border-yellow-300 shadow-md scale-105'
              : 'bg-[#0f2048] text-blue-200 border-blue-800/60 hover:bg-[#162d66]'
          }`}
        >
          {!isMatchEnded && <Lock size={12} className="text-yellow-400" />}
          <span>MATCH STATS</span>
        </button>

        <button
          onClick={() => setActiveTab('ratings')}
          className={`px-4 py-1.5 rounded text-xs font-black tracking-wider transition-all border cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'ratings'
              ? 'bg-yellow-400 text-slate-950 border-yellow-300 shadow-md scale-105'
              : 'bg-[#0f2048] text-blue-200 border-blue-800/60 hover:bg-[#162d66]'
          }`}
        >
          {!isMatchEnded && <Lock size={12} className="text-yellow-400" />}
          <span>PLAYER RATINGS</span>
        </button>

        <button
          onClick={() => setActiveTab('report')}
          className={`px-4 py-1.5 rounded text-xs font-black tracking-wider transition-all border cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'report'
              ? 'bg-yellow-400 text-slate-950 border-yellow-300 shadow-md scale-105'
              : 'bg-[#0f2048] text-blue-200 border-blue-800/60 hover:bg-[#162d66]'
          }`}
        >
          {!isMatchEnded && <Lock size={12} className="text-yellow-400" />}
          <span>MATCH REPORT</span>
        </button>
      </div>

      {/* 3. ANA İÇERİK ALANI */}
      <div className="p-4 sm:p-6 bg-gradient-to-b from-[#070e24] via-[#0b1633] to-[#060c20] min-h-[420px] flex flex-col justify-between">
        
        {/* MAÇ BAŞLAMADAN ÖNCEKİ KICK OFF EKRANI */}
        {!hasStarted && matchTimeSec === 0 && (
          <div className="bg-[#091538] border-4 border-yellow-400/80 rounded-2xl p-6 text-center my-auto shadow-2xl space-y-4 animate-fadeIn">
            <h3 className="text-xl sm:text-3xl font-black text-yellow-300 tracking-wider">
              ⚽ MAÇ BAŞLAMAK ÜZERE ⚽
            </h3>

            <div className="text-xl sm:text-3xl font-extrabold text-white font-mono bg-[#030816] py-3 px-6 rounded-xl border border-blue-800/60 inline-block shadow-inner">
              {homeTeam.name || 'Ev Sahibi'} vs {awayTeam.name || 'Deplasman'}
            </div>

            <p className="text-sm font-mono text-slate-300">
              Takımlar sahaya çıktı, hakem ilk düdük için hazırlıklarını tamamlıyor.
            </p>

            <div>
              <button
                onClick={handleKickOffMatch}
                className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 text-slate-950 font-black text-base sm:text-lg px-8 py-3.5 rounded-xl shadow-xl hover:scale-105 transition-all border-2 border-yellow-200 cursor-pointer active:scale-95"
              >
                ⚡ MAÇI BAŞLAT (KICK OFF) ⚡
              </button>
            </div>
          </div>
        )}

        {/* DEVRE ARASI ÖZEL EKRANI */}
        {isHalfTime && (
          <div className="bg-[#091538] border-4 border-yellow-400/80 rounded-2xl p-6 text-center my-auto shadow-2xl space-y-4 animate-fadeIn">
            <h3 className="text-xl sm:text-3xl font-black text-yellow-300 tracking-wider">
              ☕ İLK YARI SONA ERDİ ☕
            </h3>

            <div className="text-2xl sm:text-4xl font-extrabold text-white font-mono bg-[#030816] py-3 px-6 rounded-xl border border-blue-800/60 inline-block shadow-inner">
              {homeTeam.name || 'Ev Sahibi'} {liveHomeScore} - {liveAwayScore} {awayTeam.name || 'Deplasman'}
            </div>

            <p className="text-sm font-mono text-slate-300">
              İlk yarıya +{stoppageTime.firstHalf} dakika ek süre eklendi ve tamamlandı. Takımlar soyunma odasında.
            </p>

            <div>
              <button
                onClick={handleStartSecondHalf}
                className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-slate-950 font-black text-base sm:text-lg px-8 py-3.5 rounded-xl shadow-xl hover:scale-105 transition-all border-2 border-emerald-300 cursor-pointer active:scale-95"
              >
                ⚡ İKİNCİ YARIYI BAŞLAT ⚡
              </button>
            </div>
          </div>
        )}

        {/* SEKMEYE GÖRE İÇERİK (Maç Başlamışsa & Devre Arası Değilken) */}
        {hasStarted && !isHalfTime && activeTab === 'overview' && (
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            
            {/* CM 01/02 EFSANEVİ DEV SARI SPİKER BANTI (YELLOW FLASH TICKER - CLEAN WITHOUT MINUTE) */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 via-amber-300 to-yellow-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              
              <div className="relative bg-[#ffff00] text-slate-950 p-6 sm:p-8 rounded-xl border-4 border-amber-400 shadow-2xl text-center min-h-[140px] flex flex-col items-center justify-center transform transition-all duration-300">
                <span className="text-xs font-mono font-black tracking-widest text-slate-800 uppercase mb-2 bg-yellow-300/80 px-3 py-0.5 rounded-full">
                  ⚡ CANLI SPİKER ANLATIMI ⚡
                </span>
                
                <p className="text-lg sm:text-2xl font-black leading-snug tracking-tight text-slate-950 font-sans animate-pulse max-w-3xl">
                  {activeSentence}
                </p>
              </div>
            </div>

            {/* DİNAMİK SON 5 DAKİKA TOPLA OYNAMA BAR (DYNAMIC ROLLING POSSESSION BAR) */}
            <div className="bg-[#0a1538] border border-blue-800/60 rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2 font-mono">
                <span>Last 5 Mins (Son 5 Dk Topla Oynama)</span>
                <span className="text-yellow-400 font-black">
                  {dynamicPoss.home}% - {dynamicPoss.away}%
                </span>
              </div>
              <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden flex border border-blue-900">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500" 
                  style={{ width: `${dynamicPoss.home}%` }}
                ></div>
                <div 
                  className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 transition-all duration-500" 
                  style={{ width: `${dynamicPoss.away}%` }}
                ></div>
              </div>
            </div>

            {/* HAKEM VE HAVA DURUMU SÜSÜ */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-2 border-t border-blue-900/40 pt-3">
              <span>Referee: Michele Giordano</span>
              <span>Weather: Dry, 18°C</span>
              <span>Stadium: Giuseppe Meazza</span>
            </div>

          </div>
        )}

        {/* MAÇ STATS SEKMESİ (MAÇ DEVAM EDERKEN KİLİTLİ) */}
        {hasStarted && !isHalfTime && activeTab === 'stats' && (
          !isMatchEnded ? (
            <div className="bg-[#091538] border-4 border-yellow-400/80 rounded-2xl p-8 text-center my-auto shadow-2xl space-y-4 animate-fadeIn">
              <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto border border-yellow-400/40">
                <Lock size={32} className="text-yellow-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-yellow-300 tracking-wider">
                🔒 MAÇ DEVAM EDİYOR 🔒
              </h3>
              <p className="text-sm font-mono text-slate-300 max-w-md mx-auto leading-relaxed">
                Sürprizleri önlemek için istatistikler hakem son düdüğü çaldığında erişilebilir olacaktır.
              </p>
              <div className="text-xs font-mono text-yellow-400 font-bold bg-yellow-400/10 py-1.5 px-4 rounded-full inline-block border border-yellow-400/30">
                Mevcut Dakika: {getDisplayMinute(currentMinute)}
              </div>
            </div>
          ) : (
            <MatchStats
              homeTeam={homeTeam}
              awayTeam={awayTeam}
              stats={matchResult ? matchResult.stats : null}
            />
          )
        )}

        {/* PLAYER RATINGS SEKMESİ (MAÇ DEVAM EDERKEN KİLİTLİ) */}
        {hasStarted && !isHalfTime && activeTab === 'ratings' && (
          !isMatchEnded ? (
            <div className="bg-[#091538] border-4 border-yellow-400/80 rounded-2xl p-8 text-center my-auto shadow-2xl space-y-4 animate-fadeIn">
              <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto border border-yellow-400/40">
                <Lock size={32} className="text-yellow-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-yellow-300 tracking-wider">
                🔒 MAÇ DEVAM EDİYOR 🔒
              </h3>
              <p className="text-sm font-mono text-slate-300 max-w-md mx-auto leading-relaxed">
                Sürprizleri önlemek için oyuncu performans puanları maç tamamlandığında açılacaktır.
              </p>
              <div className="text-xs font-mono text-yellow-400 font-bold bg-yellow-400/10 py-1.5 px-4 rounded-full inline-block border border-yellow-400/30">
                Mevcut Dakika: {getDisplayMinute(currentMinute)}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ev Sahibi Puanları */}
              <div className="bg-[#091536] border border-blue-800/60 rounded-xl p-4">
                <h3 className="text-sm font-black text-yellow-400 mb-3 border-b border-blue-800/40 pb-2 flex justify-between">
                  <span>{homeTeam.name} - OYUNCU PUANLARI</span>
                  <span className="text-slate-400">RATINGS</span>
                </h3>
                <div className="space-y-1.5 text-xs font-mono">
                  {(homeTeam.squad || []).map((p, idx) => {
                    const pStat = matchResult?.playerStats?.[`home_${p.name}`] || { rating: 7.0, goals: 0 };
                    return (
                      <div key={idx} className="flex justify-between items-center bg-[#0d1e4a]/60 px-3 py-1.5 rounded border border-blue-900/30">
                        <span className="font-semibold text-slate-200">
                          {p.pos || 'CM'} - {p.name} {pStat.goals > 0 && `⚽`.repeat(pStat.goals)}
                        </span>
                        <span className={`font-extrabold px-2 py-0.5 rounded ${
                          pStat.rating >= 8.0 ? 'bg-emerald-500 text-slate-950' : pStat.rating >= 7.0 ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {pStat.rating}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Deplasman Puanları */}
              <div className="bg-[#091536] border border-blue-800/60 rounded-xl p-4">
                <h3 className="text-sm font-black text-yellow-400 mb-3 border-b border-blue-800/40 pb-2 flex justify-between">
                  <span>{awayTeam.name} - OYUNCU PUANLARI</span>
                  <span className="text-slate-400">RATINGS</span>
                </h3>
                <div className="space-y-1.5 text-xs font-mono">
                  {(awayTeam.squad || []).map((p, idx) => {
                    const pStat = matchResult?.playerStats?.[`away_${p.name}`] || { rating: 7.0, goals: 0 };
                    return (
                      <div key={idx} className="flex justify-between items-center bg-[#0d1e4a]/60 px-3 py-1.5 rounded border border-blue-900/30">
                        <span className="font-semibold text-slate-200">
                          {p.pos || 'CM'} - {p.name} {pStat.goals > 0 && `⚽`.repeat(pStat.goals)}
                        </span>
                        <span className={`font-extrabold px-2 py-0.5 rounded ${
                          pStat.rating >= 8.0 ? 'bg-emerald-500 text-slate-950' : pStat.rating >= 7.0 ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {pStat.rating}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )
        )}

        {/* MATCH REPORT SEKMESİ (MAÇ DEVAM EDERKEN KİLİTLİ) */}
        {hasStarted && !isHalfTime && activeTab === 'report' && (
          !isMatchEnded ? (
            <div className="bg-[#091538] border-4 border-yellow-400/80 rounded-2xl p-8 text-center my-auto shadow-2xl space-y-4 animate-fadeIn">
              <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto border border-yellow-400/40">
                <Lock size={32} className="text-yellow-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-yellow-300 tracking-wider">
                🔒 MAÇ DEVAM EDİYOR 🔒
              </h3>
              <p className="text-sm font-mono text-slate-300 max-w-md mx-auto leading-relaxed">
                Sürprizleri önlemek için detaylı maç spiker raporu ve Maçın Adamı analizi maç tamamlandığında açılacaktır.
              </p>
              <div className="text-xs font-mono text-yellow-400 font-bold bg-yellow-400/10 py-1.5 px-4 rounded-full inline-block border border-yellow-400/30">
                Mevcut Dakika: {getDisplayMinute(currentMinute)}
              </div>
            </div>
          ) : (
            <MatchReport
              homeTeam={homeTeam}
              awayTeam={awayTeam}
              matchResult={matchResult}
              playerStats={matchResult ? matchResult.playerStats : null}
            />
          )
        )}

      </div>

      {/* 4. ALTKISIM KONTROL VE EYLEM BUTONLARI (CM 01/02 BUTTON BAR) */}
      <div className="bg-[#091433] border-t-4 border-[#1e2e67] p-3 flex flex-wrap items-center justify-between gap-3">
        
        {/* Sol Hız ve Oynat Butonları */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (!hasStarted) setHasStarted(true);
              setIsPlaying(!isPlaying);
            }}
            className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} />}
            <span>{isPlaying ? 'PAUSE (DURAKLAT)' : 'PLAY (DEVAM ET)'}</span>
          </button>

          <div className="flex items-center bg-[#050b1a] rounded-lg p-1 border border-blue-900 text-xs font-mono">
            <span className="text-slate-400 text-[10px] px-2 font-bold">HIZ:</span>
            {[1, 2, 5].map(spd => (
              <button
                key={spd}
                onClick={() => setSimSpeed(spd)}
                className={`px-2.5 py-1 rounded font-black cursor-pointer ${
                  simSpeed === spd ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Sağ Yeniden Başlat & Anında Bitir */}
        <div className="flex items-center gap-2">
          <button
            onClick={onResetMatch}
            className="bg-[#0e214d] hover:bg-[#16306e] text-blue-200 border border-blue-700/60 font-mono font-bold px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Yeniden Simüle Et</span>
          </button>

          <button
            onClick={() => {
              setMatchTimeSec(maxMatchMin * 60);
              setHasStarted(true);
              setIsPlaying(false);
              setIsHalfTime(false);
              const motm = matchResult?.manOfTheMatch;
              const motmText = motm ? ` 🌟 Maçın Adamı: ${motm.name} (${motm.rating} Puan).` : '';
              setActiveSentence(`🏆 MAÇ BİTTİ! Hakem son düdüğü çaldı.${motmText} Simülasyon tamamlandı.`);
              setActiveTab('report');
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-black px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
          >
            <FastForward size={14} />
            <span>Anında Bitir</span>
          </button>
        </div>

      </div>

    </div>
  );
}
