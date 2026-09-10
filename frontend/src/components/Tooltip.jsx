import { useState } from "react";

function Tooltip({ children, title, description, position = "top" }) {
  const [mostrar, setMostrar] = useState(false);

  const posiciones = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setMostrar(true)}
        onMouseLeave={() => setMostrar(false)}
      >
        {children}
      </div>

      {mostrar && (
        <div
          className={`absolute ${posiciones[position]} z-50 bg-remi-navy border-2 border-black rounded-sm shadow-lg pointer-events-none w-80`}
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
              [position === "top" ? "bottom" : position === "bottom" ? "top" : position === "left" ? "right" : "left"]: "-5px",
              [position === "top" || position === "bottom" ? "left" : "top"]: "50%",
              transform: position === "top" ? "translateX(-50%) translateY(50%) rotate(45deg)" :
                         position === "bottom" ? "translateX(-50%) translateY(-50%) rotate(45deg)" :
                         position === "left" ? "translateY(-50%) translateX(50%) rotate(45deg)" :
                         "translateY(-50%) translateX(-50%) rotate(45deg)"
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Tooltip;
