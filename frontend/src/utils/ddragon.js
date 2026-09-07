const DDRAGON_VERSION = "16.17.1";

const SUMMONER_SPELLS = {
  1: "SummonerBoost",
  3: "SummonerExhaust",
  4: "SummonerFlash",
  6: "SummonerHaste",
  7: "SummonerHeal",
  11: "SummonerSmite",
  12: "SummonerTeleport",
  14: "SummonerDot",
  21: "SummonerBarrier",
  32: "SummonerSnowball",
};

export const champeonImgUrl = (nombreCampeon) =>
  `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${nombreCampeon}.png`;

export const itemImgUrl = (itemId) =>
  itemId && itemId !== 0
    ? `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/item/${itemId}.png`
    : null;

export const summonerSpellImgUrl = (spellId) => {
  const nombre = SUMMONER_SPELLS[spellId];
  return nombre
    ? `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/spell/${nombre}.png`
    : null;
};

export const profileIconUrl = (iconId) =>
  `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/profileicon/${iconId}.png`;
