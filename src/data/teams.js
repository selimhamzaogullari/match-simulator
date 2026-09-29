// Futbol Veritabanı - EA FC / Football Manager Reytingleri Esas Alınmıştır

export const TEAMS_DATA = [
  // --- GÜNCEL TAKIMLAR ---
  {
    id: "galatasaray",
    name: "Galatasaray",
    shortName: "GS",
    category: "current",
    logoText: "🦁",
    primaryColor: "#a90429",
    secondaryColor: "#fdb913",
    formation: "4-2-3-1",
    mentality: "Attacking",
    squad: [
      { id: "gs1", name: "Fernando Muslera", pos: "GK", ovr: 83, pac: 40, sho: 20, pas: 65, dri: 50, def: 84, phy: 78, heading: 40, height: 190 },
      { id: "gs2", name: "Kaan Ayhan", pos: "RB", ovr: 76, pac: 72, sho: 60, pas: 74, dri: 71, def: 76, phy: 75, heading: 75, height: 185 },
      { id: "gs3", name: "Davinson Sánchez", pos: "CB", ovr: 82, pac: 80, sho: 45, pas: 68, dri: 66, def: 83, phy: 85, heading: 86, height: 187 },
      { id: "gs4", name: "Victor Nelsson", pos: "CB", ovr: 79, pac: 68, sho: 40, pas: 64, dri: 62, def: 81, phy: 80, heading: 84, height: 185 },
      { id: "gs5", name: "Ismail Jakobs", pos: "LB", ovr: 76, pac: 86, sho: 58, pas: 70, dri: 74, def: 73, phy: 77, heading: 70, height: 183 },
      { id: "gs6", name: "Lucas Torreira", pos: "CDM", ovr: 82, pac: 74, sho: 64, pas: 78, dri: 79, def: 83, phy: 81, heading: 60, height: 166 },
      { id: "gs7", name: "Gabriel Sara", pos: "CM", ovr: 80, pac: 77, sho: 78, pas: 83, dri: 81, def: 72, phy: 78, heading: 70, height: 177 },
      { id: "gs8", name: "Barış Alper Yılmaz", pos: "RW", ovr: 80, pac: 91, sho: 76, pas: 72, dri: 80, def: 65, phy: 86, heading: 76, height: 186 },
      { id: "gs9", name: "Dries Mertens", pos: "CAM", ovr: 81, pac: 73, sho: 82, pas: 83, dri: 84, def: 42, phy: 58, heading: 55, height: 169 },
      { id: "gs10", name: "Yunus Akgün", pos: "LW", ovr: 77, pac: 83, sho: 73, pas: 76, dri: 81, def: 45, phy: 62, heading: 50, height: 173 },
      { id: "gs11", name: "Victor Osimhen", pos: "ST", ovr: 87, pac: 90, sho: 86, pas: 67, dri: 81, def: 42, phy: 88, heading: 91, height: 186 }
    ]
  },
  {
    id: "fenerbahce",
    name: "Fenerbahçe",
    shortName: "FB",
    category: "current",
    logoText: "⚽",
    primaryColor: "#002d62",
    secondaryColor: "#fff200",
    formation: "4-2-3-1",
    mentality: "Attacking",
    squad: [
      { id: "fb1", name: "Dominik Livaković", pos: "GK", ovr: 81, pac: 45, sho: 20, pas: 68, dri: 52, def: 82, phy: 76, heading: 40, height: 188 },
      { id: "fb2", name: "Bright Osayi-Samuel", pos: "RB", ovr: 77, pac: 92, sho: 58, pas: 66, dri: 76, def: 72, phy: 78, heading: 65, height: 178 },
      { id: "fb3", name: "Alexander Djiku", pos: "CB", ovr: 80, pac: 76, sho: 50, pas: 73, dri: 70, def: 81, phy: 80, heading: 82, height: 182 },
      { id: "fb4", name: "Rodrigo Becão", pos: "CB", ovr: 79, pac: 70, sho: 42, pas: 62, dri: 60, def: 81, phy: 84, heading: 85, height: 191 },
      { id: "fb5", name: "Jayden Oosterwolde", pos: "LB", ovr: 77, pac: 89, sho: 55, pas: 68, dri: 74, def: 75, phy: 82, heading: 78, height: 189 },
      { id: "fb6", name: "Sofyan Amrabat", pos: "CDM", ovr: 80, pac: 68, sho: 64, pas: 76, dri: 75, def: 80, phy: 85, heading: 72, height: 185 },
      { id: "fb7", name: "Fred", pos: "CM", ovr: 81, pac: 78, sho: 73, pas: 80, dri: 82, def: 77, phy: 76, heading: 60, height: 169 },
      { id: "fb8", name: "Dušan Tadić", pos: "RW", ovr: 82, pac: 66, sho: 80, pas: 86, dri: 83, def: 44, phy: 73, heading: 68, height: 181 },
      { id: "fb9", name: "Sebastian Szymański", pos: "CAM", ovr: 80, pac: 82, sho: 78, pas: 80, dri: 80, def: 64, phy: 72, heading: 65, height: 174 },
      { id: "fb10", name: "Allan Saint-Maximin", pos: "LW", ovr: 81, pac: 91, sho: 72, pas: 74, dri: 88, def: 35, phy: 70, heading: 55, height: 173 },
      { id: "fb11", name: "Youssef En-Nesyri", pos: "ST", ovr: 82, pac: 83, sho: 81, pas: 62, dri: 72, def: 40, phy: 83, heading: 92, height: 192 }
    ]
  },
  {
    id: "besiktas",
    name: "Beşiktaş",
    shortName: "BJK",
    category: "current",
    logoText: "🦅",
    primaryColor: "#111111",
    secondaryColor: "#ffffff",
    formation: "4-2-3-1",
    mentality: "Balanced",
    squad: [
      { id: "bjk1", name: "Mert Günok", pos: "GK", ovr: 79, pac: 40, sho: 20, pas: 72, dri: 50, def: 80, phy: 77, heading: 40, height: 196 },
      { id: "bjk2", name: "Jonas Svensson", pos: "RB", ovr: 75, pac: 78, sho: 55, pas: 69, dri: 72, def: 73, phy: 74, heading: 65, height: 170 },
      { id: "bjk3", name: "Gabriel Paulista", pos: "CB", ovr: 80, pac: 72, sho: 45, pas: 65, dri: 62, def: 82, phy: 82, heading: 84, height: 187 },
      { id: "bjk4", name: "Felix Uduokhai", pos: "CB", ovr: 77, pac: 73, sho: 38, pas: 64, dri: 60, def: 78, phy: 80, heading: 83, height: 193 },
      { id: "bjk5", name: "Arthur Masuaku", pos: "LB", ovr: 76, pac: 80, sho: 62, pas: 75, dri: 80, def: 70, phy: 74, heading: 65, height: 179 },
      { id: "bjk6", name: "Al-Musrati", pos: "CDM", ovr: 79, pac: 60, sho: 66, pas: 79, dri: 73, def: 79, phy: 83, heading: 78, height: 189 },
      { id: "bjk7", name: "Gedson Fernandes", pos: "CM", ovr: 81, pac: 87, sho: 72, pas: 77, dri: 83, def: 78, phy: 82, heading: 68, height: 183 },
      { id: "bjk8", name: "Milot Rashica", pos: "RW", ovr: 77, pac: 85, sho: 74, pas: 74, dri: 78, def: 52, phy: 72, heading: 60, height: 177 },
      { id: "bjk9", name: "Rafa Silva", pos: "CAM", ovr: 84, pac: 92, sho: 80, pas: 82, dri: 87, def: 48, phy: 66, heading: 58, height: 172 },
      { id: "bjk10", name: "Semih Kılıçsoy", pos: "LW", ovr: 76, pac: 82, sho: 77, pas: 68, dri: 80, def: 38, phy: 78, heading: 70, height: 178 },
      { id: "bjk11", name: "Ciro Immobile", pos: "ST", ovr: 83, pac: 79, sho: 86, pas: 68, dri: 77, def: 38, phy: 75, heading: 80, height: 185 }
    ]
  },
  {
    id: "realmadrid",
    name: "Real Madrid",
    shortName: "RMA",
    category: "current",
    logoText: "👑",
    primaryColor: "#00142e",
    secondaryColor: "#e5b546",
    formation: "4-3-3",
    mentality: "Attacking",
    squad: [
      { id: "rma1", name: "Thibaut Courtois", pos: "GK", ovr: 90, pac: 45, sho: 20, pas: 74, dri: 55, def: 90, phy: 82, heading: 45, height: 200 },
      { id: "rma2", name: "Dani Carvajal", pos: "RB", ovr: 86, pac: 81, sho: 62, pas: 79, dri: 80, def: 84, phy: 84, heading: 78, height: 173 },
      { id: "rma3", name: "Éder Militão", pos: "CB", ovr: 85, pac: 84, sho: 50, pas: 70, dri: 72, def: 85, phy: 83, heading: 86, height: 186 },
      { id: "rma4", name: "Antonio Rüdiger", pos: "CB", ovr: 88, pac: 82, sho: 55, pas: 71, dri: 70, def: 87, phy: 89, heading: 88, height: 190 },
      { id: "rma5", name: "Ferland Mendy", pos: "LB", ovr: 82, pac: 89, sho: 64, pas: 74, dri: 78, def: 82, phy: 84, heading: 72, height: 180 },
      { id: "rma6", name: "Aurelien Tchouaméni", pos: "CDM", ovr: 85, pac: 76, sho: 70, pas: 81, dri: 79, def: 84, phy: 86, heading: 82, height: 187 },
      { id: "rma7", name: "Federico Valverde", pos: "CM", ovr: 88, pac: 88, sho: 83, pas: 85, dri: 84, def: 81, phy: 85, heading: 74, height: 182 },
      { id: "rma8", name: "Jude Bellingham", pos: "CAM", ovr: 90, pac: 80, sho: 86, pas: 84, dri: 88, def: 78, phy: 86, heading: 84, height: 186 },
      { id: "rma9", name: "Rodrygo", pos: "RW", ovr: 86, pac: 89, sho: 83, pas: 81, dri: 87, def: 45, phy: 68, heading: 68, height: 174 },
      { id: "rma10", name: "Vinícius Júnior", pos: "LW", ovr: 91, pac: 95, sho: 85, pas: 81, dri: 92, def: 37, phy: 71, heading: 68, height: 176 },
      { id: "rma11", name: "Kylian Mbappé", pos: "ST", ovr: 91, pac: 97, sho: 90, pas: 80, dri: 92, def: 36, phy: 78, heading: 74, height: 178 }
    ]
  },
  {
    id: "mancity",
    name: "Manchester City",
    shortName: "MCI",
    category: "current",
    logoText: "🔷",
    primaryColor: "#6cabdd",
    secondaryColor: "#1c2c5b",
    formation: "4-3-3",
    mentality: "Attacking",
    squad: [
      { id: "mci1", name: "Ederson", pos: "GK", ovr: 88, pac: 60, sho: 30, pas: 91, dri: 68, def: 87, phy: 80, heading: 40, height: 188 },
      { id: "mci2", name: "Kyle Walker", pos: "RB", ovr: 84, pac: 90, sho: 63, pas: 76, dri: 77, def: 82, phy: 83, heading: 74, height: 183 },
      { id: "mci3", name: "Rúben Dias", pos: "CB", ovr: 88, pac: 63, sho: 39, pas: 71, dri: 68, def: 89, phy: 87, heading: 87, height: 187 },
      { id: "mci4", name: "Manuel Akanji", pos: "CB", ovr: 84, pac: 79, sho: 48, pas: 74, dri: 74, def: 84, phy: 82, heading: 80, height: 187 },
      { id: "mci5", name: "Josko Gvardiol", pos: "LB", ovr: 84, pac: 80, sho: 65, pas: 76, dri: 78, def: 84, phy: 84, heading: 83, height: 185 },
      { id: "mci6", name: "Rodri", pos: "CDM", ovr: 91, pac: 66, sho: 76, pas: 87, dri: 82, def: 87, phy: 86, heading: 84, height: 191 },
      { id: "mci7", name: "Kevin De Bruyne", pos: "CM", ovr: 90, pac: 72, sho: 87, pas: 94, dri: 87, def: 65, phy: 75, heading: 64, height: 181 },
      { id: "mci8", name: "Bernardo Silva", pos: "CM", ovr: 88, pac: 76, sho: 78, pas: 86, dri: 92, def: 68, phy: 69, heading: 55, height: 173 },
      { id: "mci9", name: "Phil Foden", pos: "RW", ovr: 88, pac: 85, sho: 85, pas: 87, dri: 89, def: 56, phy: 62, heading: 58, height: 171 },
      { id: "mci10", name: "Jack Grealish", pos: "LW", ovr: 84, pac: 76, sho: 76, pas: 83, dri: 87, def: 52, phy: 74, heading: 58, height: 175 },
      { id: "mci11", name: "Erling Haaland", pos: "ST", ovr: 91, pac: 89, sho: 93, pas: 70, dri: 80, def: 45, phy: 88, heading: 88, height: 194 }
    ]
  },

  // --- EFSANELER & TARİHİ 11'LER ---
  {
    id: "fenerbahce_legends",
    name: "Fenerbahçe (Prime Efsaneler)",
    shortName: "FB-LEG",
    category: "legends",
    logoText: "⭐",
    primaryColor: "#002d62",
    secondaryColor: "#fff200",
    formation: "4-3-1-2",
    mentality: "Attacking",
    squad: [
      { id: "fbl1", name: "Volkan Demirel (Prime 07/08)", pos: "GK", ovr: 86, pac: 50, sho: 20, pas: 70, dri: 55, def: 87, phy: 88, heading: 45, height: 191 },
      { id: "fbl2", name: "Gökhan Gönül (Prime 10/11)", pos: "RB", ovr: 84, pac: 87, sho: 68, pas: 81, dri: 83, def: 82, phy: 80, heading: 74, height: 175 },
      { id: "fbl3", name: "Diego Lugano (Prime 07/08)", pos: "CB", ovr: 86, pac: 72, sho: 60, pas: 65, dri: 62, def: 88, phy: 92, heading: 92, height: 184 },
      { id: "fbl4", name: "Edu Dracena (Prime 07/08)", pos: "CB", ovr: 82, pac: 70, sho: 48, pas: 68, dri: 64, def: 83, phy: 82, heading: 85, height: 187 },
      { id: "fbl5", name: "Roberto Carlos (Prime)", pos: "LB", ovr: 88, pac: 92, sho: 87, pas: 82, dri: 84, def: 81, phy: 86, heading: 70, height: 168 },
      { id: "fbl6", name: "Stephen Appiah (Prime 05/06)", pos: "CDM", ovr: 85, pac: 83, sho: 79, pas: 82, dri: 82, def: 84, phy: 89, heading: 78, height: 178 },
      { id: "fbl7", name: "Mehmet Aurélio (Prime 07/08)", pos: "CM", ovr: 84, pac: 78, sho: 72, pas: 82, dri: 80, def: 84, phy: 83, heading: 76, height: 178 },
      { id: "fbl8", name: "Tuncay Şanlı (Prime 04/05)", pos: "LW", ovr: 86, pac: 89, sho: 84, pas: 79, dri: 86, def: 65, phy: 87, heading: 80, height: 182 },
      { id: "fbl9", name: "Alex de Souza (Prime 05/06)", pos: "CAM", ovr: 90, pac: 74, sho: 90, pas: 94, dri: 91, def: 45, phy: 72, heading: 80, height: 177 },
      { id: "fbl10", name: "Deivid de Souza (Prime 07/08)", pos: "RW", ovr: 83, pac: 80, sho: 85, pas: 78, dri: 82, def: 48, phy: 78, heading: 78, height: 180 },
      { id: "fbl11", name: "Nicolas Anelka (Prime 05)", pos: "ST", ovr: 87, pac: 91, sho: 86, pas: 78, dri: 89, def: 38, phy: 80, heading: 76, height: 185 }
    ]
  },
  {
    id: "galatasaray_legends",
    name: "Galatasaray (UEFA 2000 Prime)",
    shortName: "GS-LEG",
    category: "legends",
    logoText: "🏆",
    primaryColor: "#a90429",
    secondaryColor: "#fdb913",
    formation: "4-3-1-2",
    mentality: "Attacking",
    squad: [
      { id: "gsl1", name: "Cláudio Taffarel (Prime 2000)", pos: "GK", ovr: 87, pac: 50, sho: 20, pas: 75, dri: 60, def: 88, phy: 80, heading: 45, height: 183 },
      { id: "gsl2", name: "Capone (Prime 2000)", pos: "RB", ovr: 80, pac: 80, sho: 62, pas: 74, dri: 75, def: 80, phy: 80, heading: 76, height: 180 },
      { id: "gsl3", name: "Gheorghe Popescu (Prime 2000)", pos: "CB", ovr: 86, pac: 73, sho: 68, pas: 82, dri: 76, def: 87, phy: 84, heading: 85, height: 188 },
      { id: "gsl4", name: "Bülent Korkmaz (Prime 2000)", pos: "CB", ovr: 86, pac: 72, sho: 40, pas: 65, dri: 60, def: 89, phy: 90, heading: 88, height: 181 },
      { id: "gsl5", name: "Ergün Penbe (Prime 2000)", pos: "LB", ovr: 82, pac: 80, sho: 68, pas: 84, dri: 82, def: 78, phy: 74, heading: 68, height: 178 },
      { id: "gsl6", name: "Suat Kaya (Prime 2000)", pos: "CDM", ovr: 83, pac: 74, sho: 65, pas: 78, dri: 75, def: 84, phy: 85, heading: 70, height: 172 },
      { id: "gsl7", name: "Okan Buruk (Prime 2000)", pos: "CM", ovr: 83, pac: 86, sho: 72, pas: 78, dri: 81, def: 74, phy: 82, heading: 65, height: 169 },
      { id: "gsl8", name: "Ümit Davala (Prime 2000)", pos: "RM", ovr: 82, pac: 83, sho: 76, pas: 78, dri: 80, def: 76, phy: 80, heading: 82, height: 184 },
      { id: "gsl9", name: "Gheorghe Hagi (Prime 2000)", pos: "CAM", ovr: 91, pac: 78, sho: 92, pas: 95, dri: 92, def: 42, phy: 76, heading: 68, height: 174 },
      { id: "gsl10", name: "Arif Erdem (Prime 2000)", pos: "ST", ovr: 83, pac: 85, sho: 83, pas: 75, dri: 82, def: 40, phy: 73, heading: 74, height: 176 },
      { id: "gsl11", name: "Hakan Şükür (Prime 2000)", pos: "ST", ovr: 87, pac: 83, sho: 86, pas: 72, dri: 76, def: 45, phy: 86, heading: 95, height: 191 }
    ]
  },
  {
    id: "world_legends",
    name: "World All-Star Legends",
    shortName: "WORLD-LEG",
    category: "legends",
    logoText: "🌍",
    primaryColor: "#d4af37",
    secondaryColor: "#111111",
    formation: "4-3-3",
    mentality: "Attacking",
    squad: [
      { id: "wl1", name: "Gianluigi Buffon (Prime)", pos: "GK", ovr: 92, pac: 50, sho: 20, pas: 75, dri: 60, def: 93, phy: 85, heading: 40, height: 192 },
      { id: "wl2", name: "Cafu (Prime)", pos: "RB", ovr: 90, pac: 91, sho: 72, pas: 84, dri: 87, def: 87, phy: 86, heading: 76, height: 176 },
      { id: "wl3", name: "Sergio Ramos (Prime)", pos: "CB", ovr: 91, pac: 80, sho: 70, pas: 76, dri: 74, def: 92, phy: 89, heading: 94, height: 184 },
      { id: "wl4", name: "Paolo Maldini (Prime)", pos: "CB", ovr: 94, pac: 86, sho: 55, pas: 76, dri: 78, def: 96, phy: 85, heading: 88, height: 186 },
      { id: "wl5", name: "Roberto Carlos (Prime)", pos: "LB", ovr: 89, pac: 94, sho: 88, pas: 81, dri: 85, def: 82, phy: 87, heading: 70, height: 168 },
      { id: "wl6", name: "N'Golo Kanté (Prime)", pos: "CDM", ovr: 90, pac: 83, sho: 66, pas: 78, dri: 82, def: 91, phy: 88, heading: 60, height: 168 },
      { id: "wl7", name: "Zinedine Zidane (Prime)", pos: "CM", ovr: 94, pac: 78, sho: 86, pas: 94, dri: 95, def: 65, phy: 84, heading: 82, height: 185 },
      { id: "wl8", name: "Ronaldinho (Prime)", pos: "CAM", ovr: 94, pac: 91, sho: 88, pas: 91, dri: 97, def: 38, phy: 78, heading: 72, height: 180 },
      { id: "wl9", name: "Lionel Messi (Prime)", pos: "RW", ovr: 95, pac: 93, sho: 94, pas: 92, dri: 97, def: 38, phy: 68, heading: 70, height: 170 },
      { id: "wl10", name: "Cristiano Ronaldo (Prime)", pos: "LW", ovr: 95, pac: 93, sho: 95, pas: 82, dri: 90, def: 35, phy: 88, heading: 94, height: 187 },
      { id: "wl11", name: "Ronaldo Nazário (Prime R9)", pos: "ST", ovr: 95, pac: 95, sho: 94, pas: 79, dri: 95, def: 38, phy: 85, heading: 82, height: 183 }
    ]
  }
];

// Diziliş Pozisyon Şablonları (Saha Üzerindeki Göreceli X, Y % Koordinatları)
export const FORMATION_LAYOUTS = {
  "4-4-2": {
    name: "4-4-2 Standart",
    positions: [
      { role: "GK", x: 8, y: 50 },
      { role: "LB", x: 26, y: 15 },
      { role: "CB", x: 22, y: 38 },
      { role: "CB", x: 22, y: 62 },
      { role: "RB", x: 26, y: 85 },
      { role: "LM", x: 50, y: 18 },
      { role: "CM", x: 48, y: 40 },
      { role: "CM", x: 48, y: 60 },
      { role: "RM", x: 50, y: 82 },
      { role: "ST", x: 78, y: 38 },
      { role: "ST", x: 78, y: 62 }
    ]
  },
  "4-3-3": {
    name: "4-3-3 Hücum",
    positions: [
      { role: "GK", x: 8, y: 50 },
      { role: "LB", x: 26, y: 15 },
      { role: "CB", x: 22, y: 38 },
      { role: "CB", x: 22, y: 62 },
      { role: "RB", x: 26, y: 85 },
      { role: "CDM", x: 42, y: 50 },
      { role: "CM", x: 55, y: 32 },
      { role: "CM", x: 55, y: 68 },
      { role: "LW", x: 78, y: 18 },
      { role: "ST", x: 82, y: 50 },
      { role: "RW", x: 78, y: 82 }
    ]
  },
  "3-4-3": {
    name: "3-4-3 Kanatlı",
    positions: [
      { role: "GK", x: 8, y: 50 },
      { role: "CB", x: 22, y: 25 },
      { role: "CB", x: 20, y: 50 },
      { role: "CB", x: 22, y: 75 },
      { role: "LM", x: 48, y: 12 },
      { role: "CM", x: 48, y: 38 },
      { role: "CM", x: 48, y: 62 },
      { role: "RM", x: 48, y: 88 },
      { role: "LW", x: 78, y: 20 },
      { role: "ST", x: 83, y: 50 },
      { role: "RW", x: 78, y: 80 }
    ]
  },
  "4-2-3-1": {
    name: "4-2-3-1 Modern",
    positions: [
      { role: "GK", x: 8, y: 50 },
      { role: "LB", x: 26, y: 15 },
      { role: "CB", x: 22, y: 38 },
      { role: "CB", x: 22, y: 62 },
      { role: "RB", x: 26, y: 85 },
      { role: "CDM", x: 43, y: 38 },
      { role: "CDM", x: 43, y: 62 },
      { role: "CAM", x: 62, y: 50 },
      { role: "LM", x: 64, y: 18 },
      { role: "RM", x: 64, y: 82 },
      { role: "ST", x: 83, y: 50 }
    ]
  },
  "3-5-2": {
    name: "3-5-2 Orta Saha",
    positions: [
      { role: "GK", x: 8, y: 50 },
      { role: "CB", x: 22, y: 25 },
      { role: "CB", x: 20, y: 50 },
      { role: "CB", x: 22, y: 75 },
      { role: "LWB", x: 45, y: 12 },
      { role: "CDM", x: 42, y: 50 },
      { role: "RWB", x: 45, y: 88 },
      { role: "CM", x: 56, y: 34 },
      { role: "CM", x: 56, y: 66 },
      { role: "ST", x: 80, y: 38 },
      { role: "ST", x: 80, y: 62 }
    ]
  }
};
