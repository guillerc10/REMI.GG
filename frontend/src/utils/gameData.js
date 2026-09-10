// Datos de hechizos de invocador (Summoner Spells)
export const SUMMONER_SPELLS = {
  1: { nombre: "Impulso", descripcion: "Aumenta velocidad de movimiento durante 3s" },
  3: { nombre: "Agotar", descripcion: "Reduce ataque y velocidad de movimiento del enemigo" },
  4: { nombre: "Destello", descripcion: "Se teletransporta a una ubicación cercana" },
  6: { nombre: "Prisa", descripcion: "Aumenta la velocidad de movimiento durante 2s" },
  7: { nombre: "Curación", descripcion: "Restaura vida propia y de aliado cercano" },
  11: { nombre: "Quemadera", descripcion: "Invoca ayuda en la jungla para atacar" },
  12: { nombre: "Teletransporte", descripcion: "Se teletransporta a un aliado o torreta" },
  14: { nombre: "Polimorfía", descripcion: "Convierte a un enemigo en una criatura inofensiva" },
  21: { nombre: "Barrera de hechizos", descripcion: "Bloquea daño de hechizo próximo" },
  32: { nombre: "Bola de nieve", descripcion: "Lanza una bola que ralentiza a enemigos" },
};

// Datos básicos de items (nombres y descripciones breves)
export const ITEMS_DATA = {
  1001: { nombre: "Coraza de Espinas", descripcion: "Armadura y devuelve daño a enemigos" },
  1002: { nombre: "Corazón de Hielo", descripcion: "Vida y ralentiza enemigos cercanos" },
  1003: { nombre: "Primavera Abisal", descripcion: "Maná y regen de maná" },
  1004: { nombre: "Lágrimas de la Diosa", descripcion: "Maná y poder de habilidad" },
  1005: { nombre: "Placa del Muerto", descripcion: "Armadura y vida" },
  1006: { nombre: "Brazalete de Hielo", descripcion: "Resistencia mágica y ralentización" },
  1011: { nombre: "Espada Larga", descripcion: "Ataque físico básico" },
  1018: { nombre: "Túnica de Maná", descripcion: "Maná y poder de habilidad" },
  1026: { nombre: "Púa Nocturna", descripcion: "Ataque y penetración de armadura" },
  1027: { nombre: "Cintura de Gigante", descripcion: "Vida y resistencia mágica" },
  1028: { nombre: "Coraza de Banderizas", descripcion: "Armadura básica" },
  1029: { nombre: "Bota de Movilidad", descripcion: "Velocidad de movimiento" },
  1031: { nombre: "Guardián Celestial", descripcion: "Armadura y regeneración de vida" },
  1033: { nombre: "Brazal de Guantelete", descripcion: "Ataque físico" },
  1035: { nombre: "Capa de Maná", descripcion: "Maná y poder de habilidad" },
  1036: { nombre: "Escudo de la Legión Negra", descripcion: "Armadura y escudo de vida" },
  1037: { nombre: "Túnica Nebuliosa", descripcion: "Resistencia mágica y maná" },
  1038: { nombre: "Velo de la Banshee", descripcion: "Resistencia mágica y escudo de hechizo" },
  1039: { nombre: "Cintura de Fuego", descripcion: "Vida y resistencia mágica" },
  1040: { nombre: "Banda Sedosa de Magi", descripcion: "Resistencia mágica y poder de habilidad" },
  1041: { nombre: "Armadura de Espinas", descripcion: "Armadura y devuelve daño" },
  1042: { nombre: "Priora de Avaros", descripcion: "Poder de habilidad y maná" },
  1043: { nombre: "Morellonomicón", descripcion: "Poder de habilidad y penetración mágica" },
  1044: { nombre: "Apogeo de Poder", descripcion: "Poder de habilidad y velocidad de movimiento" },
  1045: { nombre: "Grimorio Protector", descripcion: "Resistencia mágica y poder de habilidad" },
  1046: { nombre: "Lanza de Shojin", descripcion: "Ataque físico y poder de habilidad" },
  1047: { nombre: "Fuerza de la Trinidad", descripcion: "Ataque, poder de habilidad y velocidad de ataque" },
  1048: { nombre: "Baluarte", descripcion: "Armadura básica mejorada" },
  1049: { nombre: "Armadura Espectral", descripcion: "Armadura y regeneración de vida" },
  1050: { nombre: "Coraza de Mercurio", descripcion: "Resistencia mágica y limpia efectos" },
  1051: { nombre: "Cáliz de Luden", descripcion: "Poder de habilidad, maná y penetración mágica" },
  1052: { nombre: "Rylai de Cristal de Hielo", descripcion: "Poder de habilidad, vida y ralentización" },
  1053: { nombre: "Llave Ardiente", descripcion: "Poder de habilidad y daño al romper estructuras" },
  1054: { nombre: "Abismo del Rencor", descripcion: "Resistencia mágica y regen" },
  1055: { nombre: "Creación de Rylai", descripcion: "Poder de habilidad y ralentización" },
  1056: { nombre: "Yuumi Inmóvil", descripcion: "Poder de habilidad y escudo" },
  1057: { nombre: "Zhonias Cronograma", descripcion: "Armadura y poder de habilidad" },
  2003: { nombre: "Botas de Hechicero", descripcion: "Poder de habilidad" },
  2009: { nombre: "Botas de Mobilidad", descripcion: "Velocidad de movimiento mejorada" },
  2015: { nombre: "Botas de Mercurio", descripcion: "Resistencia mágica y limpia CC" },
  2019: { nombre: "Botas de Armadura", descripcion: "Armadura y reduce CC" },
  2422: { nombre: "Tiniebla Infinita", descripcion: "Ataque físico y penetración de armadura" },
  3001: { nombre: "Espada del Difunto Rey", descripcion: "Ataque físico y life steal" },
  3031: { nombre: "Filo de Triedad", descripcion: "Ataque físico y velocidad de ataque" },
  3033: { nombre: "Bautista de Mercurio", descripcion: "Vida y limpia efectos negativos" },
  3040: { nombre: "Coraza Maldita", descripcion: "Armadura y ralentiza atacantes" },
  3065: { nombre: "Abrazo Espiritual", descripcion: "Vida y regen de vida" },
  3068: { nombre: "Coraza Endurecida", descripcion: "Armadura y reduce daño crítico" },
  3071: { nombre: "Escudo Negro", descripcion: "Ataque y escudo de salud" },
  3074: { nombre: "Espina de Kaenic", descripcion: "Resistencia mágica y devuelve hechizos" },
  3075: { nombre: "Espada de Kaenic", descripcion: "Ataque físico y penetración" },
  3077: { nombre: "Espada Triunitaria", descripcion: "Ataque físico y velocidad de ataque" },
  3078: { nombre: "Trinidad Fuerza", descripcion: "Ataque, poder de habilidad y vida" },
  3082: { nombre: "Piedra de Corazón", descripcion: "Vida y armadura" },
  3083: { nombre: "Peto de Banderizas", descripcion: "Armadura y limpia CC" },
  3084: { nombre: "Armadura de Fuego", descripcion: "Armadura y devuelve daño" },
  3086: { nombre: "Fuerza de Triedad", descripcion: "Ataque, poder de habilidad y movimiento" },
  3087: { nombre: "Brazal de Diamante", descripcion: "Ataque físico" },
  3089: { nombre: "Espada del Rey Arruinado", descripcion: "Ataque y life steal" },
  3091: { nombre: "Filo Nocturno", descripcion: "Ataque y penetración de armadura" },
  3094: { nombre: "Caja de Pandora", descripcion: "Resistencia mágica y poder de habilidad" },
  3100: { nombre: "Gajo de Rylai", descripcion: "Poder de habilidad y ralentización" },
  3109: { nombre: "Mortal Recordatorio", descripcion: "Ataque y reduce curaciones enemigas" },
  3110: { nombre: "Defensa de Kaenic", descripcion: "Resistencia mágica y reduce hechizos" },
  3111: { nombre: "Cáliz Eterno", descripcion: "Vida y maná" },
  3112: { nombre: "Poder de Triedad", descripcion: "Ataque y poder de habilidad" },
  3113: { nombre: "Espada Negra Tiniebla", descripcion: "Ataque físico y penetración" },
  3114: { nombre: "Piedra de Rocavuelta", descripcion: "Armadura y movimiento" },
  3115: { nombre: "Piqueta Nocturna", descripcion: "Ataque físico y penetración" },
  3116: { nombre: "Dinamarca de Fuego", descripcion: "Resistencia mágica y poder de habilidad" },
  3117: { nombre: "Rompedor de Armaduras", descripcion: "Ataque físico" },
  3118: { nombre: "Garra Nocturna", descripcion: "Ataque físico y penetración" },
  3135: { nombre: "Espada Infinita", descripcion: "Ataque físico y escudo" },
  3139: { nombre: "Joya del Loto", descripcion: "Resistencia mágica y regen de vida" },
  3142: { nombre: "Escudo de Silvano", descripcion: "Resistencia mágica y escudo para aliado" },
  3143: { nombre: "Armadura Abismal", descripcion: "Armadura y ralentiza atacantes" },
  3144: { nombre: "Coraza Negra", descripcion: "Armadura y reduce daño" },
  3145: { nombre: "Corazón de Hielo", descripcion: "Vida y ralentización" },
  3146: { nombre: "Rompedor de Espíritus", descripcion: "Resistencia mágica y penetración mágica" },
  3147: { nombre: "Furia Nocturna", descripcion: "Ataque y penetración de armadura" },
  3148: { nombre: "Escudo Abismal", descripcion: "Resistencia mágica y ralentiza atacantes" },
  3149: { nombre: "Abrazo del Serafín", descripcion: "Resistencia mágica y curaciones mejoradas" },
  3150: { nombre: "Piedra Lunar Ardiente", descripcion: "Resistencia mágica y poder de habilidad" },
  3151: { nombre: "Espada del Rey Arruinado", descripcion: "Ataque y curaciones" },
  3152: { nombre: "Rompedor de Arcanos", descripcion: "Poder de habilidad y penetración mágica" },
  3153: { nombre: "Banda Sedosa de Magi", descripcion: "Poder de habilidad y resistencia mágica" },
  3155: { nombre: "Armadura Primaria", descripcion: "Resistencia mágica y regen de vida" },
  3156: { nombre: "Espada Infinita", descripcion: "Ataque físico y escudo" },
  3157: { nombre: "Destrozador de Maldiciones", descripcion: "Resistencia mágica y limpia efectos" },
  3158: { nombre: "Lanza del Destino", descripcion: "Ataque y velocidad de movimiento" },
  3161: { nombre: "Rompedor de Arcanos", descripcion: "Poder de habilidad y penetración mágica" },
  6333: { nombre: "Mejora de Botas", descripcion: "Aumenta velocidad de movimiento" },
  6335: { nombre: "Mejora de Armadura", descripcion: "Aumenta armadura" },
  6337: { nombre: "Mejora de Resistencia", descripcion: "Aumenta resistencia mágica" },
  6609: { nombre: "Mejora de Ataque", descripcion: "Aumenta ataque físico" },
  6617: { nombre: "Mejora de Poder de Habilidad", descripcion: "Aumenta poder de habilidad" },
};

// Cache para items obtenidos de DDragon
let ITEMS_CACHE = {};
let ITEMS_LOADING = false;

// Función para obtener datos de items desde DDragon
async function cargarItemsDeDDragon() {
  if (ITEMS_LOADING || Object.keys(ITEMS_CACHE).length > 0) return;

  ITEMS_LOADING = true;
  try {
    const version = "16.17.1";
    const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/es_ES/item.json`;
    const response = await fetch(url);
    const data = await response.json();

    // Procesar y cachear items
    Object.entries(data.data).forEach(([id, item]) => {
      ITEMS_CACHE[id] = {
        nombre: item.name,
        descripcion: item.plaintext || "Sin descripción"
      };
    });
  } catch (error) {
    console.warn("No se pudieron cargar items de DDragon:", error);
  }
  ITEMS_LOADING = false;
}

// Cargar items al iniciar
cargarItemsDeDDragon();

// Función auxiliar para obtener datos de item
export const obtenerDatosItem = (itemId) => {
  if (!itemId || itemId === 0) return null;

  // Primero buscar en cache de DDragon
  if (ITEMS_CACHE[itemId]) {
    return ITEMS_CACHE[itemId];
  }

  // Luego en la base de datos local
  const datos = ITEMS_DATA[itemId];
  return datos || { nombre: `Item ${itemId}`, descripcion: "Sin información disponible" };
};

// Función auxiliar para obtener datos de hechizo
export const obtenerDatosHechizo = (spellId) => {
  if (!spellId || spellId === 0) return null;
  const datos = SUMMONER_SPELLS[spellId];
  return datos || null;
};
