// Componentes SVG para cada línea - Estilo League of Legends

// TOP - Triángulo/Montaña con estilo
export const LaneIconTOP = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M12 3 L20 18 L15 18 L15 20 L9 20 L9 18 L4 18 Z" fillRule="evenodd" />
  </svg>
);

// JUNGLE - Árbol con ramas
export const LaneIconJUNGLE = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <circle cx="12" cy="6" r="3" />
    <circle cx="8" cy="10" r="2.5" />
    <circle cx="16" cy="10" r="2.5" />
    <rect x="11" y="14" width="2" height="6" />
  </svg>
);

// MIDDLE - Espadas cruzadas estilizadas
export const LaneIconMIDDLE = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M6 6 L14 14 M18 6 L10 14 M8 14 L16 22 M16 14 L8 22" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" />
    <circle cx="12" cy="14" r="1.5" fill="currentColor" />
  </svg>
);

// BOTTOM - Arco con flecha
export const LaneIconBOTTOM = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M18 6 Q12 10 12 16 Q12 10 6 6" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" />
    <line x1="12" y1="16" x2="12" y2="21" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" />
    <polygon points="12,21 10,18 14,18" fill="currentColor" />
  </svg>
);

// UTILITY - Escudo protector
export const LaneIconUTILITY = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M12 3 L20 7 L20 13 Q20 18 12 21 Q4 18 4 13 L4 7 Z" strokeWidth="1.2" stroke="currentColor" fill="currentColor" fillOpacity="0.3" />
  </svg>
);

// Map de componentes SVG por rol
const LANE_ICON_COMPONENTS = {
  "TOP": LaneIconTOP,
  "JUNGLE": LaneIconJUNGLE,
  "MIDDLE": LaneIconMIDDLE,
  "BOTTOM": LaneIconBOTTOM,
  "UTILITY": LaneIconUTILITY,
};

// Función para obtener componente de línea
export const obtenerIconoLinea = (role) => {
  return LANE_ICON_COMPONENTS[role] || null;
};
