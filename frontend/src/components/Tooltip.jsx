import { useState, useRef, useEffect } from "react";

function Tooltip({ children, title, description, position = "auto" }) {
  const [mostrar, setMostrar] = useState(false);
  const [posicionActual, setPosicionActual] = useState("bottom");
  const tooltipRef = useRef(null);
  const containerRef = useRef(null);

  const posiciones = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  // Detectar mejor posición cuando se muestra
  useEffect(() => {
    if (!mostrar || position !== "auto" || !containerRef.current) return;

    setTimeout(() => {
      const rect = containerRef.current.getBoundingClientRect();
      const tooltipHeight = 120; // altura aproximada del tooltip
      const tooltipWidth = 320;  // w-80 = 320px

      // Detectar espacio disponible
      const espacioArriba = rect.top;
      const espacioAbajo = window.innerHeight - rect.bottom;
      const espacioIzquierda = rect.left;
      const espacioDerecha = window.innerWidth - rect.right;

      // Elegir mejor posición
      let mejorPosicion = "bottom";

      if (espacioAbajo < tooltipHeight && espacioArriba > tooltipHeight) {
        mejorPosicion = "top";
      } else if (espacioAbajo >= tooltipHeight) {
        mejorPosicion = "bottom";
      } else if (espacioIzquierda > tooltipWidth) {
        mejorPosicion = "left";
      } else if (espacioDerecha > tooltipWidth) {
        mejorPosicion = "right";
      }

      setPosicionActual(mejorPosicion);
    }, 0);
  }, [mostrar, position]);

  const posicionFinal = position === "auto" ? posicionActual : position;

  return (
    <div className="relative inline-block" ref={containerRef}>
      <div
        onMouseEnter={() => setMostrar(true)}
        onMouseLeave={() => setMostrar(false)}
      >
        {children}
      </div>

      {mostrar && (
        <div
          ref={tooltipRef}
          className={`absolute ${posiciones[posicionFinal]} z-[9999] bg-remi-navy border-2 border-black rounded-sm shadow-2xl pointer-events-none w-80`}
        >
          <div className="p-3">
            {title && <p className="font-display text-xs text-remi-gold mb-2 break-words">{title}</p>}
            {description && (
              <p className="text-xs text-slate-300 font-stat break-words leading-relaxed whitespace-normal">
                {description}
              </p>
            )}
          </div>
          {/* Pequeña flecha */}
          <div
            className="absolute w-2 h-2 bg-remi-navy border-2 border-black transform -rotate-45"
            style={{
              [posicionFinal === "top" ? "bottom" : posicionFinal === "bottom" ? "top" : posicionFinal === "left" ? "right" : "left"]: "-5px",
              [posicionFinal === "top" || posicionFinal === "bottom" ? "left" : "top"]: "50%",
              transform: posicionFinal === "top" ? "translateX(-50%) translateY(50%) rotate(45deg)" :
                         posicionFinal === "bottom" ? "translateX(-50%) translateY(-50%) rotate(45deg)" :
                         posicionFinal === "left" ? "translateY(-50%) translateX(50%) rotate(45deg)" :
                         "translateY(-50%) translateX(-50%) rotate(45deg)"
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Tooltip;
