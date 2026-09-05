import { useState } from "react";
import Buscador from "./components/Buscador";
import { getPerfil, getLigas, getWinrate, getKda, getCampeones, getCompaneros } from "./services/api";
import Comparador from "./components/Comparador";

function App() {
  const [perfil, setPerfil] = useState(null);
  const [ligas, setLigas] = useState([]);
  const [winrate, setWinrate] = useState(null);
  const [kda, setKda] = useState(null);
  const [campeones, setCampeones] = useState([]);
  const [companeros, setCompaneros] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const handleBuscar = async (gameName, tagLine) => {
    setCargando(true);
    setError(null);
    setPerfil(null);

    try {
      const perfilRes = await getPerfil(gameName, tagLine);
      setPerfil(perfilRes.data);

      const [ligasRes, winrateRes, kdaRes, campeonesRes, companerosRes] =
        await Promise.all([
          getLigas(gameName, tagLine),
          getWinrate(gameName, tagLine),
          getKda(gameName, tagLine),
          getCampeones(gameName, tagLine),
          getCompaneros(gameName, tagLine),
        ]);

      setLigas(ligasRes.data);
      setWinrate(winrateRes.data);
      setKda(kdaRes.data);
      setCampeones(campeonesRes.data);
      setCompaneros(companerosRes.data);
    } catch (err) {
      setError("No se encontró ese invocador");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center pt-20 gap-8 pb-20 px-4">
      <h1 className="text-4xl font-bold text-white">REMI.GG 🎮</h1>
      <Buscador onBuscar={handleBuscar} />

      {cargando && <p className="text-slate-400">Buscando (puede tardar unos segundos)...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {perfil && (
        <div className="w-full max-w-2xl flex flex-col gap-4">
          <div className="bg-slate-800 rounded-xl p-6 text-white">
            <h2 className="text-2xl font-bold">{perfil.riot_id}</h2>
            <p className="text-slate-400">Nivel {perfil.summoner_level}</p>
          </div>

          {ligas.length > 0 && (
            <div className="bg-slate-800 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Ligas</h3>
              {ligas.map((l, i) => (
                <p key={i} className="text-slate-300">
                  {l.queue_type}: {l.tier} {l.rank} — {l.league_points} LP ({l.wins}V / {l.losses}D)
                </p>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
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
                <p className="text-3xl font-bold text-yellow-400">
                  {kda.kills_prom} / {kda.deaths_prom} / {kda.assists_prom}
                </p>
                <p className="text-slate-400 text-sm">Ratio: {kda.kda_ratio}</p>
              </div>
            )}
          </div>

          {campeones.length > 0 && (
            <div className="bg-slate-800 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Stats por campeón</h3>
              {campeones.map((c, i) => (
                <p key={i} className="text-slate-300">
                  {c.campeon}: {c.partidas} partidas, {c.winrate}% winrate
                </p>
              ))}
            </div>
          )}

          {companeros.length > 0 && (
            <div className="bg-slate-800 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Compañeros frecuentes</h3>
              {companeros.map((c, i) => (
                <p key={i} className="text-slate-300">
                  {c.riot_id}: {c.partidas} partidas juntos, {c.winrate}% winrate
                </p>
              ))}
            </div>
          )}
        </div>
      )}
   <div className="w-full h-px bg-slate-700 my-8" />
<Comparador />
    </div>
  );
}

export default App;
