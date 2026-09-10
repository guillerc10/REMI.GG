import { champeonImgUrl } from "../utils/ddragon";

function CampeonesTop({ maestrias, campeones }) {
  if (!maestrias || maestrias.length === 0) {
    return null;
  }

  // Combinar datos de maestrías con winrate de campeones
  const campeonesConStats = maestrias.map((maestria) => {
    const stats = campeones.find((c) => c.campeon === maestria.campeon) || {};
    return {
      ...maestria,
      winrate: stats.winrate || 0,
      partidas: stats.partidas || 0,
    };
  });

  // Niveles de maestría con emojis
  const nivelEmoji = {
    1: "⭐",
    2: "⭐⭐",
    3: "⭐⭐⭐",
    4: "🌟",
    5: "🌟🌟",
    6: "💎",
    7: "💎💎",
  };

  return (
    <div className="brutal-card-static p-6">
      <h3 className="text-xs font-display uppercase tracking-wide mb-4">Campeones Top</h3>
      <div className="flex flex-col gap-4">
        {campeonesConStats.map((champ, i) => (
          <div key={i} className="flex items-center gap-3 pb-3 border-b-2 border-black last:border-0 last:pb-0">
            {/* Imagen del campeón */}
            <img
              src={champeonImgUrl(champ.campeon)}
              alt={champ.campeon}
              className="w-12 h-12 rounded-full border-2 border-black flex-shrink-0"
            />

            {/* Información del campeón */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-display text-xs truncate">{champ.campeon}</p>
                <span className="text-xs font-stat font-bold flex-shrink-0" style={{ color: champ.winrate >= 50 ? "#0052CC" : "#E63946" }}>
                  {champ.winrate}%
                </span>
              </div>

              {/* Maestría y partidas */}
              <div className="flex items-center justify-between gap-2 mt-1">
                <p className="text-xs text-slate-600 font-stat">
                  {nivelEmoji[champ.nivel] || `Nivel ${champ.nivel}`}
                  <span className="ml-1">{champ.partidas}p</span>
                </p>
                <p className="text-xs text-slate-500 font-stat">
                  {Math.floor(champ.puntos / 1000)}k puntos
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CampeonesTop;
