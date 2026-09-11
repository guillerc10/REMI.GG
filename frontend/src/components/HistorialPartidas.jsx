import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from "recharts";
import { champeonImgUrl, itemImgUrl, summonerSpellImgUrl } from "../utils/ddragon";
import { getPartidaDetalle } from "../services/api";
import Tooltip from "./Tooltip";
import { obtenerDatosItem, obtenerDatosHechizo, LANE_ORDER } from "../utils/gameData";
import { obtenerIconoLinea } from "./LaneIcons";

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
    "RANKED_SOLO_5x5": "Solo/Dúo 5v5",
    "RANKED_FLEX_SR": "Flex 5v5",
    "RANKED_FLEX_TT": "Flex 3v3",
    "ARAM": "ARAM",
    "CHERRY": "Arena",
    "TEAM_BUILDER_DRAFT": "Draft Normal",
    "TEAM_BUILDER_RANKED_SOLO": "Ranked Solo",
  };
  return mapeo[modoJuego] || modoJuego;
}

function FilaJugador({ jugador, esRival }) {
  const IconoLinea = obtenerIconoLinea(jugador.role);

  return (
    <div className="flex items-center gap-2 text-xs py-1">
      <Tooltip title={jugador.campeon} description="Campeón de partida" position="right">
        <img
          src={champeonImgUrl(jugador.campeon)}
          alt={jugador.campeon}
          className="w-6 h-6 rounded-full border border-black cursor-help hover:brightness-110 transition"
        />
      </Tooltip>
      {IconoLinea && (
        <div
          title={jugador.role}
          className="w-5 h-5 opacity-70 hover:opacity-100 transition cursor-help text-slate-600"
        >
          <IconoLinea />
        </div>
      )}
      <span className={`flex-1 truncate font-stat ${esRival ? "text-red-300" : "text-remi-gold"}`}>{jugador.riot_id}</span>
      <span className="text-slate-200 w-16 text-right font-stat">{jugador.kills}/{jugador.deaths}/{jugador.assists}</span>
      <span className="text-slate-400 w-10 text-right font-stat">{jugador.cs_total} cs</span>
    </div>
  );
}

function DetallePartida({ detalle }) {
  const [pestaña, setPestaña] = useState("kda");

  if (!detalle) return <p className="text-slate-300 text-sm p-4">Cargando detalle...</p>;

  // Función para ordenar jugadores por rol
  const ordenarPorRol = (jugadores) => {
    return [...jugadores].sort((a, b) => {
      const indexA = LANE_ORDER.indexOf(a.role || "UTILITY");
      const indexB = LANE_ORDER.indexOf(b.role || "UTILITY");
      return indexA - indexB;
    });
  };

  const equipo100Ordenado = ordenarPorRol(detalle.equipo_100.jugadores);
  const equipo200Ordenado = ordenarPorRol(detalle.equipo_200.jugadores);

  // Función para formatear números grandes (ej: 15234 → 15.2K)
  const formatearDano = (damage) => {
    if (damage >= 1000000) return (damage / 1000000).toFixed(1) + "M";
    if (damage >= 1000) return (damage / 1000).toFixed(1) + "K";
    return damage.toString();
  };

  return (
    <div className="bg-remi-navy border-3 border-black mt-2">
      {/* Pestañas */}
      <div className="flex border-b-2 border-black">
        <button
          onClick={() => setPestaña("kda")}
          className={`flex-1 py-2 text-xs font-display uppercase transition ${
            pestaña === "kda"
              ? "bg-remi-navy text-remi-gold"
              : "text-slate-400 hover:bg-black/10"
          }`}
        >
          KDA
        </button>
        <button
          onClick={() => setPestaña("dano")}
          className={`flex-1 py-2 text-xs font-display uppercase transition border-l-2 border-black ${
            pestaña === "dano"
              ? "bg-remi-navy text-remi-gold"
              : "text-slate-400 hover:bg-black/10"
          }`}
        >
          DAÑO
        </button>
        <button
          onClick={() => setPestaña("analisis")}
          className={`flex-1 py-2 text-xs font-display uppercase transition border-l-2 border-black ${
            pestaña === "analisis"
              ? "bg-remi-navy text-remi-gold"
              : "text-slate-400 hover:bg-black/10"
          }`}
        >
          ANÁLISIS
        </button>
      </div>

      {/* Contenido de pestañas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {pestaña === "kda" ? (
          <>
            <div>
              <p className="text-remi-gold font-display text-xs mb-2">
                EQUIPO AZUL — {detalle.equipo_100.score.kills}/{detalle.equipo_100.score.deaths}/{detalle.equipo_100.score.assists}
              </p>
              {equipo100Ordenado.map((j, i) => (
                <FilaJugador key={i} jugador={j} esRival={false} />
              ))}
            </div>
            <div>
              <p className="text-red-400 font-display text-xs mb-2">
                EQUIPO ROJO — {detalle.equipo_200.score.kills}/{detalle.equipo_200.score.deaths}/{detalle.equipo_200.score.assists}
              </p>
              {equipo200Ordenado.map((j, i) => (
                <FilaJugador key={i} jugador={j} esRival={true} />
              ))}
            </div>
          </>
        ) : pestaña === "dano" ? (
          <>
            <div>
              <p className="text-remi-gold font-display text-xs mb-2">
                EQUIPO AZUL — {formatearDano(detalle.equipo_100.score.damage)} DMG
              </p>
              {equipo100Ordenado.map((j, i) => (
                <div key={i} className="flex items-center gap-2 text-xs py-1">
                  <img
                    src={champeonImgUrl(j.campeon)}
                    alt={j.campeon}
                    className="w-6 h-6 rounded-full border border-black flex-shrink-0"
                  />
                  <span className="flex-1 truncate font-stat text-remi-gold">{j.riot_id}</span>
                  <span className="text-slate-200 font-stat font-bold">{formatearDano(j.damage_to_champions)} DMG</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-red-400 font-display text-xs mb-2">
                EQUIPO ROJO — {formatearDano(detalle.equipo_200.score.damage)} DMG
              </p>
              {equipo200Ordenado.map((j, i) => (
                <div key={i} className="flex items-center gap-2 text-xs py-1">
                  <img
                    src={champeonImgUrl(j.campeon)}
                    alt={j.campeon}
                    className="w-6 h-6 rounded-full border border-black flex-shrink-0"
                  />
                  <span className="flex-1 truncate font-stat text-red-300">{j.riot_id}</span>
                  <span className="text-slate-200 font-stat font-bold">{formatearDano(j.damage_to_champions)} DMG</span>
                </div>
              ))}
            </div>
          </>
        ) : pestaña === "analisis" ? (
          <GraficoAnalisis detalle={detalle} equipo100Ordenado={equipo100Ordenado} equipo200Ordenado={equipo200Ordenado} />
        ) : null}
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
          <Tooltip title={partida.campeon} description="Campeón seleccionado" position="bottom">
            <img
              src={champeonImgUrl(partida.campeon)}
              alt={partida.campeon}
              className="w-12 h-12 rounded-full border-2 border-black cursor-help hover:brightness-110 transition"
            />
          </Tooltip>
          <div className="flex flex-col gap-1">
            {[partida.summoner1_id, partida.summoner2_id].map((s, i) => {
              const url = summonerSpellImgUrl(s);
              const datos = obtenerDatosHechizo(s);
              return url ? (
                <Tooltip
                  key={i}
                  title={datos?.nombre}
                  description={datos?.descripcion}
                  position="right"
                >
                  <img
                    src={url}
                    alt="hechizo"
                    className="w-5 h-5 border border-black cursor-help hover:brightness-110 transition"
                  />
                </Tooltip>
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
            const datos = obtenerDatosItem(itemId);
            return url && datos ? (
              <Tooltip
                key={i}
                title={datos.nombre}
                description={datos.descripcion}
                position="auto"
              >
                <img
                  src={url}
                  alt="item"
                  className="w-8 h-8 border border-black cursor-help hover:brightness-110 transition"
                />
              </Tooltip>
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

// Componente de gráficos de análisis
function GraficoAnalisis({ detalle, equipo100Ordenado, equipo200Ordenado }) {
  const COLORS_BLUE = ["#0052CC", "#3B82F6", "#60A5FA", "#93C5FD", "#DBEAFE"];
  const COLORS_RED = ["#E63946", "#F87171", "#FCA5A5", "#FECACA", "#FEE2E2"];

  const formatNum = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const dataOro100 = equipo100Ordenado.map((j) => ({ name: j.riot_id.split("#")[0], value: j.gold_earned }));
  const dataOro200 = equipo200Ordenado.map((j) => ({ name: j.riot_id.split("#")[0], value: j.gold_earned }));
  const dataDano100 = equipo100Ordenado.map((j) => ({ name: j.riot_id.split("#")[0], value: j.damage_to_champions }));
  const dataDano200 = equipo200Ordenado.map((j) => ({ name: j.riot_id.split("#")[0], value: j.damage_to_champions }));
  const dataWardsPlaced100 = equipo100Ordenado.map((j) => ({ name: j.riot_id.split("#")[0], value: j.wards_placed }));
  const dataWardsPlaced200 = equipo200Ordenado.map((j) => ({ name: j.riot_id.split("#")[0], value: j.wards_placed }));
  const dataWardsDestroyed100 = equipo100Ordenado.map((j) => ({ name: j.riot_id.split("#")[0], value: j.wards_destroyed }));
  const dataWardsDestroyed200 = equipo200Ordenado.map((j) => ({ name: j.riot_id.split("#")[0], value: j.wards_destroyed }));
  const dataCS100 = equipo100Ordenado.map((j) => ({ name: j.riot_id.split("#")[0], value: j.cs_total }));
  const dataCS200 = equipo200Ordenado.map((j) => ({ name: j.riot_id.split("#")[0], value: j.cs_total }));

  const GraficoMetrica = ({ titulo, data100, data200, colors100, colors200, total100, total200 }) => (
    <div className="bg-black/20 border-2 border-black p-4 rounded-sm">
      <h4 className="text-xs font-display uppercase mb-3 text-slate-300 tracking-wide font-bold">{titulo}</h4>

      {/* Gráficos + Tablas lado a lado */}
      <div className="grid grid-cols-2 gap-4">
        {/* EQUIPO AZUL */}
        <div className="flex flex-col">
          <div className="text-center mb-3">
            <p className="text-2xl font-display text-remi-gold font-bold">{formatNum(total100)}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wide">Equipo Azul</p>
          </div>

          {/* Gráfico Azul */}
          <div className="flex-1 flex items-center justify-center mb-3">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data100}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percent }) => `${percent > 15 ? `${(percent * 100).toFixed(0)}%` : ""}`}
                  outerRadius={65}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data100.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors100[index % colors100.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value) => formatNum(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Tabla Azul */}
          <div className="border-t-2 border-black pt-2">
            <p className="text-remi-gold font-display text-xs mb-2 uppercase font-bold">Desglose</p>
            <div className="space-y-1">
              {data100.map((d, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="truncate text-slate-300">{d.name}</span>
                  <span className="font-bold text-remi-gold ml-2 flex-shrink-0">{formatNum(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* EQUIPO ROJO */}
        <div className="flex flex-col">
          <div className="text-center mb-3">
            <p className="text-2xl font-display text-red-400 font-bold">{formatNum(total200)}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wide">Equipo Rojo</p>
          </div>

          {/* Gráfico Rojo */}
          <div className="flex-1 flex items-center justify-center mb-3">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data200}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percent }) => `${percent > 15 ? `${(percent * 100).toFixed(0)}%` : ""}`}
                  outerRadius={65}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data200.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors200[index % colors200.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value) => formatNum(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Tabla Rojo */}
          <div className="border-t-2 border-black pt-2">
            <p className="text-red-400 font-display text-xs mb-2 uppercase font-bold">Desglose</p>
            <div className="space-y-1">
              {data200.map((d, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="truncate text-slate-300">{d.name}</span>
                  <span className="font-bold text-red-400 ml-2 flex-shrink-0">{formatNum(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 text-white">
      <div className="grid grid-cols-2 gap-4">
        <GraficoMetrica
          titulo="💰 ORO"
          data100={dataOro100}
          data200={dataOro200}
          colors100={COLORS_BLUE}
          colors200={COLORS_RED}
          total100={detalle.equipo_100.score.gold}
          total200={detalle.equipo_200.score.gold}
        />
        <GraficoMetrica
          titulo="⚔️ DAÑO A CAMPEONES"
          data100={dataDano100}
          data200={dataDano200}
          colors100={COLORS_BLUE}
          colors200={COLORS_RED}
          total100={detalle.equipo_100.score.damage}
          total200={detalle.equipo_200.score.damage}
        />
        <GraficoMetrica
          titulo="👁️ WARDS COLOCADOS"
          data100={dataWardsPlaced100}
          data200={dataWardsPlaced200}
          colors100={COLORS_BLUE}
          colors200={COLORS_RED}
          total100={detalle.equipo_100.score.wards_placed}
          total200={detalle.equipo_200.score.wards_placed}
        />
        <GraficoMetrica
          titulo="🔍 WARDS DESTRUIDOS"
          data100={dataWardsDestroyed100}
          data200={dataWardsDestroyed200}
          colors100={COLORS_BLUE}
          colors200={COLORS_RED}
          total100={detalle.equipo_100.score.wards_destroyed}
          total200={detalle.equipo_200.score.wards_destroyed}
        />
        <GraficoMetrica
          titulo="🎯 MINIONS (CS)"
          data100={dataCS100}
          data200={dataCS200}
          colors100={COLORS_BLUE}
          colors200={COLORS_RED}
          total100={detalle.equipo_100.score.cs}
          total200={detalle.equipo_200.score.cs}
        />
      </div>
    </div>
  );
}

export default HistorialPartidas;
