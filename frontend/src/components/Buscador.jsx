import { useState } from "react";

function Buscador({ onBuscar, onActualizar, actualizando, ultimaBusqueda }) {
  const [riotId, setRiotId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const [gameName, tagLine] = riotId.split("#");
    if (!gameName || !tagLine) {
      alert("Escribe el Riot ID en formato Nombre#TAG");
      return;
    }
    onBuscar(gameName.trim(), tagLine.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-2xl">
      <input
        type="text"
        value={riotId}
        onChange={(e) => setRiotId(e.target.value)}
        placeholder="Nombre#TAG (ej: JokerVenom#LAN)"
        className="flex-1 px-4 py-2 rounded-lg bg-slate-800 text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:border-blue-500"
      />
      <button
        type="submit"
        className="px-6 py-2 rounded-lg bg-remi-teal text-white font-semibold hover:bg-remi-navy transition brutal-btn"
      >
        Buscar
      </button>
      <button
        type="button"
        onClick={onActualizar}
        disabled={!ultimaBusqueda || actualizando}
        className="px-6 py-2 rounded-lg bg-remi-navy text-white font-semibold hover:bg-remi-blue transition brutal-btn disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {actualizando ? "..." : "Actualizar"}
      </button>
    </form>
  );
}

export default Buscador;