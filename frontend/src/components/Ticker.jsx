export default function Ticker() {
  const items = [
    "REMI.GG - LEAGUE OF LEGENDS STATS",
    "BUILD YOUR DREAM TEAM",
    "ANALYZE YOUR PLAYSTYLE",
    "CLIMB THE RANKS",
  ];

  // Duplicamos los items para lograr el loop infinito continuo sin saltos visuales
  const renderItems = () => (
    <>
      {items.map((text, i) => (
        <div key={i} className="ticker-item">
          <span>{text}</span>
          <span>✦</span>
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
