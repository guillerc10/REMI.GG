import { useState } from "react";
import Buscador from "./components/Buscador";
import Comparador from "./components/Comparador";
import HistorialPartidas from "./components/HistorialPartidas";
import { getPerfil, getLigas, getWinrate, getKda, getCampeones, getCompaneros, getHistorial } from "./services/api";

function App() {
  const [perfil, setPerfil] = useState(null);
  const [ligas, setLigas] = useState([]);
  const [winrate, setWinrate] = useState(null);
  const [kda, setKda] = useState(null);
  const [campeones, setCampeones] = useState([]);
  const [companeros, setCompaneros] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const handleBuscar = async (gameName, tagLine) => {
    setCargando(true);
    setError(null);
    setPerfil(null);

    try {
      const perfilRes = await getPerfil(gameName, tagLine);
      setPerfil(perfilRes.data);

      const [ligasRes, winrateRes, kdaRes, campeonesRes, companerosRes, historialRes] =
        await Promise.all([
          getLigas(gameName, tagLine),
          getWinrate(gameName, tagLine),
          getKda(gameName, tagLine),
          getCampeones(gameName, tagLine),
          getCompaneros(gameName, tagLine),
          getHistorial(gameName, tagLine),
        ]);

      setLigas(ligasRes.data);
      setWinrate(winrateRes.data);
      setKda(kdaRes.data);
      setCampeones(campeonesRes.data);
      setCompaneros(companerosRes.data);
      setHistorial(historialRes.data);
    } catch (err) {
      setError("No se encontró ese invocador");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center pt-12 gap-6 pb-20 px-4">
      <h1 className="text-4xl font-bold text-white">REMI.GG 🎮</h1>
      <Buscador onBuscar={handleBuscar} />

      {cargando && <p className="text-slate-400">Buscando (puede tardar unos segundos)...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {perfil && (
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 items-start">
          {/* Columna izquierda: perfil, ligas, winrate, KDA */}
          <div className="flex flex-col gap-4">
            <div className="bg-slate-800 rounded-xl p-6 text-white">
              <h2 className="text-2xl font-bold">{perfil.riot_id}</h2>
              <p className="text-slate-400">Nivel {perfil.summoner_level}</p>
            </div>

            {ligas.length > 0 && (
              <div className="bg-slate-800 rounded-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Ligas</h3>
                {ligas.map((l, i) => (
                  <p key={i} className="text-slate-300 text-sm mb-1">
                    <span className="block font-medium text-slate-200">{l.queue_type}</span>
                    {l.tier} {l.rank} — {l.league_points} LP ({l.wins}V / {l.losses}D)
                  </p>
                ))}
              </div>
            )}

            {winrate && (
              <div className="bg-slate-800 rounded-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-1">Winrate</h3>
                <p className="text-3xl font-bold text-blue-400">{winrate.winrate}%</p>
                <p className="text-slate-400 text-sm">
                  {winrate.victorias}V / {winrate.derrotas}D ({winrate.total} partidas)
                </p>
              </div>
            )}

            {kda && (
              <div className="bg-slate-800 rounded-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-1">KDA promedio</h3>
                <p className="text-2xl font-bold text-yellow-400">
                  {kda.kills_prom} / {kda.deaths_prom} / {kda.assists_prom}
                </p>
                <p className="text-slate-400 text-sm">Ratio: {kda.kda_ratio}</p>
              </div>
            )}

            {companeros.length > 0 && (
              <div className="bg-slate-800 rounded-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Compañeros frecuentes</h3>
                <div className="flex flex-col gap-1 max-h-64 overflow-y-auto pr-1">
                  {companeros.map((c, i) => (
                    <p key={i} className="text-slate-300 text-sm">
                      {c.riot_id}: {c.partidas}p, {c.winrate}%
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha: campeones + historial */}
          <div className="flex flex-col gap-4">
            {campeones.length > 0 && (
              <div className="bg-slate-800 rounded-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Stats por campeón</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {campeones.map((c, i) => (
                    <div key={i} className="bg-slate-900 rounded-lg p-3">
                      <p className="text-slate-200 font-medium text-sm">{c.campeon}</p>
                      <p className="text-slate-400 text-xs">{c.partidas} partidas</p>
                      <p className={`text-sm font-semibold ${c.winrate >= 50 ? "text-blue-400" : "text-red-400"}`}>
                        {c.winrate}% WR
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <HistorialPartidas partidas={historial} />
          </div>
        </div>
      )}

      <div className="w-full h-px bg-slate-700 my-8 max-w-6xl" />
      <Comparador />
    </div>
  );
}

export default App;
