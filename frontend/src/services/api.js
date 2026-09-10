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

export const getHistorial = (gameName, tagLine) =>
  api.get(`/invocador/${gameName}/${tagLine}/historial/`);

export const getMaestrias = (gameName, tagLine) =>
  api.get(`/invocador/${gameName}/${tagLine}/maestrias/`);

export const actualizarInvocador = (gameName, tagLine) =>
  api.post(`/invocador/${gameName}/${tagLine}/actualizar/`);

export const getPartidaDetalle = (matchId) =>
  api.get(`/partida/${matchId}/`);

export default api;
