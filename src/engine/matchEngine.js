// CM 03/04 Gerçekçi Maç Simülasyon Motoru (Match Engine v2.5 - Safe ID Guaranteed)

import { FORMATION_LAYOUTS } from '../data/teams';

export function calculateTeamRating(team) {
  if (!team || !team.squad || team.squad.length === 0) return 75;
  const validSquad = team.squad.filter(Boolean);
  if (validSquad.length === 0) return 75;
  const total = validSquad.reduce((sum, p) => sum + (p.ovr || 75), 0);
  return Math.round(total / validSquad.length);
}

function getPoissonGoals(lambda) {
  let L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

export function simulateFullMatch(homeTeam, awayTeam, homeFormationKey = "4-4-2", awayFormationKey = "4-4-2") {
  // Boş slotları varsayılan oyuncularla güvenli doldur (Kadroda 11 oyuncu garanti olsun)
  const homeSquad = ensureSquad11(homeTeam.squad, "Ev Sahibi");
  const awaySquad = ensureSquad11(awayTeam.squad, "Deplasman");

  const homeOvr = calculateTeamRating({ squad: homeSquad });
  const awayOvr = calculateTeamRating({ squad: awaySquad });

  const homeAtt = averageAttr(homeSquad, ['sho', 'pac', 'dri']);
  const homeDef = averageAttr(homeSquad, ['def', 'phy', 'heading']);
  const awayAtt = averageAttr(awaySquad, ['sho', 'pac', 'dri']);
  const awayDef = averageAttr(awaySquad, ['def', 'phy', 'heading']);

  const ovrDiff = (homeOvr - awayOvr) / 20.0;
  
  let expectedHomeGoals = Math.max(0.4, Math.min(3.2, 1.35 + ovrDiff + (homeAtt - awayDef) * 0.02 + 0.2));
  let expectedAwayGoals = Math.max(0.3, Math.min(2.9, 1.15 - ovrDiff + (awayAtt - homeDef) * 0.02));

  let homeTargetGoals = Math.min(4, getPoissonGoals(expectedHomeGoals));
  let awayTargetGoals = Math.min(4, getPoissonGoals(expectedAwayGoals));

  const events = [];
  const highlights = [];
  const playerStats = {};

  // Oyuncu İstatistik Takip Nesnelerini Benzersiz ID ile Garanti Et
  [...homeSquad, ...awaySquad].forEach((p, idx) => {
    const safeId = p.id || `player_${idx}_${Math.random()}`;
    p.id = safeId; // ID garanti et

    playerStats[safeId] = {
      id: safeId,
      name: p.name || `Oyuncu ${idx + 1}`,
      teamId: homeSquad.includes(p) ? (homeTeam.id || 'home') : (awayTeam.id || 'away'),
      goals: 0,
      assists: 0,
      shots: 0,
      shotsOnTarget: 0,
      passes: Math.floor(25 + Math.random() * 35),
      tackles: Math.floor(1 + Math.random() * 5),
      saves: 0,
      rating: 6.5
    };
  });

  const homeGoalMins = [];
  while (homeGoalMins.length < homeTargetGoals) {
    const m = Math.floor(Math.random() * 88) + 2;
    if (!homeGoalMins.includes(m)) homeGoalMins.push(m);
  }
  const awayGoalMins = [];
  while (awayGoalMins.length < awayTargetGoals) {
    const m = Math.floor(Math.random() * 88) + 2;
    if (!awayGoalMins.includes(m) && !homeGoalMins.includes(m)) awayGoalMins.push(m);
  }

  const homeShotsTotal = Math.floor(7 + Math.random() * 7 + homeTargetGoals * 1.5);
  const awayShotsTotal = Math.floor(5 + Math.random() * 7 + awayTargetGoals * 1.5);
  const homeShotsOnTargetTotal = Math.max(homeTargetGoals, Math.floor(homeShotsTotal * (0.35 + Math.random() * 0.2)));
  const awayShotsOnTargetTotal = Math.max(awayTargetGoals, Math.floor(awayShotsTotal * (0.35 + Math.random() * 0.2)));

  const homeCornersTotal = Math.floor(3 + Math.random() * 5);
  const awayCornersTotal = Math.floor(2 + Math.random() * 5);

  const homeFoulsTotal = Math.floor(7 + Math.random() * 6);
  const awayFoulsTotal = Math.floor(8 + Math.random() * 6);

  const homeYellowCardsTotal = Math.floor(Math.random() * 3);
  const awayYellowCardsTotal = Math.floor(Math.random() * 3);

  for (let min = 1; min <= 90; min++) {
    // 1. Ev Sahibi Gol Anı
    if (homeGoalMins.includes(min)) {
      const striker = getRandomPlayerByPos(homeSquad, ['ST', 'LW', 'RW', 'CAM']) || homeSquad[0];
      const passer = getRandomPlayerByPos(homeSquad, ['CAM', 'CM', 'LM', 'RM', 'LW', 'RW']) || homeSquad[1];
      const gk = awaySquad.find(p => p.pos === 'GK') || awaySquad[0];

      if (striker && playerStats[striker.id]) {
        playerStats[striker.id].goals++;
        playerStats[striker.id].shots++;
        playerStats[striker.id].shotsOnTarget++;
        playerStats[striker.id].rating += 1.1;
      }

      if (passer && passer.id !== striker.id && playerStats[passer.id]) {
        playerStats[passer.id].assists++;
        playerStats[passer.id].rating += 0.5;
      }

      const steps = [
        `${homeTeam.name || 'Ev Sahibi'} geriden pasla çıkıyor.`,
        `${passer ? passer.name : 'Orta saha'} topu kontrol etti, çizgiye harika bıraktı.`,
        `${striker.name} ceza sahasına ivmelendi!`,
        `Nefis bir şut! Kaleci ${gk ? gk.name : 'Kaleci'} çaresiz!`,
        `⚽ GOL! Top filelerle buluştu! ${min}' ${striker.name} skor tabelasını değiştiriyor!`
      ];

      events.push({ min, type: 'GOAL', steps, text: steps.join(' '), teamId: homeTeam.id || 'home', scorer: striker.name, isHome: true });
      highlights.push(createHighlight(min, 'GOAL', homeTeam.id || 'home', homeTeam.id || 'home', striker, passer, homeFormationKey, awayFormationKey));
    }

    // 2. Deplasman Gol Anı
    if (awayGoalMins.includes(min)) {
      const striker = getRandomPlayerByPos(awaySquad, ['ST', 'LW', 'RW', 'CAM']) || awaySquad[0];
      const passer = getRandomPlayerByPos(awaySquad, ['CAM', 'CM', 'LM', 'RM', 'LW', 'RW']) || awaySquad[1];
      const gk = homeSquad.find(p => p.pos === 'GK') || homeSquad[0];

      if (striker && playerStats[striker.id]) {
        playerStats[striker.id].goals++;
        playerStats[striker.id].shots++;
        playerStats[striker.id].shotsOnTarget++;
        playerStats[striker.id].rating += 1.1;
      }

      if (passer && passer.id !== striker.id && playerStats[passer.id]) {
        playerStats[passer.id].assists++;
        playerStats[passer.id].rating += 0.5;
      }

      const steps = [
        `${awayTeam.name || 'Deplasman'} orta alanda topu kazandı.`,
        `${passer ? passer.name : 'Orta saha'} savunmanın arkasına havadan sarkıttı.`,
        `${striker.name} kaleciyle karşı karşıya!`,
        `Gelişine sert vurdu!`,
        `⚽ GOL! Mükemmel bir vuruş! ${min}' ${striker.name} ağları sarstı!`
      ];

      events.push({ min, type: 'GOAL', steps, text: steps.join(' '), teamId: awayTeam.id || 'away', scorer: striker.name, isHome: false });
      highlights.push(createHighlight(min, 'GOAL', awayTeam.id || 'away', homeTeam.id || 'home', striker, passer, homeFormationKey, awayFormationKey));
    }

    // 3. Kaçan Pozisyonlar ve Kurtarışlar
    if (!homeGoalMins.includes(min) && !awayGoalMins.includes(min) && Math.random() < 0.16) {
      const isHomeTeam = Math.random() < 0.52;
      const team = isHomeTeam ? homeTeam : awayTeam;
      const squad = isHomeTeam ? homeSquad : awaySquad;
      const enemySquad = isHomeTeam ? awaySquad : homeSquad;
      const enemyGK = enemySquad.find(p => p.pos === 'GK') || enemySquad[0];
      const player = getRandomPlayerByPos(squad, ['ST', 'LW', 'RW', 'CAM']) || squad[0];

      if (player && playerStats[player.id]) {
        playerStats[player.id].shots++;

        const isSaved = Math.random() < 0.55;
        if (isSaved) {
          playerStats[player.id].shotsOnTarget++;
          if (enemyGK && playerStats[enemyGK.id]) {
            playerStats[enemyGK.id].saves++;
            playerStats[enemyGK.id].rating += 0.3;
          }
          const steps = [
            `${team.name} kanattan bindiriyor.`,
            `${player.name} ceza sahası yayında topla buluştu.`,
            `Yerden sert vurdu!`,
            `🧤 İnanılmaz refleks! Kaleci ${enemyGK ? enemyGK.name : 'Kaleci'} son anda parmaklarının ucuyla çeldi!`
          ];
          events.push({ min, type: 'SAVE', steps, text: steps.join(' '), teamId: team.id, isHome: isHomeTeam });
        } else {
          const steps = [
            `${team.name} hızlı atağa kalktı.`,
            `${player.name} önünü boşalttı, uzaktan kaleyi düşündü.`,
            `Füzeyi gönderdi...`,
            `💨 Top az farkla direğin yanından auta çıktı!`
          ];
          events.push({ min, type: 'MISS', steps, text: steps.join(' '), teamId: team.id, isHome: isHomeTeam });
        }
      }
    }

    // 4. Kartlar
    if (Math.random() < 0.04) {
      const isHomeTeam = Math.random() < 0.5;
      const squad = isHomeTeam ? homeSquad : awaySquad;
      const defender = squad.find(p => p.pos === 'CB' || p.pos === 'CDM' || p.pos === 'RB' || p.pos === 'LB') || squad[0];
      if (defender && playerStats[defender.id]) {
        playerStats[defender.id].rating -= 0.3;
        const steps = [
          `Orta sahada kıran kırana mücadele.`,
          `Sert müdahale! Hakem düdüğünü çaldı.`,
          `🟨 ${defender.name} sarı kart görüyor.`
        ];
        events.push({ min, type: 'YELLOW', steps, text: steps.join(' '), teamId: isHomeTeam ? homeTeam.id : awayTeam.id, isHome: isHomeTeam });
      }
    }
  }

  Object.keys(playerStats).forEach(id => {
    let r = playerStats[id].rating;
    playerStats[id].rating = Number(Math.min(9.8, Math.max(5.2, r)).toFixed(1));
  });

  return {
    homeScore: homeTargetGoals,
    awayScore: awayTargetGoals,
    stats: {
      homePossession: Math.round(48 + Math.random() * 8),
      awayPossession: Math.round(48 + Math.random() * 8),
      homeShots: homeShotsTotal,
      awayShots: awayShotsTotal,
      homeShotsOnTarget: homeShotsOnTargetTotal,
      awayShotsOnTarget: awayShotsOnTargetTotal,
      homeCorners: homeCornersTotal,
      awayCorners: awayCornersTotal,
      homeFouls: homeFoulsTotal,
      awayFouls: awayFoulsTotal,
      homeYellowCards: homeYellowCardsTotal,
      awayYellowCards: awayYellowCardsTotal,
      homeXG: Number((homeTargetGoals * 0.75 + homeShotsTotal * 0.05).toFixed(2)),
      awayXG: Number((awayTargetGoals * 0.75 + awayShotsTotal * 0.05).toFixed(2))
    },
    events: events.sort((a, b) => a.min - b.min),
    highlights,
    playerStats
  };
}

// 11 Oyuncuyu Garanti Eden Yardımcı Fonksiyon
function ensureSquad11(squad, teamTag) {
  const result = squad ? [...squad].filter(Boolean) : [];
  const defaultPositions = ['GK', 'RB', 'CB', 'CB', 'LB', 'CDM', 'CM', 'CAM', 'RW', 'LW', 'ST'];

  while (result.length < 11) {
    const idx = result.length;
    const pos = defaultPositions[idx] || 'CM';
    result.push({
      id: `${teamTag.toLowerCase()}_gen_${idx}_${Math.random().toString(36).substr(2, 5)}`,
      name: `${teamTag} Oyuncu ${idx + 1}`,
      pos: pos,
      ovr: 75,
      pac: 75,
      sho: 70,
      pas: 75,
      dri: 72,
      def: 70,
      phy: 74
    });
  }

  // Her oyuncuya id ata
  return result.map((p, idx) => ({
    ...p,
    id: p.id || `${teamTag.toLowerCase()}_${idx}_${Math.random().toString(36).substr(2, 5)}`
  }));
}

function averageAttr(squad, attrs) {
  if (!squad || squad.length === 0) return 75;
  let sum = 0;
  squad.forEach(p => {
    attrs.forEach(a => {
      sum += (p[a] || 75);
    });
  });
  return Math.round(sum / (squad.length * attrs.length));
}

function getRandomPlayerByPos(squad, positions) {
  const matches = squad.filter(p => positions.includes(p.pos));
  if (matches.length > 0) return matches[Math.floor(Math.random() * matches.length)];
  return squad[Math.floor(Math.random() * squad.length)];
}

function createHighlight(min, type, attackingTeamId, homeTeamId, primaryPlayer, secondaryPlayer, homeFormationKey, awayFormationKey) {
  const homeLayout = FORMATION_LAYOUTS[homeFormationKey] || FORMATION_LAYOUTS["4-4-2"];
  const awayLayout = FORMATION_LAYOUTS[awayFormationKey] || FORMATION_LAYOUTS["4-4-2"];

  const homeDots = homeLayout.positions.map((p, idx) => ({
    id: `home_${idx}`,
    team: 'home',
    num: idx + 1,
    role: p.role,
    x: p.x,
    y: p.y
  }));

  const awayDots = awayLayout.positions.map((p, idx) => ({
    id: `away_${idx}`,
    team: 'away',
    num: idx + 1,
    role: p.role,
    x: 100 - p.x,
    y: 100 - p.y
  }));

  return {
    min,
    type,
    attackingTeamId,
    primaryPlayerName: primaryPlayer ? primaryPlayer.name : "Oyuncu",
    secondaryPlayerName: secondaryPlayer ? secondaryPlayer.name : "",
    homeDots,
    awayDots,
    durationMs: type.includes('GOAL') ? 6000 : 4000
  };
}
