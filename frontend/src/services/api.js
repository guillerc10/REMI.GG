import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getPerfil = (gameName, tagLine) =>
  api.get(`/invocador/${gameName}/${tagLine}/`);

export const getLigas = (gameName, tagLine) =>
  api.get(`/invocador/${gameName}/${tagLine}/ligas/`);

export const getWinrate = (gameName, tagLine) =>
  api.get(`/invocador/${gameName}/${tagLine}/winrate/`);

export const getKda = (gameName, tagLine) =>
  api.get(`/invocador/${gameName}/${tagLine}/kda/`);

export const getCampeones = (gameName, tagLine) =>
  api.get(`/invocador/${gameName}/${tagLine}/campeones/`);

export const getCompaneros = (gameName, tagLine) =>
  api.get(`/invocador/${gameName}/${tagLine}/companeros/`);


export const compararInvocadores = (gameName1, tagLine1, gameName2, tagLine2) =>
  api.get(`/comparar/`, {
    params: {
      game_name_1: gameName1,
      tag_line_1: tagLine1,
      game_name_2: gameName2,
      tag_line_2: tagLine2,
    },
  });

export default api; 

export const getHistorial = (gameName, tagLine) =>
  api.get(`/invocador/${gameName}/${tagLine}/historial/`);