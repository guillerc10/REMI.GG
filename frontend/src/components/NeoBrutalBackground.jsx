export default function NeoBrutalBackground() {
  return (
    <div className="neo-brutal-bg">
      {/* Fondo con cuadrícula base */}
      <div className="grid-background"></div>

      {/* Cuadrículas animadas (Motoaki-style) */}
      <div className="animated-grids">
        <div className="grid-layer grid-layer-1"></div>
        <div className="grid-layer grid-layer-2"></div>
        <div className="grid-layer grid-layer-3"></div>
      </div>

      {/* Capa de degradado neo */}
      <div className="gradient-overlay"></div>

      {/* Símbolos decorativos animados */}
      <div className="symbols-container">
        {/* Círculos */}
        <div className="symbol circle-1"></div>
        <div className="symbol circle-2"></div>
        <div className="symbol circle-3"></div>

        {/* Líneas */}
        <div className="symbol line-1"></div>
        <div className="symbol line-2"></div>

        {/* Asteriscos/símbolos puntuales */}
        <div className="symbol star-1">*</div>
        <div className="symbol star-2">✕</div>
        <div className="symbol star-3">●</div>
      </div>
    </div>
  );
}
