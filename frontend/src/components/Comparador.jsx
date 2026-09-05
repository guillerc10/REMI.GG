import { useState } from "react";
import { compararInvocadores } from "../services/api";

function Comparador() {
  const [riotId1, setRiotId1] = useState("");
  const [riotId2, setRiotId2] = useState("");
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const handleComparar = async (e) => {
    e.preventDefault();
    const [gameName1, tagLine1] = riotId1.split("#");
    const [gameName2, tagLine2] = riotId2.split("#");

    if (!gameName1 || !tagLine1 || !gameName2 || !tagLine2) {
      alert("Escribe ambos Riot ID en formato Nombre#TAG");
      return;
    }

    setCargando(true);
    setError(null);
    setResultado(null);

    try {
      const response = await compararInvocadores(
        gameName1.trim(), tagLine1.trim(),
        gameName2.trim(), tagLine2.trim()
      );
      setResultado(response.data);
    } catch (err) {
      setError("No se pudo comparar — revisa que ambos invocadores existan");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="w-full max-w-2xl flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-white text-center">Comparar jugadores</h2>

      <form onSubmit={handleComparar} className="flex gap-2">
        <input
          type="text"
          value={riotId1}
          onChange={(e) => setRiotId1(e.target.value)}
          placeholder="Jugador 1 (Nombre#TAG)"
          className="flex-1 px-4 py-2 rounded-lg bg-slate-800 text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          value={riotId2}
          onChange={(e) => setRiotId2(e.target.value)}
          placeholder="Jugador 2 (Nombre#TAG)"
          className="flex-1 px-4 py-2 rounded-lg bg-slate-800 text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
        >
          Comparar
        </button>
      </form>

      {cargando && <p className="text-slate-400 text-center">Comparando...</p>}
      {error && <p className="text-red-400 text-center">{error}</p>}

      {resultado && (
        <div className="grid grid-cols-2 gap-4">
          {[resultado.jugador_1, resultado.jugador_2].map((j, i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-3">{j.riot_id}</h3>

              <div className="mb-3">
                <p className="text-sm text-slate-400">Winrate</p>
                <p className="text-2xl font-bold text-blue-400">{j.winrate.winrate}%</p>
                <p className="text-xs text-slate-500">
                  {j.winrate.victorias}V / {j.winrate.derrotas}D ({j.winrate.total} partidas)
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">KDA promedio</p>
                <p className="text-lg font-semibold text-yellow-400">
                  {j.kda.kills_prom} / {j.kda.deaths_prom} / {j.kda.assists_prom}
                </p>
                <p className="text-xs text-slate-500">Ratio: {j.kda.kda_ratio}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Comparador;