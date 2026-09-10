import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

function Tooltip({ children, title, description, position = "auto" }) {
  const [mostrar, setMostrar] = useState(false);
  const [posicionActual, setPosicionActual] = useState("bottom");
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef(null);
  const containerRef = useRef(null);

  // Detectar mejor posición cuando se muestra
  useEffect(() => {
    if (!mostrar || !containerRef.current) return;

    const calcularPosicion = () => {
      const rect = containerRef.current.getBoundingClientRect();
      const tooltipHeight = 130;
      const tooltipWidth = 320;

      // Detectar espacio disponible
      const espacioArriba = rect.top;
      const espacioAbajo = window.innerHeight - rect.bottom;
      const espacioIzquierda = rect.left;
      const espacioDerecha = window.innerWidth - rect.right;

      // Elegir mejor posición
      let mejorPosicion = "bottom";
      let top = 0;
      let left = 0;

      if (position === "auto") {
        if (espacioAbajo < tooltipHeight && espacioArriba > tooltipHeight) {
          mejorPosicion = "top";
        } else if (espacioAbajo >= tooltipHeight) {
          mejorPosicion = "bottom";
        } else if (espacioIzquierda > tooltipWidth) {
          mejorPosicion = "left";
        } else if (espacioDerecha > tooltipWidth) {
          mejorPosicion = "right";
        }
      } else {
        mejorPosicion = position;
      }

      // Calcular coordenadas en viewport
      switch (mejorPosicion) {
        case "top":
          top = rect.top - tooltipHeight - 8;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
        case "bottom":
          top = rect.bottom + 8;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
        case "left":
          top = rect.top + rect.height / 2 - 65;
          left = rect.left - tooltipWidth - 8;
          break;
        case "right":
          top = rect.top + rect.height / 2 - 65;
          left = rect.right + 8;
          break;
      }

      // Ajustar si se sale del viewport
      if (left < 10) left = 10;
      if (left + tooltipWidth > window.innerWidth - 10) {
        left = window.innerWidth - tooltipWidth - 10;
      }
      if (top < 10) top = 10;

      setCoords({ top, left });
      setPosicionActual(mejorPosicion);
    };

    calcularPosicion();
    window.addEventListener("scroll", calcularPosicion);
    window.addEventListener("resize", calcularPosicion);

    return () => {
      window.removeEventListener("scroll", calcularPosicion);
      window.removeEventListener("resize", calcularPosicion);
    };
  }, [mostrar, position]);

  const tooltipContent = mostrar && (
    <div
      ref={tooltipRef}
      className="fixed z-[9999] bg-remi-navy border-2 border-black rounded-sm shadow-2xl pointer-events-none w-80"
      style={{
        top: `${coords.top}px`,
        left: `${coords.left}px`,
      }}
    >
      <div className="p-3">
        {title && <p className="font-display text-xs text-remi-gold mb-2 break-words">{title}</p>}
        {description && (
          <p className="text-xs text-slate-300 font-stat break-words leading-relaxed whitespace-normal">
            {description}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div
        className="inline-block"
        ref={containerRef}
        onMouseEnter={() => setMostrar(true)}
        onMouseLeave={() => setMostrar(false)}
      >
        {children}
      </div>
      {tooltipContent && createPortal(tooltipContent, document.body)}
    </>
  );
}

export default Tooltip;
