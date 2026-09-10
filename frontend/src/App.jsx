import { useState } from "react";
import Buscador from "./components/Buscador";
import HistorialPartidas from "./components/HistorialPartidas";
import CampeonesTop from "./components/CampeonesTop";
import {
  getPerfil, getLigas, getWinrate, getKda, getCampeones,
  getCompaneros, getHistorial, actualizarInvocador, getMaestrias,
} from "./services/api";
import { tierIconUrl, profileIconUrl } from "./utils/ddragon";
import NeoBrutalBackground from "./components/NeoBrutalBackground";
import Ticker from "./components/Ticker";

function App() {
  const [perfil, setPerfil] = useState(null);
  const [ligas, setLigas] = useState([]);
  const [winrate, setWinrate] = useState(null);
  const [kda, setKda] = useState(null);
  const [campeones, setCampeones] = useState([]);
  const [companeros, setCompaneros] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [maestrias, setMaestrias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState(null);
  const [ultimaBusqueda, setUltimaBusqueda] = useState(null);
  const [tabActiva, setTabActiva] = useState("historial");
  const [verTodosCompaneros, setVerTodosCompaneros] = useState(false);

  const cargarDatos = async (gameName, tagLine) => {
    const perfilRes = await getPerfil(gameName, tagLine);
    setPerfil(perfilRes.data);

    const [ligasRes, winrateRes, kdaRes, campeonesRes, companerosRes, historialRes, maestriasRes] =
      await Promise.all([
        getLigas(gameName, tagLine),
        getWinrate(gameName, tagLine),
        getKda(gameName, tagLine),
        getCampeones(gameName, tagLine),
        getCompaneros(gameName, tagLine),
        getHistorial(gameName, tagLine),
        getMaestrias(gameName, tagLine).catch(() => ({ data: [] })), // Si falla, devolver vacío
      ]);

    setLigas(ligasRes.data);
    setWinrate(winrateRes.data);
    setKda(kdaRes.data);
    setCampeones(campeonesRes.data);
    setCompaneros(companerosRes.data);
    setHistorial(historialRes.data);
    setMaestrias(maestriasRes.data);
  };

  const handleBuscar = async (gameName, tagLine) => {
    setCargando(true);
    setError(null);
    setPerfil(null);
    setVerTodosCompaneros(false);
    setTabActiva("historial");
    setUltimaBusqueda({ gameName, tagLine });

    try {
      await cargarDatos(gameName, tagLine);
    } catch (err) {
      setError("No se encontró ese invocador");
    } finally {
      setCargando(false);
    }
  };

  const handleActualizar = async () => {
    if (!ultimaBusqueda) return;
    setActualizando(true);
    setError(null);

    try {
      await actualizarInvocador(ultimaBusqueda.gameName, ultimaBusqueda.tagLine);
      await cargarDatos(ultimaBusqueda.gameName, ultimaBusqueda.tagLine);
    } catch (err) {
      setError("No se pudo actualizar el invocador");
    } finally {
      setActualizando(false);
    }
  };

  const companerosVisibles = verTodosCompaneros ? companeros : companeros.slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col items-center pt-12 relative overflow-hidden">
      <NeoBrutalBackground />

      <div className="w-full flex flex-col items-center gap-6 px-4 z-10 relative flex-grow pb-12">
        {/* Título comentado temporalmente para observar mejor el fondo */}
        {/* <h1 className="text-6xl md:text-8xl font-display tracking-tight brutal-title text-center mb-4">REMI.GG 🎮</h1> */}
        <Buscador
          onBuscar={handleBuscar}
          onActualizar={handleActualizar}
          actualizando={actualizando}
          ultimaBusqueda={ultimaBusqueda}
        />

      {cargando && <p className="text-remi-light">Buscando (puede tardar unos segundos)...</p>}
      {error && (
        <p className="brutal-btn bg-red-600 text-white font-semibold px-4 py-2">{error}</p>
      )}

      {perfil && (
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
          {/* Columna izquierda - Perfil e Info */}
          <div className="flex flex-col gap-6">
            <div className="brutal-card-static p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={profileIconUrl(perfil.profile_icon_id)}
                    alt="Icono de invocador"
                    className="w-16 h-16 rounded-full border-3 border-black"
                  />
                  <div>
                    <h2 className="text-2xl font-display">{perfil.riot_id}</h2>
                    <p className="text-slate-700 font-stat">Nivel {perfil.summoner_level}</p>
                  </div>
                </div>
              </div>
            </div>

            {ligas.length > 0 && (
              <div className="brutal-card-static p-6">
                <h3 className="text-sm font-display uppercase tracking-wide mb-3">Ligas</h3>
                <div className="flex flex-col gap-4">
                  {ligas.map((l, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img
                        src={tierIconUrl(l.tier)}
                        alt={l.tier}
                        className="w-16 h-16 flex-shrink-0"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                      <div>
                        <p className="text-xs text-slate-600 uppercase tracking-wide">{l.queue_type}</p>
                        <p className="font-display text-sm">{l.tier} {l.rank}</p>
                        <p className="text-sm font-stat text-slate-700">{l.league_points} LP</p>
                        <p className="text-xs text-slate-600">{l.wins}V / {l.losses}D</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {winrate && kda && (
              <div className="brutal-card-static p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-display uppercase tracking-wide">Rendimiento</h3>
                  <span className="text-xs text-slate-600 font-stat">{winrate.total} partidas</span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <svg className="w-16 h-16 -rotate-90">
                      <circle cx="32" cy="32" r="28" stroke="#00000022" strokeWidth="6" fill="none" />
                      <circle
                        cx="32" cy="32" r="28"
                        stroke={winrate.winrate >= 50 ? "#0052CC" : "#E63946"}
                        strokeWidth="6" fill="none"
                        strokeDasharray={2 * Math.PI * 28}
                        strokeDashoffset={2 * Math.PI * 28 * (1 - winrate.winrate / 100)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-display">
                      {winrate.winrate}%
                    </span>
                  </div>
                  <div>
                    <p className="text-slate-700 text-sm font-stat">{winrate.victorias}V / {winrate.derrotas}D</p>
                    <p className="text-xs text-slate-600">Winrate</p>
                  </div>
                </div>

                <div className="border-t-2 border-black pt-3">
                  <p className="text-xl font-stat font-bold text-remi-navy">
                    {kda.kills_prom} / {kda.deaths_prom} / {kda.assists_prom}
                  </p>
                  <p className="text-xs text-slate-600">KDA promedio — Ratio {kda.kda_ratio}</p>
                </div>
              </div>
            )}

            {companeros.length > 0 && (
              <div className="brutal-card-static p-6">
                <h3 className="text-xs font-display uppercase tracking-wide mb-2">Compañeros frecuentes</h3>
                <div className="flex flex-col gap-1.5">
                  {companerosVisibles.map((c, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-slate-700 truncate">{c.riot_id}</span>
                      <span className={`text-xs font-stat font-bold flex-shrink-0 ml-2 ${c.winrate >= 50 ? "text-blue-600" : "text-red-600"}`} style={{color: c.winrate >= 50 ? "#0052CC" : "#E63946"}}>
                        {c.partidas}p · {c.winrate}%
                      </span>
                    </div>
                  ))}
                </div>
                {companeros.length > 5 && (
                  <button
                    onClick={() => setVerTodosCompaneros(!verTodosCompaneros)}
                    className="text-xs font-display text-remi-navy underline mt-2"
                  >
                    {verTodosCompaneros ? "Ver menos" : `Ver ${companeros.length - 5} más`}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Columna derecha: Campeones Top + Historial */}
          <div className="flex flex-col gap-6">
            {campeones.length > 0 && maestrias.length > 0 && (
              <CampeonesTop maestrias={maestrias} campeones={campeones} />
            )}

            <div className="brutal-card overflow-hidden p-0">
              <div className="flex border-b-3 border-black">
                <button
                  onClick={() => setTabActiva("historial")}
                  className={`flex-1 py-3 text-sm font-display uppercase transition ${
                    tabActiva === "historial"
                      ? "bg-remi-navy text-remi-gold"
                      : "text-slate-600 hover:bg-black/5"
                  }`}
                >
                  Historial
                </button>
                <button
                  onClick={() => setTabActiva("campeones")}
                  className={`flex-1 py-3 text-sm font-display uppercase transition border-l-3 border-black ${
                    tabActiva === "campeones"
                      ? "bg-remi-navy text-remi-gold"
                      : "text-slate-600 hover:bg-black/5"
                  }`}
                >
                  Campeones
                </button>
              </div>

              <div className="p-4">
                {tabActiva === "campeones" && campeones.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {campeones.map((c, i) => (
                      <div key={i} className="brutal-block-static bg-white p-3">
                        <p className="font-display text-xs">{c.campeon}</p>
                        <p className="text-slate-600 text-xs font-stat">{c.partidas} partidas</p>
                        <p className={`text-sm font-stat font-bold`} style={{color: c.winrate >= 50 ? "#0052CC" : "#E63946"}}>
                          {c.winrate}% WR
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {tabActiva === "historial" && (
                  <div className="flex flex-col gap-3">
                    <HistorialPartidasContenido partidas={historial} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      </div>
      <Ticker />
    </div>
  );
}

function HistorialPartidasContenido({ partidas }) {
  return <HistorialPartidas partidas={partidas} sinTarjeta />;
}

export default App;
