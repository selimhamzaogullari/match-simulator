import React, { useRef, useEffect, useState } from "react";
import { FORMATION_LAYOUTS } from "../data/teams";

export default function Pitch2D({
  homeTeam,
  awayTeam,
  homeFormationKey = "4-4-2",
  awayFormationKey = "4-4-2",
  isPlaying,
  matchTime,
  currentHighlight,
  matchResult,
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Animasyon Durumu
  const [activeComment, setActiveComment] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let startTime = null;

    const render = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = ((timestamp - startTime) % 4000) / 4000; // 4s döngüsel hareket

      const width = canvas.width;
      const height = canvas.height;

      // 1. Çim Sahayı Çiz (CM 03/04 Grass Bands)
      drawPitchBackground(ctx, width, height);

      // 2. Saha Çizgilerini Çiz
      drawPitchMarkings(ctx, width, height);

      // 3. Oyuncu ve Top Konumlarını Hesapla
      const homeLayout =
        FORMATION_LAYOUTS[homeFormationKey] || FORMATION_LAYOUTS["4-4-2"];
      const awayLayout =
        FORMATION_LAYOUTS[awayFormationKey] || FORMATION_LAYOUTS["4-4-2"];

      // Atak Yönü & Fazı (Hangi takım topla oynuyor?)
      const isHomeAttacking = isPlaying
        ? Math.sin(timestamp / 1000) > 0
        : false;
      const attackShift = isPlaying ? Math.sin(timestamp / 800) * 4 : 0;

      // Top Konumu (X, Y %)
      let ballX = 50 + attackShift * 3;
      let ballY = 50 + Math.cos(timestamp / 600) * 15;
      let activePlayerName = "";

      // Eğer aktif bir Highlight/Gol anı varsa
      if (currentHighlight) {
        activePlayerName = currentHighlight.primaryPlayerName;
        if (currentHighlight.type.includes("GOAL")) {
          ballX = currentHighlight.attackingTeamId === homeTeam.id ? 92 : 8;
          ballY = 50;
        } else if (currentHighlight.type.includes("CORNER")) {
          ballX = currentHighlight.attackingTeamId === homeTeam.id ? 95 : 5;
          ballY = 5;
        }
      }

      // 4. EV SAHİBİ Oyuncuları Çiz (Ev Sahibi Soldan Sağa Hücum Eder)
      homeLayout.positions.forEach((pos, idx) => {
        let px =
          pos.x +
          (isHomeAttacking
            ? Math.max(0, attackShift)
            : -Math.abs(attackShift * 0.5));
        let py = pos.y + Math.sin(timestamp / 500 + idx) * 1.5;

        // Sınır koruması
        px = Math.max(4, Math.min(96, px));
        py = Math.max(4, Math.min(96, py));

        const canvasX = (px / 100) * width;
        const canvasY = (py / 100) * height;

        const isGoalie = pos.role === "GK";
        const isHighlightPlayer = activePlayerName && (idx === 10 || idx === 8);

        drawPlayerDot(
          ctx,
          canvasX,
          canvasY,
          idx + 1,
          homeTeam.primaryColor || "#cc0000",
          homeTeam.secondaryColor || "#ffffff",
          isHighlightPlayer ? homeTeam.squad[idx]?.name : "",
          isGoalie,
        );
      });

      // 5. DEPLASMAN Oyuncuları Çiz (Deplasman Sağdan Sola Hücum Eder)
      awayLayout.positions.forEach((pos, idx) => {
        // Karşı kaleye göre X ve Y simetrisi
        let px =
          100 -
          pos.x -
          (isHomeAttacking
            ? -Math.abs(attackShift * 0.5)
            : Math.max(0, attackShift));
        let py = 100 - pos.y + Math.cos(timestamp / 500 + idx) * 1.5;

        px = Math.max(4, Math.min(96, px));
        py = Math.max(4, Math.min(96, py));

        const canvasX = (px / 100) * width;
        const canvasY = (py / 100) * height;

        const isGoalie = pos.role === "GK";
        const isHighlightPlayer = activePlayerName && (idx === 10 || idx === 8);

        drawPlayerDot(
          ctx,
          canvasX,
          canvasY,
          idx + 1,
          awayTeam.primaryColor || "#0033cc",
          awayTeam.secondaryColor || "#ffffff",
          isHighlightPlayer ? awayTeam.squad[idx]?.name : "",
          isGoalie,
        );
      });

      // 6. Sarı Topu (Ball) Çiz
      const ballCanvasX = (ballX / 100) * width;
      const ballCanvasY = (ballY / 100) * height;
      drawBall(ctx, ballCanvasX, ballCanvasY);

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(render);
      }
    };

    // İlk Çizim
    render(performance.now());

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [
    homeTeam,
    awayTeam,
    homeFormationKey,
    awayFormationKey,
    isPlaying,
    matchTime,
    currentHighlight,
  ]);

  return (
    <div className="pitch-container relative w-full overflow-hidden rounded-xl border border-slate-700/80 shadow-2xl bg-slate-900">
      {/* CM 03/04 Pitch Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-950/90 border-b border-slate-800 text-xs text-slate-300 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-emerald-400">2D MATCH ENGINE</span>
          <span className="text-slate-500">| CM 03/04 Classic View</span>
        </div>
        <div className="flex items-center gap-4">
          <span>
            {homeTeam.shortName} ({homeFormationKey}) vs {awayTeam.shortName} (
            {awayFormationKey})
          </span>
        </div>
      </div>

      {/* HTML5 Canvas Pitch */}
      <div className="relative aspect-[16/10] w-full bg-emerald-900 flex items-center justify-center p-2">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="w-full h-full rounded shadow-inner object-contain"
        />

        {/* Canlı Gol / Pozisyon Bildirim Popup (CM Style Overlay) */}
        {currentHighlight && currentHighlight.type.includes("GOAL") && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-black px-6 py-2 rounded-full shadow-2xl border-2 border-yellow-300 text-sm md:text-lg uppercase tracking-wider flex items-center gap-2">
            <span>⚽ G O L !</span>
            <span className="text-xs bg-black/20 px-2 py-0.5 rounded text-slate-900">
              {currentHighlight.primaryPlayerName}
            </span>
          </div>
        )}
      </div>

      {/* Alt Saha Bilgisi */}
      <div className="px-4 py-1.5 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between items-center font-mono">
        <span className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: homeTeam.primaryColor }}
          ></span>
          {homeTeam.name}
        </span>
        <span className="text-slate-500">🟡 Top Takibi / Canlı Pozisyon</span>
        <span className="flex items-center gap-1.5">
          {awayTeam.name}
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: awayTeam.primaryColor }}
          ></span>
        </span>
      </div>
    </div>
  );
}

// === SAHA ÇİZİM YARDIMCILARI ===

function drawPitchBackground(ctx, w, h) {
  // Çim Deseni (Vertical Dark & Light Stripes)
  const stripeWidth = w / 12;
  for (let i = 0; i < 12; i++) {
    ctx.fillStyle = i % 2 === 0 ? "#1b6e36" : "#1e7a3c";
    ctx.fillRect(i * stripeWidth, 0, stripeWidth, h);
  }
}

function drawPitchMarkings(ctx, w, h) {
  ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
  ctx.lineWidth = 2.5;

  const pad = 12;
  const pw = w - pad * 2;
  const ph = h - pad * 2;

  // Dış Çizgiler
  ctx.strokeRect(pad, pad, pw, ph);

  // Orta Çizgi
  ctx.beginPath();
  ctx.moveTo(w / 2, pad);
  ctx.lineTo(w / 2, h - pad);
  ctx.stroke();

  // Orta Yuvarlak
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, ph * 0.16, 0, Math.PI * 2);
  ctx.stroke();

  // Santra Noktası
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, 3, 0, Math.PI * 2);
  ctx.fill();

  // Sol Ceza Sahası
  const boxW = pw * 0.16;
  const boxH = ph * 0.44;
  const boxY = (h - boxH) / 2;
  ctx.strokeRect(pad, boxY, boxW, boxH);

  // Sol Altıpas
  const sixW = pw * 0.06;
  const sixH = ph * 0.22;
  const sixY = (h - sixH) / 2;
  ctx.strokeRect(pad, sixY, sixW, sixH);

  // Sağ Ceza Sahası
  ctx.strokeRect(w - pad - boxW, boxY, boxW, boxH);

  // Sağ Altıpas
  ctx.strokeRect(w - pad - sixW, sixY, sixW, sixH);

  // Kale Çizgileri (Kaleler)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(pad - 4, (h - ph * 0.16) / 2, 4, ph * 0.16);
  ctx.fillRect(w - pad, (h - ph * 0.16) / 2, 4, ph * 0.16);

  // Korner Bayrakları (Yellow flags at 4 corners)
  ctx.fillStyle = "#ffd700";
  ctx.fillRect(pad - 2, pad - 2, 4, 4);
  ctx.fillRect(w - pad - 2, pad - 2, 4, 4);
  ctx.fillRect(pad - 2, h - pad - 2, 4, 4);
  ctx.fillRect(w - pad - 2, h - pad - 2, 4, 4);
}

function drawPlayerDot(
  ctx,
  x,
  y,
  num,
  primaryColor,
  secondaryColor,
  labelName = "",
  isGoalie = false,
) {
  const radius = isGoalie ? 11 : 9.5;

  // Gölge
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.arc(x + 1.5, y + 2, radius, 0, Math.PI * 2);
  ctx.fill();

  // Oyuncu Noktası (Dot Circle)
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  // Beyaz Çerçeve
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Oyuncu Numarası
  ctx.fillStyle = secondaryColor || "#ffffff";
  ctx.font = 'bold 9px "JetBrains Mono", sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(num, x, y + 0.5);

  // CM 03/04 Aktif Oyuncu İsim Etiketi (Floating Yellow Label)
  if (labelName) {
    ctx.font = 'bold 10px "Outfit", sans-serif';
    const textWidth = ctx.measureText(labelName).width;
    const px = x - textWidth / 2 - 4;
    const py = y - radius - 18;

    // Etiket Arka Planı (Sarı CM 03/04 stili)
    ctx.fillStyle = "#ffd700";
    ctx.fillRect(px, py, textWidth + 8, 14);

    // Etiket Çerçevesi
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.strokeRect(px, py, textWidth + 8, 14);

    // İsim Yazısı
    ctx.fillStyle = "#000000";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(labelName, px + 4, py + 2);
  }
}

function drawBall(ctx, x, y) {
  // Top Gölgesi
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath();
  ctx.arc(x + 1, y + 2, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Parlak Sarı Top (CM 03/04 Yellow Ball)
  ctx.fillStyle = "#ffea00";
  ctx.beginPath();
  ctx.arc(x, y, 4.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;
  ctx.stroke();
}
