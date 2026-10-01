// OpenAI ChatGPT Maç Simülasyonu Servisi (GPT-4o / GPT-4o-Mini Powered Match Engine)

import { FORMATION_LAYOUTS } from "../data/teams";
import { simulateFullMatch as fallbackSimulateMatch } from "../engine/matchEngine";

const SYSTEM_PROMPT = `You are a World-Class Turkish Football Match Engine & Commentary Simulator (in the legendary spiker persona of Yalçın Çetin & Ercan Taner).
Your task is to simulate a realistic, thrilling, and tactical 90-minute football match between two teams based on their lineups, player real-world capabilities, and positioning.

CORE ENGINE RULES:
1. OUTPUT SCHEMA: Return ONLY a valid JSON object matching the required schema. No additional text or markdown wrappers outside the JSON.

2. REALISM, TACTICS & DISPARITY EVALUATION:
   - Evaluate the actual real-world skill level and peak/current quality of all 22 players.
   - POSITION PENALTY: Pay strict attention to player positions. If players are assigned drastically out of position (e.g., an outfield player in goal, a striker at center-back), apply massive performance and defensive penalties. The opposing team MUST ruthlessly exploit these tactical vulnerabilities.
   - SQUAD QUALITY DISPARITY: When there is a major skill or tier gap between the teams, reflect it fully in possession, total shots, and scoreline. In extreme mismatches or severe position penalties, generate realistic heavy blowout scores (e.g., 7-0, 9-1, 10-0).

3. TIMELINE & EVENT DIVERSITY:
   - Generate between 20 and 40 dynamic gameplay events across the 90 minutes.
   - Provide a realistic mix of goals, saves, misses, post hits, corners, cards, fouls, and offsides matching the natural flow of the match.
   - Do NOT include match end or final whistle items in the timeline array.

4. TURKISH COMMENTARY STEPS:
   - For EVERY timeline item, include a 'steps' array of 4 to 8 detailed, sequential Turkish commentary sentences.
   - Commentary must follow the action step-by-step using actual player names from the lineups, ending with the explicit outcome of the play (goal, save, clearance, card, etc.).

JSON SCHEMA REQUIREMENT:
{
  "matchSummary": {
    "homeScore": number,
    "awayScore": number,
    "halfTimeScore": { "home": number, "away": number },
    "manOfTheMatch": {
      "name": "string",
      "team": "home" | "away",
      "rating": number,
      "summary": "string"
    }
  },
  "stats": {
    "possession": { "home": number, "away": number },
    "shots": { "home": number, "away": number },
    "shotsOnTarget": { "home": number, "away": number },
    "passAccuracy": { "home": number, "away": number },
    "totalPasses": { "home": number, "away": number },
    "corners": { "home": number, "away": number },
    "fouls": { "home": number, "away": number },
    "offsides": { "home": number, "away": number },
    "yellowCards": { "home": number, "away": number },
    "redCards": { "home": number, "away": number },
    "xG": { "home": number, "away": number }
  },
  "timeline": [
    {
      "min": number (1 to 90),
      "type": "GOAL" | "CORNER_GOAL" | "FREEKICK_GOAL" | "PENALTY_GOAL" | "SAVE" | "POST" | "MISS" | "CORNER" | "YELLOW" | "RED" | "FOUL" | "OFFSIDE" | "INJURY",
      "team": "home" | "away",
      "scorer": "string (optional)",
      "assist": "string (optional)",
      "steps": [
        "Sentence 1 (Build-up pass in Turkish)",
        "Sentence 2 (Midfield transition in Turkish)",
        "Sentence 3 (Cross, pass, or duel in Turkish)",
        "Sentence 4 (Shot, save, card, or goal celebration in Turkish)"
      ]
    }
  ],
  "playerRatings": {
    "home": [{ "name": "string", "pos": "string", "rating": number, "goals": number, "assists": number }],
    "away": [{ "name": "string", "pos": "string", "rating": number, "goals": number, "assists": number }]
  }
}`;

export async function simulateMatchWithOpenAI(homeTeam, awayTeam) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const modelName = import.meta.env.VITE_OPENAI_MODEL || "gpt-5.4-mini";

  // API Key kontrolü - Eğer tanımlı değilse veya varsayılansa yerel motor çalışır
  if (!apiKey || apiKey === "your_openai_api_key_here") {
    console.warn(
      "OpenAI API Key bulunamadı (.env dosyasını doldurun). Yerel simülatör çalıştırılıyor...",
    );
    return fallbackSimulateMatch(homeTeam, awayTeam);
  }

  // OpenAI Kullanıcı Mesajının Hazırlanması
  const homeSquadList = (homeTeam.squad || [])
    .map((p, i) => `${i + 1}. ${p.pos || "CM"} - ${p.name}`)
    .join("\n");
  const awaySquadList = (awayTeam.squad || [])
    .map((p, i) => `${i + 1}. ${p.pos || "CM"} - ${p.name}`)
    .join("\n");

  const userPrompt = `Simulate the following football match:

HOME TEAM:
Name: ${homeTeam.name || "Ev Sahibi"}
Formation: ${homeTeam.formation || "4-4-2"}
Lineup:
${homeSquadList}

AWAY TEAM:
Name: ${awayTeam.name || "Deplasman"}
Formation: ${awayTeam.formation || "4-4-2"}
Lineup:
${awaySquadList}

Generate a dynamic timeline of 20 to 40 events spanning minute 1 to 90. Write dramatic multi-step Turkish commentary for every item using player names from the lineups. Return ONLY the JSON object.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.75,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI API Hatası:", errText);
      return fallbackSimulateMatch(homeTeam, awayTeam);
    }

    const data = await response.json();
    const rawJson = data.choices[0].message.content;
    const parsed = JSON.parse(rawJson);

    // Dönen veriyi uygulamamızın formatına dönüştürme
    return formatAiResponse(parsed, homeTeam, awayTeam);
  } catch (error) {
    console.error("OpenAI Simülasyon Hatası:", error);
    return fallbackSimulateMatch(homeTeam, awayTeam);
  }
}

// AI Çıktısını Uygulama Veri Mimarisine Bağlama
function formatAiResponse(aiData, homeTeam, awayTeam) {
  const summary = aiData.matchSummary || {};
  const stats = aiData.stats || {};
  const timeline = aiData.timeline || [];

  // FINAL_WHISTLE / END olaylarını temizleme ve her olaya benzersiz ID verme
  const validTimeline = timeline.filter(
    (evt) =>
      evt.type !== "FINAL_WHISTLE" &&
      evt.type !== "END_MATCH" &&
      evt.type !== "END",
  );

  const events = validTimeline.map((evt, idx) => {
    let steps =
      Array.isArray(evt.steps) && evt.steps.length > 0
        ? evt.steps
        : evt.text
          ? [evt.text]
          : ["Pozisyon gelişiyor..."];

    return {
      id: `evt_${evt.min}_${idx}_${evt.type}`,
      min: evt.min,
      type: evt.type,
      steps: steps,
      text: steps.join(" "),
      teamId: evt.team === "home" ? homeTeam.id : awayTeam.id,
      isHome: evt.team === "home",
      scorer: evt.scorer,
    };
  });

  // 2D Saha Highlight'ları Üretme
  const highlights = events.map((evt) => ({
    min: evt.min,
    type: evt.type,
    attackingTeamId: evt.isHome ? homeTeam.id : awayTeam.id,
    primaryPlayerName: evt.scorer || evt.text.split(" ")[0] || "Oyuncu",
    durationMs: 4000,
  }));

  // Oyuncu İstatistik Nesnesi
  const playerStats = {};
  const ratings = aiData.playerRatings || {};

  (ratings.home || []).forEach((p) => {
    playerStats[`home_${p.name}`] = {
      name: p.name,
      teamId: homeTeam.id,
      rating: p.rating || 7.0,
      goals: p.goals || 0,
      assists: p.assists || 0,
    };
  });

  (ratings.away || []).forEach((p) => {
    playerStats[`away_${p.name}`] = {
      name: p.name,
      teamId: awayTeam.id,
      rating: p.rating || 7.0,
      goals: p.goals || 0,
      assists: p.assists || 0,
    };
  });

  return {
    homeScore: summary.homeScore || 0,
    awayScore: summary.awayScore || 0,
    stats: {
      homePossession: stats.possession?.home || 50,
      awayPossession: stats.possession?.away || 50,
      homeShots: stats.shots?.home || 10,
      awayShots: stats.shots?.away || 8,
      homeShotsOnTarget: stats.shotsOnTarget?.home || 4,
      awayShotsOnTarget: stats.shotsOnTarget?.away || 3,
      homeCorners: stats.corners?.home || 4,
      awayCorners: stats.corners?.away || 3,
      homeFouls: stats.fouls?.home || 10,
      awayFouls: stats.fouls?.away || 12,
      homeYellowCards: stats.yellowCards?.home || 1,
      awayYellowCards: stats.yellowCards?.away || 2,
      homeRedCards: stats.redCards?.home || 0,
      awayRedCards: stats.redCards?.away || 0,
      homeXG: stats.xG?.home || 1.5,
      awayXG: stats.xG?.away || 1.1,
    },
    events,
    highlights,
    playerStats,
    manOfTheMatch: summary.manOfTheMatch,
  };
}
