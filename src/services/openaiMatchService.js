// OpenAI ChatGPT Maç Simülasyonu Servisi (GPT-4o / GPT-4o-Mini Powered Match Engine)

import { FORMATION_LAYOUTS } from "../data/teams";
import { simulateFullMatch as fallbackSimulateMatch } from "../engine/matchEngine";

const SYSTEM_PROMPT = `You are a World-Class Turkish Football Match Engine & Commentary Simulator (legendary spiker persona like Yalçın Çetin & Ercan Taner).
Your task is to simulate a realistic, thrilling, and tactical 90-minute football match between two teams based on their lineups, player real-world skill levels, and tactics.

STRICT INSTRUCTIONS:
1. Output MUST be a valid JSON object matching the exact schema provided.
2. Evaluate real-world abilities of all players in both 11-player lineups based on your knowledge of football history and current form.
3. MANDATORY EVENT QUANTITY CONSTRAINT: You MUST generate BETWEEN 18 AND 25 timeline items across the 90 minutes of the match. NEVER return fewer than 18 events!
4. MANDATORY EVENT TYPE DIVERSITY: Distribute the 18-25 events dynamically using a realistic mix:
   - 6 to 10 Shots / Saves / Misses / Post hits ("SAVE", "MISS", "POST")
   - 4 to 8 Corner Kicks ("CORNER")
   - 3 to 6 Fouls and Offside decisions ("FOUL", "OFFSIDE")
   - 1 to 4 Yellow/Red cards ("YELLOW", "RED")
   - Realistic Goals matching the final score ("GOAL", "CORNER_GOAL", "FREEKICK_GOAL", "PENALTY_GOAL")

5. Allowed Event Types (Use ONLY these exact uppercase strings for 'type'):
   - "GOAL" (Open play goal)
   - "CORNER_GOAL" (Goal from corner header)
   - "FREEKICK_GOAL" (Direct free kick goal)
   - "PENALTY_GOAL" (Penalty kick goal)
   - "SAVE" (Goalkeeper reflex save / 90 save)
   - "POST" (Shot hit the post or crossbar)
   - "MISS" (Shot wide or over the bar)
   - "CORNER" (Corner kick taken)
   - "YELLOW" (Yellow card)
   - "RED" (Red card)
   - "FOUL" (Foul committed)
   - "OFFSIDE" (Offside decision)

6. VERY IMPORTANT - MANDATORY COMPLETE EVENT OUTCOME SCHEMA:
   For EVERY item in 'timeline', you MUST provide a 'steps' array containing 4 to 8 detailed, sequential Turkish commentary sentences.
   STRICT OUTCOME RULE:
   - The VERY LAST sentence in the 'steps' array MUST state the EXPLICIT PHYSICAL OUTCOME of the action (e.g. for corners: "Mertens ortayı kesti, Nelsson yükselip kafayı vurdu ama top az farkla üstten dışarı gitti!", "Orta geldi, Muslera çıkarak çift yumrukla uzaklaştırdı", or defender clearance).
   - NEVER EVER end a 'steps' array on a setup sentence like "korner kazanıyor", "işte önemli bir fırsat", or "köşe vuruşunu kullanacak". You MUST include the corner cross and final outcome in the remaining steps!
   - For fouls/cards: State the referee whistle, free kick decision, or card shown.
   - For shots/saves: State the exact reflex save, deflection, or ball going over/wide.

7. NO FINAL WHISTLE ITEMS: Do NOT include 'FINAL_WHISTLE', 'END_MATCH', or match end commentary in the 'timeline' array. Timeline items must ONLY be active gameplay events. Stoppage time and the final whistle are handled automatically by the match engine.

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
        "Sentence 1 (Build-up pass with player names in Turkish)",
        "Sentence 2 (Midfield transition or wing play in Turkish)",
        "Sentence 3 (Cross, pass, or duel in Turkish)",
        "Sentence 4 (Shot, save, corner, card, or Goal celebration in Turkish)"
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

CRITICAL: Generate BETWEEN 18 AND 25 dynamic timeline events spanning minute 1 to 90 with diverse event types (corners, fouls, yellow cards, offsides, saves, misses, posts, goals). Do NOT generate FINAL_WHISTLE items. Write dramatic multi-step Turkish spiker commentary steps array for EVERY single item using player names from the lineups above. Return ONLY the JSON object.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
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
