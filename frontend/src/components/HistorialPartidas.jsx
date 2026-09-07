import { champeonImgUrl, itemImgUrl, summonerSpellImgUrl } from "../utils/ddragon";

function formatearDuracion(segundos) {
  const min = Math.floor(segundos / 60);
  const seg = segundos % 60;
  return `${min}m ${seg}s`;
}

function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function PartidaCard({ partida }) {
  const bgColor = partida.win ? "bg-blue-950 border-blue-600" : "bg-red-950 border-red-600";

  return (
    <div className={`flex items-center gap-4 rounded-lg border-l-4 p-4 ${bgColor}`}>
      {/* Resultado + modo + duración */}
      <div className="w-24 flex-shrink-0 text-center">
        <p className={`font-bold text-sm ${partida.win ? "text-blue-400" : "text-red-400"}`}>
          {partida.win ? "Victoria" : "Derrota"}
        </p>
        <p className="text-xs text-slate-400">{partida.modo_juego}</p>
        <p className="text-xs text-slate-500">{formatearDuracion(partida.duracion_segundos)}</p>
        <p className="text-xs text-slate-500">{formatearFecha(partida.fecha)}</p>
      </div>

      {/* Campeón + hechizos */}
      <div className="flex items-center gap-1">
        <img
          src={champeonImgUrl(partida.campeon)}
          alt={partida.campeon}
          className="w-12 h-12 rounded-full border-2 border-slate-600"
        />
        <div className="flex flex-col gap-1">
          {[partida.summoner1_id, partida.summoner2_id].map((s, i) => {
            const url = summonerSpellImgUrl(s);
            return url ? (
              <img key={i} src={url} alt="hechizo" className="w-5 h-5 rounded" />
            ) : (
              <div key={i} className="w-5 h-5 rounded bg-slate-700" />
            );
          })}
        </div>
      </div>

      {/* KDA */}
      <div className="w-28 flex-shrink-0 text-center">
        <p className="text-white font-semibold">
          {partida.kills} / <span className="text-red-400">{partida.deaths}</span> / {partida.assists}
        </p>
        <p className="text-xs text-slate-400">CS {partida.cs_total}</p>
      </div>

      {/* Items */}
      <div className="grid grid-cols-4 gap-1 flex-1">
        {partida.items.map((itemId, i) => {
          const url = itemImgUrl(itemId);
          return url ? (
            <img key={i} src={url} alt="item" className="w-8 h-8 rounded border border-slate-700" />
          ) : (
            <div key={i} className="w-8 h-8 rounded bg-slate-800 border border-slate-700" />
          );
        })}
      </div>

      {/* Badges */}
      <div className="flex flex-col gap-1 flex-shrink-0">
        {partida.badges.map((badge, i) => (
          <span
            key={i}
            className="text-xs font-bold px-2 py-0.5 rounded bg-purple-700 text-white text-center"
          >
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
}

function HistorialPartidas({ partidas }) {
  if (!partidas || partidas.length === 0) return null;

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-3 text-white">Historial de partidas</h3>
      <div className="flex flex-col gap-2">
        {partidas.map((partida) => (
          <PartidaCard key={partida.match_id} partida={partida} />
        ))}
      </div>
    </div>
  );
}

export default HistorialPartidas;