export default function Ticker() {
  const motivationalPhrases = [
    "CONOCE TU ESTADÍSTICA",
    "MEJORA COMO JUGADOR",
    "LLEGA A LA CIMA",
    "DEMUESTRA TU PODER",
    "LA VICTORIA TE ESPERA",
    "CONVIÉRTETE EN LEYENDA",
    "CADA PARTIDA TE ACERCA A LA GLORIA",
    "DOMINA EL RIFT",
    "DESPIERTA TU POTENCIAL",
    "SUPERA TUS LÍMITES",
    "LA EXCELENCIA ES EL CAMINO",
    "TU MOMENTO ES AHORA",
  ];

  // Duplicamos los items para lograr el loop infinito continuo sin saltos visuales
  const renderItems = () => (
    <>
      {motivationalPhrases.map((text, i) => (
        <div key={i} className="ticker-item">
          <span>{text}</span>
        </div>
      ))}
    </>
  );

  return (
    <div className="ticker-wrap w-full mt-auto">
      <div className="ticker-content">
        {renderItems()}
        {renderItems()}
      </div>
    </div>
  );
}
