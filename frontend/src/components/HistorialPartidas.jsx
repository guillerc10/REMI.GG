import { useState } from "react";
import { champeonImgUrl, itemImgUrl, summonerSpellImgUrl } from "../utils/ddragon";
import { getPartidaDetalle } from "../services/api";

function formatearDuracion(segundos) {
  const min = Math.floor(segundos / 60);
  const seg = segundos % 60;
  return `${min}m ${seg}s`;
}

function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function formatearModoJuego(modoJuego) {
  // Traduce los modos de juego de Riot API a nombres más legibles
  const mapeo = {
    "CLASSIC": "Normal",
    "RANKED_SOLO_5x5": "Ranked Solo/Dúo",
    "RANKED_FLEX_SR": "Ranked Flex",
    "ARAM": "ARAM",
    "CHERRY": "Arena",
    "TEAM_BUILDER_DRAFT": "Draft Normal",
    "TEAM_BUILDER_RANKED_SOLO": "Ranked Solo",
  };
  return mapeo[modoJuego] || modoJuego;
}

function FilaJugador({ jugador, esRival }) {
  return (
    <div className="flex items-center gap-2 text-xs py-1">
      <img src={champeonImgUrl(jugador.campeon)} alt={jugador.campeon} className="w-6 h-6 rounded-full border border-black" />
      <span className="text-slate-400 w-16 truncate font-stat">{jugador.role || "-"}</span>
      <span className={`flex-1 truncate font-stat ${esRival ? "text-red-300" : "text-remi-gold"}`}>{jugador.riot_id}</span>
      <span className="text-slate-200 w-16 text-right font-stat">{jugador.kills}/{jugador.deaths}/{jugador.assists}</span>
      <span className="text-slate-400 w-10 text-right font-stat">{jugador.cs_total} cs</span>
    </div>
  );
}

function DetallePartida({ detalle }) {
  if (!detalle) return <p className="text-slate-300 text-sm p-4">Cargando detalle...</p>;

  return (
    <div className="bg-remi-navy border-3 border-black mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <div>
        <p className="text-remi-gold font-display text-xs mb-2">
          EQUIPO AZUL — {detalle.equipo_100.score.kills}/{detalle.equipo_100.score.deaths}/{detalle.equipo_100.score.assists}
        </p>
        {detalle.equipo_100.jugadores.map((j, i) => (
          <FilaJugador key={i} jugador={j} esRival={false} />
        ))}
      </div>
      <div>
        <p className="text-red-400 font-display text-xs mb-2">
          EQUIPO ROJO — {detalle.equipo_200.score.kills}/{detalle.equipo_200.score.deaths}/{detalle.equipo_200.score.assists}
        </p>
        {detalle.equipo_200.jugadores.map((j, i) => (
          <FilaJugador key={i} jugador={j} esRival={true} />
        ))}
      </div>
    </div>
  );
}

function PartidaCard({ partida, expandida, onClick, detalle }) {
  const bgStyle = { backgroundColor: partida.win ? "#0052CC" : "#E63946" };

  return (
    <div>
      <div
        onClick={onClick}
        className={`brutal-block flex items-center gap-4 p-4 cursor-pointer hover:brightness-110 transition text-white`}
        style={bgStyle}
      >
        <div className="w-24 flex-shrink-0 text-center">
          <p className="font-display text-sm">
            {partida.win ? "VICTORIA" : "DERROTA"}
          </p>
          <p className="text-xs opacity-80 font-stat">{formatearModoJuego(partida.modo_juego)}</p>
          <p className="text-xs opacity-70 font-stat">{formatearDuracion(partida.duracion_segundos)}</p>
          <p className={`text-xs font-stat font-bold ${
            partida.lp_change > 0 ? "text-yellow-300" :
            partida.lp_change < 0 ? "text-red-200" :
            "text-slate-400"
          }`}>
            {partida.lp_change > 0 ? "+" : ""}{partida.lp_change} LP
          </p>
          <p className="text-xs opacity-70 font-stat">{formatearFecha(partida.fecha)}</p>
        </div>

        <div className="flex items-center gap-1">
          <img
            src={champeonImgUrl(partida.campeon)}
            alt={partida.campeon}
            className="w-12 h-12 rounded-full border-2 border-black"
          />
          <div className="flex flex-col gap-1">
            {[partida.summoner1_id, partida.summoner2_id].map((s, i) => {
              const url = summonerSpellImgUrl(s);
              return url ? (
                <img key={i} src={url} alt="hechizo" className="w-5 h-5 border border-black" />
              ) : (
                <div key={i} className="w-5 h-5 bg-black/20 border border-black" />
              );
            })}
          </div>
        </div>

        <div className="w-28 flex-shrink-0 text-center">
          <p className="font-stat font-bold">
            {partida.kills} / <span className="opacity-80">{partida.deaths}</span> / {partida.assists}
          </p>
          <p className="text-xs opacity-80 font-stat">CS {partida.cs_total}</p>
        </div>

        <div className="grid grid-cols-4 gap-0.5 w-fit">
          {partida.items.map((itemId, i) => {
            const url = itemImgUrl(itemId);
            return url ? (
              <img key={i} src={url} alt="item" className="w-8 h-8 border border-black" />
            ) : (
              <div key={i} className="w-8 h-8 bg-black/20 border border-black" />
            );
          })}
        </div>

        <div className="flex flex-col gap-1 flex-shrink-0">
          {partida.badges.map((badge, i) => (
            <span key={i} className="brutal-btn text-xs font-display px-2 py-0.5 bg-remi-gold text-remi-navy text-center">
              {badge}
            </span>
          ))}
        </div>
      </div>

      {expandida && <DetallePartida detalle={detalle} />}
    </div>
  );
}

function HistorialPartidas({ partidas, sinTarjeta }) {
  const [matchExpandido, setMatchExpandido] = useState(null);
  const [detalles, setDetalles] = useState({});

  const handleClickPartida = async (matchId) => {
    if (matchExpandido === matchId) {
      setMatchExpandido(null);
      return;
    }
    setMatchExpandido(matchId);

    if (!detalles[matchId]) {
      try {
        const res = await getPartidaDetalle(matchId);
        setDetalles((prev) => ({ ...prev, [matchId]: res.data }));
      } catch (err) {
        console.error("No se pudo cargar el detalle de la partida", err);
      }
    }
  };

  if (!partidas || partidas.length === 0) {
    return <p className="text-slate-600 text-sm text-center py-8">Sin partidas registradas</p>;
  }

  const lista = (
    <div className="flex flex-col gap-3">
      {partidas.map((partida) => (
        <PartidaCard
          key={partida.match_id}
          partida={partida}
          expandida={matchExpandido === partida.match_id}
          detalle={detalles[partida.match_id]}
          onClick={() => handleClickPartida(partida.match_id)}
        />
      ))}
    </div>
  );

  if (sinTarjeta) return lista;

  return (
    <div className="brutal-card p-6">
      <h3 className="text-sm font-display uppercase tracking-wide mb-3">Historial de partidas</h3>
      {lista}
    </div>
  );
}

export default HistorialPartidas;
